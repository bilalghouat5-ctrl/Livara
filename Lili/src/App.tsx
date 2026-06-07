import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { AppProvider, useApp } from './components/AppContext';
import { ExploreTab } from './components/ExploreTab';
import { FavoritesTab } from './components/FavoritesTab';
import { TripsTab } from './components/TripsTab';
import { MessagesTab } from './components/MessagesTab';
import { ProfileTab } from './components/ProfileTab';
import { ListingDetailModal } from './components/ListingDetailModal';
import { playHapticSound } from './components/InteractionShowcase';

// Host Views
import { HostTodayView } from './components/HostTodayView';
import { HostCalendarView } from './components/HostCalendarView';
import { HostListingsView } from './components/HostListingsView';
import { HostMessagesView } from './components/HostMessagesView';
import { HostMenuView } from './components/HostMenuView';
import { HostTransitionOverlay } from './components/HostTransitionOverlay';

// Icons
import { Search, Heart, Calendar, MessageSquare, User, Bookmark, Menu, Play, X, Lock } from 'lucide-react';
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
    triggerModeTransition,
    isRegistered,
    setIsRegistered,
    updateUserProfile
  } = useApp();
  const { t } = useLanguage();

  // Auth Bottom Splash States
  const [showAuthSplash, setShowAuthSplash] = useState(false);
  const [pendingTab, setPendingTab] = useState<'favorites' | 'trips' | 'messages' | null>(null);
  const [authIsLogin, setAuthIsLogin] = useState(false);
  const [authRegName, setAuthRegName] = useState('');
  const [authRegPhone, setAuthRegPhone] = useState('');
  const [authRegWilaya, setAuthRegWilaya] = useState('الجزائر العاصمة');
  const [authRegEmail, setAuthRegEmail] = useState('');
  const [authRegError, setAuthRegError] = useState('');

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

  // Navigate to a new tab/path with haptic sound feedback
  const handleTabChange = (tab: 'explore' | 'favorites' | 'trips' | 'messages' | 'profile') => {
    playHapticSound('tap');
    
    const targetPath = tab === 'explore' ? '/' : `/${tab}`;
    window.history.pushState(null, '', targetPath);
    setCurrentPath(targetPath);
    
    // Smoothly close any listing modal if switching tabs
    if (selectedListing) {
      setSelectedListing(null);
    }
  };

  const tabOrder = ['explore', 'favorites', 'trips', 'messages', 'profile'] as const;

  const handlePageSwipe = (_event: any, info: any) => {
    const swipeThreshold = 100;
    const activeIdx = tabOrder.indexOf(activeTab);
    
    // Detect swipe right/left with RTL offset logic
    if (info.offset.x > swipeThreshold) {
      // Swipe Right -> previous tab
      const prevIdx = (activeIdx - 1 + tabOrder.length) % tabOrder.length;
      handleTabChange(tabOrder[prevIdx]);
    } else if (info.offset.x < -swipeThreshold) {
      // Swipe Left -> next tab
      const nextIdx = (activeIdx + 1) % tabOrder.length;
      handleTabChange(tabOrder[nextIdx]);
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
        return (
          <FavoritesTab
            onNavigateToExplore={() => handleTabChange('explore')}
            onLoginRequested={() => {
              setAuthRegError('');
              setPendingTab('favorites');
              setShowAuthSplash(true);
            }}
          />
        );
      case 'trips':
        return (
          <TripsTab
            onNavigateToExplore={() => handleTabChange('explore')}
            onLoginRequested={() => {
              setAuthRegError('');
              setPendingTab('trips');
              setShowAuthSplash(true);
            }}
          />
        );
      case 'messages':
        return (
          <MessagesTab
            onLoginRequested={() => {
              setAuthRegError('');
              setPendingTab('messages');
              setShowAuthSplash(true);
            }}
          />
        );
      case 'profile':
        return (
          <ProfileTab
            onLoginRequested={() => {
              setAuthRegError('');
              setPendingTab('profile');
              setShowAuthSplash(true);
            }}
          />
        );
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
        { id: 'explore', label: 'استكشف', icon: <Search className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
        { id: 'favorites', label: 'مختاراتك', icon: <Heart className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
        { id: 'trips', label: 'الرحلات', icon: <TripsCustomIcon className="w-6.5 h-6.5 transition-transform duration-350 group-hover:scale-110 relative -top-[1.5px]" /> },
        { id: 'messages', label: 'الرسائل', icon: <MessageSquare className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
        { id: 'profile', label: isRegistered ? 'الملف الشخصي' : 'تسجيل الدخول', icon: <User className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" /> },
      ] as const);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-zinc-900 relative max-w-md mx-auto sm:shadow-[0_0_35px_rgba(0,0,0,0.06)] sm:border-x sm:border-zinc-150">
      
      {/* 3-Second Premium Host/Guest Mode Transition State */}
      <HostTransitionOverlay isVisible={isTransitioning} targetMode={targetTransitionMode} />

      {/* CORE WRAPPER SCENE */}
      <main className="flex-1 w-full max-w-7xl mx-auto overflow-y-auto no-scrollbar pb-24 pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            dragDirectionLock
            onDragEnd={handlePageSwipe}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FLOATING DETAILED STAY OVERLAY */}
      {selectedListing && (
        <ListingDetailModal 
          listing={selectedListing} 
          onClose={() => setSelectedListing(null)} 
        />
      )}

      {/* BOTTOM PHONE NAVIGATION BAR (ساقية التنقل السفلية) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-48 bg-white border-t border-zinc-200/60 shadow-[0_-2px_15px_rgba(0,0,0,0.03)] px-3 py-2 transition-all" dir="rtl">
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

      {/* FLOATING BOTTOM SPLASH / BOTTOM SHEET FOR AUTHENTICATION */}
      <AnimatePresence>
        {showAuthSplash && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 backdrop-blur-xs font-sans">
            {/* Backdrop Tap-to-dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setShowAuthSplash(false)}
            />

            {/* Bottom Sheet Card */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-white rounded-t-[2.5rem] shadow-2xl px-6 pt-6 pb-8 border-t border-zinc-150/70 z-[100] flex flex-col space-y-4 max-h-[85vh] overflow-y-auto text-right"
              dir="rtl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  playHapticSound('select');
                  setShowAuthSplash(false);
                }}
                className="absolute top-5 left-5 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 cursor-pointer active:scale-90 transition-all border border-zinc-200/30"
                title="إغلاق التنبيه"
              >
                <X className="w-4 h-4 text-zinc-600" />
              </button>

              {/* Branding and Message */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center gap-1.5 justify-start">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff385c]" />
                  <span className="text-[12px] font-black text-[#ff385c]">تسجيل الدخول مطلوب 🔐</span>
                </div>
                <h3 className="text-lg font-black text-zinc-950 tracking-tight leading-relaxed">
                  أنشئ حسابك أو سجل دخولك للاستمرار
                </h3>
                <p className="text-[11px] text-zinc-500 font-bold leading-normal">
                  يرجى تأكيد هويتك لتتمكن من تصفح {pendingTab === 'favorites' ? 'مفضلاتك' : pendingTab === 'trips' ? 'رحلاتك وحجوزاتك' : 'رسائلك ومناقشاتك مع المضيفين'}!
                </p>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-2xl border border-zinc-200/20">
                <button
                  type="button"
                  onClick={() => { playHapticSound('select'); setAuthIsLogin(false); }}
                  className={`py-2.5 text-xs font-black rounded-xl text-center cursor-pointer transition-all ${!authIsLogin ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-850'}`}
                >
                  إنشاء حساب جديد
                </button>
                <button
                  type="button"
                  onClick={() => { playHapticSound('select'); setAuthIsLogin(true); }}
                  className={`py-2.5 text-xs font-black rounded-xl text-center cursor-pointer transition-all ${authIsLogin ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  تسجيل الدخول
                </button>
              </div>

              {/* Error Alert */}
              {authRegError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-right flex items-center gap-2">
                  <span className="text-sm select-none">⚠️</span>
                  <p className="text-[10px] font-bold text-red-500 leading-none">{authRegError}</p>
                </div>
              )}

              {/* Form Content */}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (authIsLogin) {
                  if (!authRegPhone.trim()) {
                    setAuthRegError('الرجاء كتابة رقم هاتفك المسجل لدينا.');
                    return;
                  }
                  const loggedInProfile = {
                    name: 'عضو Daro المميز',
                    phone: authRegPhone.trim(),
                    email: 'member@daro.dz',
                    wilaya: 'ولاية الجزائر',
                    joinedDate: 'جوان 2026',
                    bio: `عضو وفي في عائلة Daro المميزة بـ 58 ولاية.`,
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                    verified: true
                  };
                  updateUserProfile(loggedInProfile);
                  setIsRegistered(true);
                  playHapticSound('success');

                  // Auto fulfill target tab redirect
                  if (pendingTab) {
                    const targetPath = `/${pendingTab}`;
                    window.history.pushState(null, '', targetPath);
                    setCurrentPath(targetPath);
                    setPendingTab(null);
                  }
                  setShowAuthSplash(false);
                } else {
                  if (!authRegName.trim()) {
                    setAuthRegError('الرجاء كتابة اسمك لتسهيل التواصل مع المضيفين');
                    return;
                  }
                  if (!authRegPhone.trim()) {
                    setAuthRegError('رقم الهاتف ضروري للغاية لإتمام وتأكيد الحجوزات');
                    return;
                  }
                  const phoneClean = authRegPhone.replace(/\s+/g, '');
                  if (phoneClean.length < 9) {
                    setAuthRegError('رقم الهاتف غير صالح، يرجى كتابته بالشكل الصحيح');
                    return;
                  }

                  const newProfile = {
                    name: authRegName.trim(),
                    phone: authRegPhone.trim(),
                    email: authRegEmail.trim() || `${authRegName.trim().replace(/\s+/g, '')}@daro.dz`,
                    wilaya: authRegWilaya,
                    joinedDate: 'جوان 2026',
                    bio: `عضو جديد وفخور في عائلة Daro من ${authRegWilaya}. يسعى لاستكشاف أجمل معالم الجزائر السياحية.`,
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                    verified: true
                  };

                  updateUserProfile(newProfile);
                  setIsRegistered(true);
                  playHapticSound('success');

                  // Auto fulfill target tab redirect
                  if (pendingTab) {
                    const targetPath = `/${pendingTab}`;
                    window.history.pushState(null, '', targetPath);
                    setCurrentPath(targetPath);
                    setPendingTab(null);
                  }
                  setShowAuthSplash(false);
                }
              }} className="space-y-4">

                {!authIsLogin && (
                  <div className="space-y-1 text-right">
                    <label className="text-[10px] font-black text-zinc-500">الاسم الكامل 👤</label>
                    <input
                      type="text"
                      required
                      value={authRegName}
                      onChange={(e) => { setAuthRegName(e.target.value); setAuthRegError(''); }}
                      placeholder="مثلاً: سامي بلعيد"
                      className="w-full h-11 px-4 text-xs font-black bg-zinc-50 text-zinc-950 rounded-2xl border border-zinc-200/60 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-[#ff385c] outline-hidden text-right leading-none"
                    />
                  </div>
                )}

                <div className="space-y-1 text-right">
                  <label className="text-[10px] font-black text-zinc-500">
                    {authIsLogin ? 'رقم الهاتف المسجل 📞' : 'رقم الهاتف 📞'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={authRegPhone}
                    onChange={(e) => { setAuthRegPhone(e.target.value); setAuthRegError(''); }}
                    placeholder="مثلاً: 0550 11 22 33"
                    className="w-full h-11 px-4 text-xs font-black bg-zinc-50 text-zinc-950 rounded-2xl border border-zinc-200/60 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-[#ff385c] outline-hidden text-right font-mono tracking-wider leading-none"
                  />
                </div>

                {!authIsLogin && (
                  <>
                    <div className="space-y-1 text-right">
                      <label className="text-[10px] font-black text-zinc-500">الولاية 📍</label>
                      <select
                        value={authRegWilaya}
                        onChange={(e) => setAuthRegWilaya(e.target.value)}
                        className="w-full h-11 px-4 text-xs font-black bg-zinc-50 text-zinc-950 rounded-2xl border border-zinc-200/60 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-[#ff385c] outline-hidden text-right leading-none text-zinc-800"
                        dir="rtl"
                      >
                        <option value="ولاية الجزائر">الجزائر العاصمة 🇩🇿</option>
                        <option value="ولاية وهران">وهران</option>
                        <option value="ولاية تيبازة">تيبازة</option>
                        <option value="ولاية بجاية">بجاية</option>
                        <option value="ولاية جيجل">جيجل</option>
                        <option value="ولاية قسنطينة">قسنطينة</option>
                        <option value="ولاية تلمسان">تلمسان</option>
                        <option value="ولاية بسكرة">بسكرة</option>
                        <option value="ولاية باتنة">باتنة</option>
                        <option value="ولاية تيزي وزو">تيزي وزو</option>
                        <option value="ولاية البويرة">البويرة</option>
                        <option value="ولاية البليدة">البليدة</option>
                        <option value="ولاية عنابة">عنابة</option>
                        <option value="ولاية سطيف">سطيف</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-right">
                      <label className="text-[10px] font-black text-zinc-500">البريد الإلكتروني (اختياري) ✉️</label>
                      <input
                        type="email"
                        value={authRegEmail}
                        onChange={(e) => { setAuthRegEmail(e.target.value); setAuthRegError(''); }}
                        placeholder="مثلاً: sami@daro.dz"
                        className="w-full h-11 px-4 text-xs font-black bg-zinc-50 text-zinc-950 rounded-2xl border border-zinc-200/60 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-[#ff385c] outline-hidden text-right leading-none"
                      />
                    </div>
                  </>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-855 text-white font-black text-xs rounded-2xl active:scale-95 transition-all shadow-md cursor-pointer text-center"
                  >
                    {authIsLogin ? 'تسجيل دخول ومتابعة 🚀' : 'إنشاء حساب الان والمواصلة 🚀'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <DashboardLayout />
      </AppProvider>
    </LanguageProvider>
  );
}
