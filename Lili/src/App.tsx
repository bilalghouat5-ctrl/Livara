import React, { useState, useEffect, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { AppProvider, useApp } from './components/AppContext';
import { ExploreTab } from './components/ExploreTab';
import { FavoritesTab } from './components/FavoritesTab';
import { TripsTab } from './components/TripsTab';
import { MessagesTab } from './components/MessagesTab';
import { ProfileTab } from './components/ProfileTab';
import { ListingDetailModal } from './components/ListingDetailModal';
import { SplashScreen } from './components/SplashScreen';
import { PushNotificationManager } from './components/PushNotification';

// Host Views
import { HostTodayView } from './components/HostTodayView';
import { HostCalendarView } from './components/HostCalendarView';
import { HostListingsView } from './components/HostListingsView';
import { HostMessagesView } from './components/HostMessagesView';
import { HostMenuView } from './components/HostMenuView';
import { HostTransitionOverlay } from './components/HostTransitionOverlay';

import { Search, Heart, Calendar, MessageSquare, User, Bookmark, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/* ─── Custom House/Pin icon for Trips tab ─── */
const TripsCustomIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M 6.8,11.5 L 6.8,17 C 6.8,18 7.5,18.8 8.5,18.8 L 13.5,18.8 C 17.5,18.8 19.5,16.5 19.5,13 C 19.5,10.2 18.2,8.2 15.8,6.3 L 12,3.5 L 4.2,10.2" />
    <path d="M 17.2,5 L 17.2,7.5" />
    <path d="M 12,16.5 C 10.5,15.2 10,13.8 10,12.8 C 10,11.7 10.9,10.8 12,10.8 C 13.1,10.8 14,11.7 14,12.8 C 14,13.8 13.5,15.2 12,16.5 Z" />
  </svg>
);

/* ─── Haptic feedback helper ─── */
function triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const durations: Record<string, number> = { light: 8, medium: 18, heavy: 35 };
    navigator.vibrate(durations[style] ?? 8);
  }
}

type TabId = 'explore' | 'favorites' | 'trips' | 'messages' | 'profile';

/* ─── Transition variants per tab index ─── */
const TAB_ORDER: TabId[] = ['explore', 'favorites', 'trips', 'messages', 'profile'];

function getTabTransition(from: TabId, to: TabId) {
  const fi = TAB_ORDER.indexOf(from);
  const ti = TAB_ORDER.indexOf(to);
  if (fi === -1 || ti === -1) return { initial: { opacity: 0, y: 8 }, exit: { opacity: 0, y: -8 } };
  if (ti > fi) return { initial: { opacity: 0, x: 22 }, exit: { opacity: 0, x: -22 } };
  return { initial: { opacity: 0, x: -22 }, exit: { opacity: 0, x: 22 } };
}

