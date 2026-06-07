import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './AppContext';
import { useLanguage } from './LanguageContext';
import { 
  Settings, HelpCircle, User, Shield, Share2, Scale, LogOut, 
  ChevronLeft, ChevronRight, Compass, Bell, BookOpen, UserCheck, 
  HelpCircle as QuestionIcon, PlusCircle, ArrowLeftRight, CheckCircle2 
} from 'lucide-react';

export const HostMenuView: React.FC<{ onSwitchToTravel: () => void }> = ({ onSwitchToTravel }) => {
  const { userProfile, updateUserProfile } = useApp();
  const { t, language } = useLanguage();

  const [activeSubView, setActiveSubView] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({ ...userProfile });
  const [isSaved, setIsSaved] = useState(false);
  const [notifySetting, setNotifySetting] = useState(true);

  // Scroll tracking to make the Switch button hide on scroll down, expand on scroll up
  const [scrollVisible, setScrollVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down
        setScrollVisible(false);
      } else {
        // Scrolling up
        setScrollVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const renderSubViewContent = () => {
    switch (activeSubView) {
      case 'settings':
        return (
          <form onSubmit={handleProfileSubmit} className="space-y-4 text-right animate-fade-in">
            <h3 className="text-sm font-black text-zinc-900 border-b pb-2 mb-3">تعديل معلومات الحساب الشخصية</h3>
            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full text-xs font-bold bg-zinc-50 text-zinc-805 p-3 rounded-xl border border-zinc-200 focus:border-[#ff385c]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-400 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full text-xs font-bold bg-zinc-50 text-zinc-850 p-3 rounded-xl border border-zinc-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-400 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full text-xs font-bold bg-zinc-50 text-zinc-850 p-3 rounded-xl border border-zinc-200"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#ff385c] hover:bg-rose-600 transition-colors text-white font-black text-xs py-3 rounded-xl w-full flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تحديث وحفظ التغييرات</span>
            </button>
            {isSaved && (
              <p className="text-xs text-rose-500 font-bold text-center animate-pulse">✓ تم حفظ حسابك بنجاح!</p>
            )}
          </form>
        );

      case 'resources':
        return (
          <div className="space-y-4 text-right animate-fade-in font-sans">
            <h3 className="text-sm font-black text-zinc-900 border-b pb-2 mb-3">موارد الاستضافة لعام 2026</h3>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 space-y-2 text-xs font-bold">
              <h4 className="text-[#ff385c] font-black">1. دليل الترحيب بالضيوف</h4>
              <p className="text-zinc-500 leading-relaxed text-[11px]">
                نصائح ضرورية لتحضير الشاليه أو المزرعة السياحية الخاصة بك في تيبازة أو بجاية لاستقبال المصطافين بنجاح.
              </p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 space-y-2 text-xs font-bold">
              <h4 className="text-purple-650 font-black">2. الحجز الفوري التلقائي</h4>
              <p className="text-zinc-500 leading-relaxed text-[11px]">
                احرص على تفعيل الحجز التلقائي في التقويم لرفع معدل مشاهدات إعلانك بمقدار 3 أضعاف.
              </p>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-4 text-right animate-fade-in font-sans">
            <h3 className="text-sm font-black text-zinc-900 border-b pb-2 mb-3">طلب الدعم والمساعدة</h3>
            <p className="text-xs text-zinc-450 leading-relaxed font-bold">
              فريق خدمة العملاء لـ Daro الجزائر متاح دائماً عبر خطوطنا الساخنة:
            </p>
            <div className="p-4 bg-rose-50/20 border border-rose-100 rounded-xl space-y-2 text-xs font-bold text-zinc-800">
              <p>📞 رقم الهاتف المباشر: <span className="text-[#ff385c]">021 99 88 77</span></p>
              <p>✉️ البريد الإلكتروني: <span className="text-[#ff385c]">host-support@daro.dz</span></p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 pt-10 pb-6 space-y-6 text-right select-none relative md:pb-28" dir="rtl">
      
      {/* Top Header with circular profile photo and notifications Exactly like Image 4 */}
      <div className="flex items-center justify-between font-black">
        {/* Top left notifications and mini avatar */}
        <div className="flex items-center gap-3">
          {/* Avatar with initial "G" */}
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-[#ff385c] text-white flex items-center justify-center font-black text-sm shadow-xs border border-white/20">
            <span>G</span>
          </div>

          {/* Bell Icon with pink dot */}
          <button className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 border border-zinc-200/20 hover:bg-zinc-200/65 relative cursor-pointer active:scale-95">
            <Bell className="w-5 h-5 stroke-[2.1]" />
            <span className="absolute top-[10.5px] right-[11.5px] w-2.5 h-2.5 bg-[#ff385c] rounded-full border-2 border-zinc-100 animate-pulse" />
          </button>
        </div>

        {/* Big styled Title "القائمة" */}
        <h1 className="text-[28px] font-black tracking-tight text-zinc-950 leading-none">
          القائمة
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {!activeSubView ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Card overlapping with cozy photos matching Image 4 */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-[28px] p-6 text-right space-y-5.5 relative overflow-hidden shadow-xs">
              <div className="flex gap-2.5 justify-center">
                {/* 3 stacked preview images overlapping exactly like the screenshot */}
                <img
                  className="w-22 h-26 rounded-2xl object-cover -rotate-6 transform translate-x-3.5 shadow-md border-2 border-white"
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80"
                  alt="Cozy 1"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="w-24 h-28 rounded-2xl object-cover scale-105 z-10 shadow-lg border-2 border-white"
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80"
                  alt="Cozy 2"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="w-22 h-26 rounded-2xl object-cover rotate-6 transform -translate-x-3.5 shadow-md border-2 border-white"
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80"
                  alt="Cozy 3"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-base font-black text-zinc-950 leading-snug">
                  هل أنت مضيف جديد على Daro؟
                </h2>
                <p className="text-[11.5px] font-bold text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  اكتشف النصائح وأفضل الممارسات التي يشاركها المضيفون الأعلى تقييمًا.
                </p>
              </div>

              <div className="pt-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => alert("سيتم تفعيل أكاديمية Daro للمضيفين قريباً! تابع أخبارنا.")}
                  className="bg-white text-zinc-905 border border-zinc-200 hover:bg-zinc-100 text-xs font-black py-2.5 px-7 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  ابدأ الآن
                </button>
              </div>
            </div>

            {/* Flat items list of menu options exactly matching Image 4 & 5 */}
            <div className="space-y-0.5 pt-1">
              
              {/* Option 1: Account Settings */}
              <button
                onClick={() => setActiveSubView('settings')}
                className="w-full py-4.5 flex items-center justify-between hover:bg-zinc-50 px-1 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-[#ff385c] shrink-0 border border-rose-100/50">
                    <Settings className="w-5 h-5 stroke-[2] animate-spin-slow" />
                  </div>
                  <span className="text-[13.5px] font-extrabold text-zinc-900">إعدادات الحساب</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2.2px] transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Option 2: Hosting Resources */}
              <button
                onClick={() => setActiveSubView('resources')}
                className="w-full py-4.5 flex items-center justify-between hover:bg-zinc-50 px-1 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-650 shrink-0 border border-purple-100/50">
                    <BookOpen className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[13.5px] font-extrabold text-zinc-900">موارد الاستضافة</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2.2px] transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Option 3: Request Help */}
              <button
                onClick={() => setActiveSubView('help')}
                className="w-full py-4.5 flex items-center justify-between hover:bg-zinc-50 px-1 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0 border border-amber-100/50">
                    <HelpCircle className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[13.5px] font-extrabold text-zinc-900">اطلب المساعدة</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2.2px] transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Divider lines mirroring Image 5 exactly */}
              <div className="border-t border-zinc-150 my-1.5" />

              {/* Option 4: Log Out */}
              <button
                onClick={() => {
                  if (confirm("هل تريد مغادرة المنصة وتسجيل الخروج؟")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-50 px-1 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-500 shrink-0 border">
                    <LogOut className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[13.5px] font-extrabold text-zinc-500">تسجيل الخروج</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2.2px]" />
              </button>

            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-white border border-zinc-200/95 rounded-[28px] p-5.5 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center pb-2.5 border-b border-zinc-100">
              <button
                onClick={() => setActiveSubView(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 cursor-pointer hover:bg-zinc-200/70"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
              <span className="text-xs font-black text-zinc-450">رجوع للقائمة</span>
            </div>
            {renderSubViewContent()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Switch Button (التبديل إلى فضاء الزوار) - Floating Gently! */}
      {/* "اجعله يتحرك عند الصعود و النزول و عند النقر عليه تتحول الواجهة كلها من ضيف الى مستضيف" */}
      <AnimatePresence>
        {scrollVisible && (
          <motion.div
            initial={{ opacity: 0, y: 25, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 25, x: '-50%' }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="fixed bottom-[88px] left-1/2 z-40"
            style={{ x: '-50%' }}
          >
            <button
              onClick={onSwitchToTravel}
              type="button"
              className="bg-zinc-950 hover:bg-black transition-all text-white text-[11.5px] font-black py-3 px-6 rounded-full flex items-center justify-center gap-2 border border-zinc-800 shadow-[0_12px_24px_rgba(0,0,0,0.18)] cursor-pointer select-none whitespace-nowrap active:scale-95 font-sans"
              id="switch-to-travel-floating-btn"
            >
              <ArrowLeftRight className="w-4 h-4 text-[#ff385c]" />
              <span>التبديل إلى فضاء الزوار</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
