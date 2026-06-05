import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { AppProvider, useApp } from './components/AppContext';
import { ExploreTab } from './components/ExploreTab';
import { FavoritesTab } from './components/FavoritesTab';
import { TripsTab } from './components/TripsTab';
import { MessagesTab } from './components/MessagesTab';
import { ProfileTab } from './components/ProfileTab';
import { ListingDetailModal } from './components/ListingDetailModal';
import { PhoneFrame } from './components/PhoneFrame';

// Host Views
import { HostTodayView } from './components/HostTodayView';
import { HostCalendarView } from './components/HostCalendarView';
import { HostListingsView } from './components/HostListingsView';
import { HostMessagesView } from './components/HostMessagesView';
import { HostMenuView } from './components/HostMenuView';
import { HostTransitionOverlay } from './components/HostTransitionOverlay';

import { Search, Heart, Calendar, MessageSquare, User, Bookmark, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom Trips Icon
const TripsCustomIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className} stroke="currentColor" strokeWidth="2.1"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M 6.8,11.5 L 6.8,17 C 6.8,18 7.5,18.8 8.5,18.8 L 13.5,18.8 C 17.5,18.8 19.5,16.5 19.5,13 C 19.5,10.2 18.2,8.2 15.8,6.3 L 12,3.5 L 4.2,10.2" />
    <path d="M 17.2,5 L 17.2,7.5" />
    <path d="M 12,16.5 C 10.5,15.2 10,13.8 10,12.8 C 10,11.7 10.9,10.8 12,10.8 C 13.1,10.8 14,11.7 14,12.8 C 14,13.8 13.5,15.2 12,16.5 Z" />
  </svg>
);

// Slide direction for tab transitions
function getSlideDir(from: string, to: string, tabs: string[]): number {
  const fi = tabs.indexOf(from);
  const ti = tabs.indexOf(to);
  return ti > fi ? 1 : -1;
}

function DashboardLayout() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const prevTabRef = useRef<string>('explore');
  const [slideDir, setSlideDir] = useState(0);
  const { selectedListing, setSelectedListing, listings, isHosting, isTransitioning, targetTransitionMode, triggerModeTransition } = useApp();
  const { t } = useLanguage();

  const tabs = ['explore', 'favorites', 'trips', 'messages', 'profile'];

  const getTabFromPath = (path: string) => {
    if (path.startsWith('/favorites')) return 'favorites';
    if (path.startsWith('/trips'))     return 'trips';
    if (path.startsWith('/messages'))  return 'messages';
    if (path.startsWith('/profile'))   return 'profile';
    return 'explore';
  };

  const activeTab = getTabFromPath(currentPath);

  // Haptic feedback on tab change
  const triggerHaptic = (type: number | number[]) => {
    if (window.navigator?.vibrate) {
      try { window.navigator.vibrate(type); } catch {}
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      const path = window.location.pathname;
      if (path.startsWith('/listing/')) {
        const id = path.split('/listing/')[2] || path.split('/listing/')[1];
        const listing = listings.find(l => l.id === id);
        if (listing) setSelectedListing(listing);
        else setSelectedListing(null);
      } else {
        setSelectedListing(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [listings, setSelectedListing]);

  useEffect(() => {
    const initialPath = window.location.pathname;
    if (initialPath.startsWith('/listing/')) {
      const id = initialPath.split('/listing/')[2] || initialPath.split('/listing/')[1];
      const listing = listings.find(l => l.id === id);
      if (listing) setSelectedListing(listing);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    const dir = getSlideDir(prevTabRef.current, tab, tabs);
    setSlideDir(dir);
    prevTabRef.current = tab;
    const targetPath = tab === 'explore' ? '/' : `/${tab}`;
    window.history.pushState(null, '', targetPath);
    setCurrentPath(targetPath);
    if (selectedListing) setSelectedListing(null);
    triggerHaptic(10);
  };

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
        { id: 'explore',   label: 'اليوم',     icon: <Bookmark   className="w-5.5 h-5.5" /> },
        { id: 'favorites', label: 'التقويم',   icon: <Calendar   className="w-5.5 h-5.5" /> },
        { id: 'trips',     label: 'الإعلانات', icon: <TripsCustomIcon className="w-6 h-6 relative -top-[1px]" /> },
        { id: 'messages',  label: 'الرسائل',   icon: <MessageSquare className="w-5.5 h-5.5" /> },
        { id: 'profile',   label: 'القائمة',   icon: <Menu       className="w-5.5 h-5.5" /> },
      ] as const)
    : ([
        { id: 'explore',   label: t('explore'),   icon: <Search     className="w-5.5 h-5.5" /> },
        { id: 'favorites', label: t('favorites'), icon: <Heart      className="w-5.5 h-5.5" /> },
        { id: 'trips',     label: t('trips'),     icon: <TripsCustomIcon className="w-6 h-6 relative -top-[1px]" /> },
        { id: 'messages',  label: t('messages'),  icon: <MessageSquare className="w-5.5 h-5.5" /> },
        { id: 'profile',   label: t('profile'),   icon: <User       className="w-5.5 h-5.5" /> },
      ] as const);

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden relative bg-white text-zinc-900">
      
      <HostTransitionOverlay isVisible={isTransitioning} targetMode={targetTransitionMode} />

      {/* Main content with slide transition */}
      <main className="flex-1 w-full max-w-7xl mx-auto overflow-y-auto no-scrollbar" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)" }}>
        <AnimatePresence mode="wait" custom={slideDir}>
          <motion.div
            key={activeTab}
            custom={slideDir}
            variants={{
              enter:   (d: number) => ({ opacity: 0,   x: d * 30, scale: 0.98 }),
              center:  { opacity: 1, x: 0,      scale: 1    },
              exit:    (d: number) => ({ opacity: 0,   x: d * -20, scale: 0.98 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Listing modal — Container Transform */}
      <AnimatePresence>
        {selectedListing && (
          <ListingDetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} />
        )}
      </AnimatePresence>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 border-t border-zinc-200/60 shadow-[0_-2px_15px_rgba(0,0,0,0.04)] px-2 py-1.5 transition-all"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)', paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}
        dir="rtl"
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`group relative flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-2xl transition-all duration-200 cursor-pointer w-[19%] min-w-0 press-scale ${
                  isActive ? 'text-[#e01845]' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {/* Active pill indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[#e01845]/8 rounded-2xl"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon with bounce on activate */}
                <motion.div
                  animate={isActive ? { scale: [1, 1.2, 1], y: [0, -2, 0] } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  className="h-6 flex items-center justify-center relative z-10"
                >
                  {item.icon}
                </motion.div>

                <span className={`text-[9px] sm:text-[10px] tracking-tight leading-tight text-center whitespace-nowrap relative z-10 transition-all ${
                  isActive ? 'font-black' : 'font-bold'
                }`}>
                  {item.label}
                </span>
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
        <PhoneFrame>
          <DashboardLayout />
        </PhoneFrame>
      </AppProvider>
    </LanguageProvider>
  );
}