function DashboardLayout() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [prevTab, setPrevTab] = useState<TabId>('explore');
  const {
    selectedListing,
    setSelectedListing,
    listings,
    isHosting,
    isTransitioning,
    targetTransitionMode,
    triggerModeTransition,
  } = useApp();
  const { t } = useLanguage();

  const getTabFromPath = (path: string): TabId => {
    if (path.startsWith('/favorites')) return 'favorites';
    if (path.startsWith('/trips')) return 'trips';
    if (path.startsWith('/messages')) return 'messages';
    if (path.startsWith('/profile')) return 'profile';
    return 'explore';
  };

  const activeTab = getTabFromPath(currentPath);

  useEffect(() => {
    const handle = () => {
      setCurrentPath(window.location.pathname);
      const path = window.location.pathname;
      if (path.startsWith('/listing/')) {
        const id = path.split('/listing/')[2] || path.split('/listing/')[1];
        const listing = listings.find((l) => l.id === id);
        if (listing) setSelectedListing(listing);
        else setSelectedListing(null);
      } else {
        setSelectedListing(null);
      }
    };
    window.addEventListener('popstate', handle);
    return () => window.removeEventListener('popstate', handle);
  }, [listings, setSelectedListing]);

  useEffect(() => {
    const initialPath = window.location.pathname;
    if (initialPath.startsWith('/listing/')) {
      const id = initialPath.split('/listing/')[2] || initialPath.split('/listing/')[1];
      const listing = listings.find((l) => l.id === id);
      if (listing) setSelectedListing(listing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = useCallback((tab: TabId) => {
    if (tab === activeTab) return;
    triggerHaptic('light');
    setPrevTab(activeTab);
    const targetPath = tab === 'explore' ? '/' : `/${tab}`;
    window.history.pushState(null, '', targetPath);
    setCurrentPath(targetPath);
    if (selectedListing) setSelectedListing(null);
  }, [activeTab, selectedListing, setSelectedListing]);

  useEffect(() => {
    if (selectedListing) {
      const targetPath = `/listing/${selectedListing.id}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ listingId: selectedListing.id }, '', targetPath);
      }
    } else {
      const currentTabPath = activeTab === 'explore' ? '/' : `/${activeTab}`;
      if (window.location.pathname.startsWith('/listing/') && window.location.pathname !== currentTabPath) {
        window.history.pushState(null, '', currentTabPath);
      }
    }
  }, [selectedListing, activeTab]);

  const transition = getTabTransition(prevTab, activeTab);

  const renderActiveTab = () => {
    if (isHosting) {
      switch (activeTab) {
        case 'explore':   return <HostTodayView />;
        case 'favorites': return <HostCalendarView />;
        case 'trips':     return <HostListingsView />;
        case 'messages':  return <HostMessagesView />;
        case 'profile':   return <HostMenuView onSwitchToTravel={() => triggerModeTransition('guest')} />;
        default:          return <HostTodayView />;
      }
    }
    switch (activeTab) {
      case 'explore':   return <ExploreTab />;
      case 'favorites': return <FavoritesTab onNavigateToExplore={() => handleTabChange('explore')} />;
      case 'trips':     return <TripsTab onNavigateToExplore={() => handleTabChange('explore')} />;
      case 'messages':  return <MessagesTab />;
      case 'profile':   return <ProfileTab />;
      default:          return <ExploreTab />;
    }
  };

  const navItems = isHosting
    ? ([
        { id: 'explore',   label: 'اليوم',     icon: <Bookmark   className="w-[22px] h-[22px]" /> },
        { id: 'favorites', label: 'التقويم',   icon: <Calendar   className="w-[22px] h-[22px]" /> },
        { id: 'trips',     label: 'الإعلانات', icon: <TripsCustomIcon className="w-[24px] h-[24px]" /> },
        { id: 'messages',  label: 'الرسائل',   icon: <MessageSquare className="w-[22px] h-[22px]" /> },
        { id: 'profile',   label: 'القائمة',   icon: <Menu       className="w-[22px] h-[22px]" /> },
      ] as const)
    : ([
        { id: 'explore',   label: t('explore'),  icon: <Search     className="w-[22px] h-[22px]" /> },
        { id: 'favorites', label: t('favorites'), icon: <Heart     className="w-[22px] h-[22px]" /> },
        { id: 'trips',     label: t('trips'),     icon: <TripsCustomIcon className="w-[24px] h-[24px]" /> },
        { id: 'messages',  label: t('messages'),  icon: <MessageSquare className="w-[22px] h-[22px]" /> },
        { id: 'profile',   label: t('profile'),   icon: <User      className="w-[22px] h-[22px]" /> },
      ] as const);

  return (
    <div
      className="min-h-screen bg-white text-zinc-900 flex flex-col"
      style={{ paddingBottom: 'var(--nav-height)' }}
    >
      {/* Push notifications */}
      <PushNotificationManager />

      {/* Mode Transition Overlay */}
      <HostTransitionOverlay isVisible={isTransitioning} targetMode={targetTransitionMode} />

      {/* Main content */}
      <main className="flex-1 w-full max-w-lg mx-auto overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${isHosting ? 'host' : 'guest'}-${activeTab}`}
            initial={{ ...transition.initial, position: 'relative' }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ ...transition.exit }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full gpu"
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Listing Detail Modal */}
      <AnimatePresence>
        {selectedListing && (
          <ListingDetailModal
            listing={selectedListing}
            onClose={() => { triggerHaptic('light'); setSelectedListing(null); }}
          />
        )}
      </AnimatePresence>

      {/* ── Bottom Navigation Bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-zinc-200/50 shadow-[0_-1px_12px_rgba(0,0,0,0.04)] bottom-nav"
        dir="rtl"
      >
        <div className="max-w-lg mx-auto flex items-center justify-between px-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as TabId)}
                className={`
                  haptic-tap no-select
                  group flex flex-col items-center justify-center gap-[3px]
                  py-2 px-3 rounded-2xl flex-1 h-[56px]
                  transition-colors duration-150
                  ${isActive ? 'text-[#ff385c]' : 'text-zinc-400 active:text-zinc-600'}
                `}
                id={`btn-nav-tab-${item.id}`}
                aria-label={item.label}
              >
                {/* Icon with active scale */}
                <motion.div
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="h-[24px] flex items-center justify-center"
                >
                  {item.icon}
                </motion.div>

                {/* Label */}
                <span
                  className={`
                    text-[9px] tracking-tight font-black leading-tight text-center
                    whitespace-pre-line transition-colors duration-150
                    ${isActive ? 'text-[#ff385c]' : 'text-zinc-400'}
                  `}
                  style={{ fontSize: '9px' }}
                >
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="w-1 h-1 rounded-full bg-[#ff385c]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <SplashScreen />
        <DashboardLayout />
      </AppProvider>
    </LanguageProvider>
  );
}
