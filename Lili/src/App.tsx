import React, { useState, useEffect } from 'react';
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

// Icons
import { Search, Heart, Calendar, MessageSquare, User, Bookmark, Menu, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TripsCustomIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
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
      {/* Outer house shape with rounded left corner and organic loop on the right */}
      <path d="M 6.8,11.5 L 6.8,17 C 6.8,18 7.5,18.8 8.5,18.8 L 13.5,18.8 C 17.5,18.8 19.5,16.5 19.5,13 C 19.5,10.2 18.2,8.2 15.8,6.3 L 12,3.5 L 4.2,10.2" />
      {/* Vertical Chimney */}
      <path d="M 17.2,5 L 17.2,7.5" />
      {/* Inner Location Pin */}
      <path d="M 12,16.5 C 10.5,15.2 10,13.8 10,12.8 C 10,11.7 10.9,10.8 12,10.8 C 13.1,10.8 14,11.7 14,12.8 C 14,13.8 13.5,15.2 12,16.5 Z" />
    </svg>
  );
};

function DashboardLayout() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { 
    selectedListing, 
    setSelectedListing, 
    listings,
    isHosting,
    isTransitioning,
    targetTransitionMode,
    triggerModeTransition
  } = useApp();
  const { t } = useLanguage();

  // Helper to map pathname to active tab
  const getTabFromPath = (path: string): 'explore' | 'favorites' | 'trips' | 'messages' | 'profile' => {
    if (path.startsWith('/favorites')) return 'favorites';
    if (path.startsWith('/trips')) return 'trips';
    if (path.startsWith('/messages')) return 'messages';
    if (path.startsWith('/profile')) return 'profile';
    return 'explore';
  };

  const activeTab = getTabFromPath(currentPath);

  // Sync window navigation events (like Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      
      const path = window.location.pathname;
      if (path.startsWith('/listing/')) {
        const id = path.split('/listing/')[2] || path.split('/listing/')[1];
        const listing = listings.find((l) => l.id === id);
        if (listing) {
          setSelectedListing(listing);
        } else {
          setSelectedListing(null);
        }
      } else {
        setSelectedListing(null);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [listings, setSelectedListing]);

  // Initial mount check for listing in path
  useEffect(() => {
    const initialPath = window.location.pathname;
    if (initialPath.startsWith('/listing/')) {
      const id = initialPath.split('/listing/')[2] || initialPath.split('/listing/')[1];
      const listing = listings.find((l) => l.id === id);
      if (listing) {
        setSelectedListing(listing);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate to a new tab/path
  const handleTabChange = (tab: 'explore' | 'favorites' | 'trips' | 'messages' | 'profile') => {
    const targetPath = tab === 'explore' ? '/' : `/${tab}`;
    window.history.pushState(null, '', targetPath);
    setCurrentPath(targetPath);
    
    // Smoothly close any listing modal if switching tabs
    if (selectedListing) {
      setSelectedListing(null);
    }
  };

  // Keep listing URL in sync when dynamically opened
  useEffect(() => {
    if (selectedListing) {
      const targetPath = `/listing/${selectedListing.id}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ listingId: selectedListing.id }, '', targetPath);
      }
    } else {
      // Revert back directly to active tab path if modal closes
      const currentTabPath = activeTab === 'explore' ? '/' : `/${activeTab}`;
      if (window.location.pathname.startsWith('/listing/') && window.location.pathname !== currentTabPath) {
        window.history.pushState(null, '', currentTabPath);
      }
    }
  }, [selectedListing, activeTab]);

  const renderActiveTab = () => {
    if (isHosting) {
      switch (activeTab) {
        case 'explore':
          return <HostTodayView />;
        case 'favorites':
          return <HostCalendarView />;
        case 'trips':
          return <HostListingsView />;
        case 'messages':
          return <HostMessagesView />;
        case 'profile':
          return <HostMenuView onSwitchToTravel={() => triggerModeTransition('guest')} />;
        default:
          return <HostTodayView />;
      }
    }

    switch (activeTab) {
      case 'explore':
        return <ExploreTab />;
      case 'favorites':
        return <FavoritesTab onNavigateToExplore={() => handleTabChange('explore')} />;
      case 'trips':
        return <TripsTab onNavigateToExplore={() => handleTabChange('explore')} />;
      case 'messages':
        return <MessagesTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <ExploreTab />;
    }
  };

  // Nav bottom item definitions - oversized TripsCustomIcon with w-6.5 h-6.5 and a tiny vertical alignment tweak
  const navItems = isHosting
    ? ([
        { id: 'explore', label: 'اليوم', icon: <Bookmark className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
        { id: 'favorites', label: 'التقويم', icon: <Calendar className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
        { id: 'trips', label: 'الإعلانات', icon: <TripsCustomIcon className="w-6.5 h-6.5 transition-transform duration-305 group-hover:scale-110 relative -top-[1.5px]" /> },
        { id: 'messages', label: 'الرسائل', icon: <MessageSquare className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
        { id: 'profile', label: 'القائمة', icon: <Menu className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
      ] as const)
    : ([
        { id: 'explore', label: t('explore'), icon: <Search className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
        { id: 'favorites', label: t('favorites'), icon: <Heart className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
        { id: 'trips', label: t('trips'), icon: <TripsCustomIcon className="w-6.5 h-6.5 transition-transform duration-305 group-hover:scale-110 relative -top-[1.5px]" /> },
        { id: 'messages', label: t('messages'), icon: <MessageSquare className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
        { id: 'profile', label: t('profile'), icon: <User className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
      ] as const);

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden relative bg-white text-zinc-900">
      
      {/* 3-Second Premium Host/Guest Mode Transition State */}
      <HostTransitionOverlay isVisible={isTransitioning} targetMode={targetTransitionMode} />

      {/* CORE WRAPPER SCENE */}
      <main className="flex-1 w-full max-w-7xl mx-auto overflow-y-auto no-scrollbar pb-24 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FLOATING DETAILED STAY OVERLAY */}
      <AnimatePresence>
        {selectedListing && (
          <ListingDetailModal 
            listing={selectedListing} 
            onClose={() => setSelectedListing(null)} 
          />
        )}
      </AnimatePresence>

      {/* BOTTOM PHONE NAVIGATION BAR (ساقية التنقل السفلية) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200/60 shadow-[0_-2px_15px_rgba(0,0,0,0.03)] px-3 py-2 transition-all" dir="rtl">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`group flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl transition-all relative cursor-pointer active:scale-95 w-20 h-14 ${
                  isActive 
                  ? 'text-[#ff385c] font-black' 
                  : 'text-zinc-400 hover:text-zinc-650'
                }`}
                id={`btn-nav-tab-${item.id}`}
              >
                <div className="h-6 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-[9px] sm:text-[10px] tracking-tight font-black leading-tight text-center whitespace-pre-line h-6 flex items-center justify-center">
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
