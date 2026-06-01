import { useSwipeBack } from '../hooks/useSwipeBack';
import { ASIREM_LOGO_B64 } from '../assets/asiremLogo';
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from './AppContext';
import { useLanguage } from './LanguageContext';
import { languageNames } from '../translations';
import { UserProfile } from '../types';
import hostWavingAvatar from '../assets/images/host_waving_avatar_1780305236362.png';
import { 
  User, Settings, HelpCircle, Shield, Share2, Scale, 
  LogOut, CheckCircle2, Copy, Globe, ChevronLeft, 
  ChevronRight, ArrowRight, ArrowLeft, Star, Award, Sparkles, AlertCircle,
  Bell, Hand, Key, FileText, ArrowLeftRight, X, Lock, CreditCard, Briefcase, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Demo certified legal co-hosts in Algeria
const CO_HOSTS_LIST = [
  { id: 'ch1', name: 'يوسف مزايري', city: 'الجزائر العاصمة', rating: 4.9, bio: 'وكيل عقاري معتمد بخبرة 12 سنة ببلدية سيدي يحيى وحيدرة. إدارة تامة واستقبال السياح.', phone: '0551 11 22 33' },
  { id: 'ch2', name: 'أمين بلحسن', city: 'وهران جبهة البحر', rating: 4.8, bio: 'إدارة شقق فاخرة وإقامات فندقية بالباهية وهران الكبرى مع خدمة النظافة الفندقية الشاملة.', phone: '0560 44 55 66' },
  { id: 'ch3', name: 'كمال جاب الله', city: 'بجاية وتيزي وزو', rating: 4.95, bio: 'متخصص في كراء وإدارة الشاليهات الجبلية والغابية بمنطقة القبائل وتيكجدا.', phone: '0555 77 88 99' },
  { id: 'ch4', name: 'عبد الحميد الهادي', city: 'جيجل الطاهير', rating: 4.75, bio: 'تسيير وتأجير البنغالوهات الشاطئية الصيفية بجيجل وزيامة منصورية قانونياً وسياحياً.', phone: '0770 12 34 88' },
];

const AlgerianFAQs = [
  { q: 'ما هي وسائل الدفع المدعومة في الجزائر؟', a: 'ندعم حالياً الدفع اليدوي عند الاستلام، والتحويل عبر تطبيق بريدي موب (BaridiMob) لبريد الجزائر بالإضافة إلى حوالات CCP وحساب الدفع الذاتي.' },
  { q: 'كيف تلغى الحجوزات المستعجلة؟', a: 'يمكنك إلغاء أي حجز قادم مجاناً عبر تبويب "الرحلات" بالنقر على زر ملخص الإلغاء لاسترجاع عربونك كاملاً.' },
];


export const ProfileTab: React.FC = () => {
  const { userProfile, updateUserProfile, bookings, favorites, triggerModeTransition } = useApp();
  const { t, language, setLanguage } = useLanguage();

  const [activeSubView, setActiveSubView] = useState<string | null>(null);
  const [settingsSubSection, setSettingsSubSection] = useState<string | null>(null);
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState<UserProfile>({ ...userProfile });
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const [scrollVisible, setScrollVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setScrollVisible(false); // Scrolling down, hide pill icon elegantly
      } else {
        setScrollVisible(true); // Scrolling up or stopped at top, show it
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Privacy states
  const [cookieConsent, setCookieConsent] = useState(true);
  const [locationConsent, setLocationConsent] = useState(false);
  
  // Help state
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Non-blocking in-UI overlays (improves iframe user experience)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [requestedCoHostName, setRequestedCoHostName] = useState<string | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`DARO-HOST-REF-${profileForm.phone.replace(/\s+/g, '')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleCoHostRequest = (name: string) => {
    setRequestedCoHostName(name);
    setTimeout(() => {
      setRequestedCoHostName(null);
    }, 4000);
  };

  // Render Subpages smoothly
  const renderSubView = () => {
    switch (activeSubView) {
      case 'settings':
        return (
          <div className="space-y-5 animate-fade-in" id="profile-subview-settings" dir="rtl">
            {/* 1. Header Row exactly matching Image 4 & 5 */}
            <div className="flex items-center justify-between pb-1">
              {/* Spacer on left for symmetry */}
              <div className="w-9 h-9 opacity-0 pointer-events-none" />

              {/* Centered/Right title if subsection is open */}
              {settingsSubSection && (
                <h3 className="text-[15px] font-black text-zinc-900">
                  {settingsSubSection === 'personal' && 'المعلومات الشخصية'}
                  {settingsSubSection === 'security' && 'تسجيل الدخول والأمان'}
                  {settingsSubSection === 'privacy' && 'الخصوصية'}
                  {settingsSubSection === 'notifications' && 'الإشعارات'}
                  {settingsSubSection === 'payments' && 'الدفعات'}
                  {settingsSubSection === 'translation' && 'الترجمة'}
                  {settingsSubSection === 'permissions' && 'أذونات الحجز'}
                  {settingsSubSection === 'business' && 'السفر من أجل العمل'}
                  {settingsSubSection === 'accessibility' && 'سهولة الوصول'}
                  {settingsSubSection === 'taxes' && 'الضرائب'}
                  {settingsSubSection === 'first_guest' && 'ضيفك الأول'}
                </h3>
              )}

              {/* Circular Back button exactly matching the images */}
              <button
                onClick={() => {
                  if (settingsSubSection) {
                    setSettingsSubSection(null);
                  } else {
                    setActiveSubView(null);
                  }
                }}
                className="w-10 h-10 bg-zinc-100/80 hover:bg-zinc-200/60 rounded-full flex items-center justify-center transition-all cursor-pointer haptic-tap text-zinc-900 border border-zinc-200/30 shadow-xs"
                title="رجوع"
              >
                {language === 'ar' ? <ArrowRight className="w-5 h-5 stroke-[2.5px]" /> : <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />}
              </button>
            </div>

            {!settingsSubSection ? (
              /* ==================== MAIN ACCOUNT SETTINGS LIST VIEW ==================== */
              <div className="space-y-5 animate-fade-in">
                {/* Big aligned Title "إعدادات الحساب" */}
                <h1 className="text-[26px] font-black text-[#111111] text-right tracking-tight leading-none pr-1">
                  إعدادات الحساب
                </h1>

                {/* 2. Notification Permission Card matching Image 4 */}
                {showNotificationBanner && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-zinc-100/55 rounded-3xl p-5 relative border border-zinc-200/20 text-right space-y-4 shadow-sm"
                  >
                    {/* Corner close sign */}
                    <button
                      type="button"
                      onClick={() => setShowNotificationBanner(false)}
                      className="absolute top-4 left-4 w-6 h-6 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all text-zinc-650 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.2px]" />
                    </button>

                    {/* Inline Title & Bell Emoji */}
                    <div className="flex items-center gap-2 justify-end pr-1">
                      <span className="text-[13.5px] font-black text-[#111111]">
                        تشغيل الإشعارات
                      </span>
                      <span className="text-base select-none">🔔</span>
                    </div>

                    {/* Description Subtext */}
                    <p className="text-[11px] font-bold text-zinc-500 leading-relaxed pl-8">
                      ابقَ على اطلاع دائم بالرسائل الجديدة وتفاصيل الحجوزات.
                    </p>

                    {/* Primary Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          alert("تم تفعيل إشعارات المتصفح بنجاح! ستتلقى تفاصيل الحجز الفوري أولاً بأول.");
                          setShowNotificationBanner(false);
                        }}
                        className="w-full bg-white hover:bg-zinc-50 font-black text-[11.5px] text-[#111111] py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                      >
                        نعم، أرجو إبلاغي
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 3. Account Settings Flat Options List */}
                <div className="space-y-0.5">
                  {/* Row 1: personal info */}
                  <button
                    onClick={() => setSettingsSubSection('personal')}
                    className="w-full py-3.5 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <User className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                      </div>
                      <span className="text-[13px] font-extrabold text-[#111111]">المعلومات الشخصية</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  {/* Row 2: Login / Security */}
                  <button
                    onClick={() => setSettingsSubSection('security')}
                    className="w-full py-3.5 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <Lock className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                      </div>
                      <span className="text-[13px] font-extrabold text-[#111111]">تسجيل الدخول والأمان</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  {/* Row 3: Privacy */}
                  <button
                    onClick={() => setSettingsSubSection('privacy')}
                    className="w-full py-3.5 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <Hand className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                      </div>
                      <span className="text-[13px] font-extrabold text-[#111111]">الخصوصية</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  {/* Row 4: Notifications Preference */}
                  <button
                    onClick={() => setSettingsSubSection('notifications')}
                    className="w-full py-3.5 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <Bell className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                      </div>
                      <span className="text-[13px] font-extrabold text-[#111111]">الإشعارات</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  {/* Row 5: Payments */}
                  <button
                    onClick={() => setSettingsSubSection('payments')}
                    className="w-full py-3.5 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <CreditCard className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                      </div>
                      <span className="text-[13px] font-extrabold text-[#111111]">الدفعات</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  {/* Row 6: Globe / Translation */}
                  <button
                    onClick={() => setSettingsSubSection('translation')}
                    className="w-full py-3.5 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <Globe className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                      </div>
                      <span className="text-[13px] font-extrabold text-[#111111]">الترجمة</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] group-hover:-translate-[2.5px] transition-transform" />
                  </button>

                  {/* Row 7: Booking permissions */}
                  <button
                    onClick={() => setSettingsSubSection('permissions')}
                    className="w-full py-3.5 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <Key className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                      </div>
                      <span className="text-[13px] font-extrabold text-[#111111]">أذونات الحجز</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  {/* Row 8: Business traveling */}
                  <button
                    onClick={() => setSettingsSubSection('business')}
                    className="w-full py-3.5 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                      </div>
                      <span className="text-[13px] font-extrabold text-[#111111]">السفر من أجل العمل</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  {/* Row 9: Accessibility */}
                  <button
                    onClick={() => setSettingsSubSection('accessibility')}
                    className="w-full py-3.5 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <Settings className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                      </div>
                      <span className="text-[13px] font-extrabold text-[#111111]">سهولة الوصول</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Divider exactly matching Image 5 */}
                <div className="border-t border-zinc-150/80 my-2.5" />

                {/* Flat Option Section 2 (Taxes & First Guest) */}
                <div className="space-y-0.5">
                  {/* Row 10: Taxes */}
                  <button
                    onClick={() => setSettingsSubSection('taxes')}
                    className="w-full py-3.5 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <FileText className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                      </div>
                      <span className="text-[13px] font-extrabold text-[#111111]">الضرائب</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  {/* Row 11: First Guest */}
                  <button
                    onClick={() => setSettingsSubSection('first_guest')}
                    className="w-full py-3.5 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <UserPlus className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                      </div>
                      <span className="text-[13px] font-extrabold text-[#111111]">ضيفك الأول</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Version + Asirem CORP. logo image */}
                <div className="pt-8 flex flex-col items-end justify-start gap-2 pr-4 animate-fade-in" dir="rtl">
                  <span className="text-[11px] font-sans font-bold text-zinc-400 tracking-wide leading-none">
                    Version 6.7.34
                  </span>
                  {/* Asirem CORP. logo image — same width as version text line */}
                  <div className="mt-0.5 no-select" dir="ltr">
                    <img
                      src={ASIREM_LOGO_B64}
                      alt="Asirem CORP."
                      className="h-[18px] w-auto object-contain opacity-80"
                      draggable={false}
                      style={{ filter: 'brightness(0.88)' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* ==================== SUBSECTIONS INNER RENDERING ==================== */
              <div className="pt-2 animate-fade-in text-right">
                {/* 1. Personal Information page */}
                {settingsSubSection === 'personal' && (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-black text-zinc-400 mb-1">الاسم الكامل</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full text-xs font-bold bg-zinc-50 text-zinc-850 p-3.5 rounded-xl border border-zinc-200 focus:border-[#ff385c] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-zinc-400 mb-1">البريد الإلكتروني</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full text-xs font-bold bg-zinc-50 text-zinc-850 p-3.5 rounded-xl border border-zinc-200 focus:border-[#ff385c] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-zinc-400 mb-1">رقم الهاتف</label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full text-xs font-bold bg-zinc-50 text-zinc-850 p-3.5 rounded-xl border border-zinc-200 focus:border-[#ff385c] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-zinc-400 mb-1">الولاية الحالية</label>
                        <input
                          type="text"
                          value={profileForm.wilaya}
                          onChange={(e) => setProfileForm({ ...profileForm, wilaya: e.target.value })}
                          className="w-full text-xs font-bold bg-zinc-50 text-zinc-850 p-3.5 rounded-xl border border-zinc-200 focus:border-[#ff385c] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-zinc-400 mb-1">نبذة شخصية</label>
                        <textarea
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          rows={3}
                          className="w-full text-xs font-bold bg-zinc-50 text-zinc-850 p-3.5 rounded-xl border border-zinc-200 focus:border-[#ff385c] outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#ff385c] hover:bg-rose-600 transition-all text-white font-black text-xs py-3.5 px-6 rounded-xl w-full cursor-pointer haptic-tap flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>حفظ التعديلات الحالية</span>
                    </button>

                    {isSaved && (
                      <p className="text-xs text-rose-500 font-bold text-center animate-pulse pt-1">
                        ✓ تم تحديث معلوماتك بجدارة!
                      </p>
                    )}
                  </form>
                )}

                {/* 2. Login and Security page */}
                {settingsSubSection === 'security' && (
                  <div className="space-y-4">
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 space-y-1.5">
                      <h4 className="text-xs font-black text-zinc-900">المصادقة الثنائية (2FA)</h4>
                      <p className="text-[10px] text-zinc-450 leading-relaxed font-bold">
                        تأمين حسابك عبر إرسال كود فوري في رسالة SMS لهاتفك عند تسجيل الدخول من متصفح جديد.
                      </p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[10.5px] font-black text-[#ff385c]">
                          {isTwoFactorEnabled ? 'نشط الآن' : 'غير مفعل'}
                        </span>
                        <input
                          type="checkbox"
                          checked={isTwoFactorEnabled}
                          onChange={(e) => setIsTwoFactorEnabled(e.target.checked)}
                          className="w-10 h-5 accent-[#ff385c] rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 space-y-3">
                      <h4 className="text-xs font-black text-zinc-900">تحديث كلمة المرور</h4>
                      <div className="space-y-2">
                        <input
                          type="password"
                          placeholder="كلمة المرور الحالية"
                          className="w-full text-xs font-bold bg-white p-2.5 rounded-lg border border-zinc-200 outline-none"
                        />
                        <input
                          type="password"
                          placeholder="كلمة المرور الجديدة"
                          className="w-full text-xs font-bold bg-white p-2.5 rounded-lg border border-zinc-200 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => alert("تم تحديث كلمة المرور بنجاح!")}
                        className="bg-zinc-900 text-white text-[10.5px] py-2 px-4 rounded-xl font-black cursor-pointer hover:bg-black transition-all"
                      >
                        تغيير الرمز السري
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Privacy settings */}
                {settingsSubSection === 'privacy' && (
                  <div className="space-y-4">
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 space-y-3 text-xs font-bold">
                      <div className="flex justify-between items-center py-2.5">
                        <div className="max-w-[80%]">
                          <h5 className="font-extrabold text-zinc-800">السماح بملفات تعريف الارتباط</h5>
                          <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">تتبع التصفح لترشيح أفضل الشاليهات والمسابح التي تفضلها في الجزائر.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={cookieConsent}
                          onChange={(e) => setCookieConsent(e.target.checked)}
                          className="w-10 h-5 accent-[#ff385c] rounded-lg cursor-pointer shrink-0"
                        />
                      </div>

                      <div className="border-t border-zinc-150/65 my-1" />

                      <div className="flex justify-between items-center py-2.5">
                        <div className="max-w-[80%]">
                          <h5 className="font-extrabold text-zinc-800">تفعيل تحديد الموقع الجغرافي</h5>
                          <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">مشاركة موقعك التقريبي لعرض مزارع وقاعات حفلات قريبة منك للغاية.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={locationConsent}
                          onChange={(e) => setLocationConsent(e.target.checked)}
                          className="w-10 h-5 accent-[#ff385c] rounded-lg cursor-pointer shrink-0"
                        />
                      </div>
                    </div>

                    <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-rose-100/50 text-[10px] text-zinc-650 leading-relaxed font-bold">
                      تنص المادة القانونية في الجزائر على حماية الهوية الرقمية في كافة تداولات العقار السياحي الكرائي. لا نقوم بنشر معلوماتك مع أي أطراف إشهارية.
                    </div>
                  </div>
                )}

                {/* 4. Notifications selection */}
                {settingsSubSection === 'notifications' && (
                  <div className="space-y-3">
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 space-y-4 font-bold text-xs">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-zinc-800 font-extrabold">إشعارات التطبيق الفورية</h5>
                          <p className="text-[10px] text-zinc-400 font-medium">استلام رسائل الدردشة والحجوزات مباشرة على هذا الهاتف.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={pushNotifications}
                          onChange={(e) => setPushNotifications(e.target.checked)}
                          className="w-10 h-5 accent-[#ff385c] rounded-lg cursor-pointer shrink-0"
                        />
                      </div>

                      <div className="border-t border-zinc-150/60" />

                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-zinc-800 font-extrabold">بريد إلكتروني دوري</h5>
                          <p className="text-[10px] text-zinc-400 font-medium">رسائل إخبارية، عروض ترويجية صيفية، وتقارير الشالي.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="w-10 h-5 accent-[#ff385c] rounded-lg cursor-pointer shrink-0"
                        />
                      </div>

                      <div className="border-t border-zinc-150/60" />

                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-zinc-800 font-extrabold">رسائل نصية قصيرة SMS</h5>
                          <p className="text-[10px] text-zinc-400 font-medium">متابعة دفع العربون وحالة العقد مباشرة بالنص عبر الجوال.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={smsNotifications}
                          onChange={(e) => setSmsNotifications(e.target.checked)}
                          className="w-10 h-5 accent-[#ff385c] rounded-lg cursor-pointer shrink-0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Payments selection */}
                {settingsSubSection === 'payments' && (
                  <div className="space-y-4">
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150">
                      <div className="space-y-1 text-center py-6 text-zinc-450 text-[11px] font-bold font-sans">
                        <p>لم تفعل حسابات الـ CCP حتى الآن.</p>
                        <button
                          type="button"
                          onClick={() => alert("إضافة وسيلة دفع جديدة ستتوفر قريباً!")}
                          className="text-[#ff385c] font-black underline cursor-pointer hover:text-rose-600 block mt-1 mx-auto"
                        >
                          إضافة بطاقة جديدة
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Language Selector */}
                {settingsSubSection === 'translation' && (
                  <div className="space-y-4">
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 space-y-3">
                      <label className="block text-[11px] font-black text-zinc-800">اختر لغة عرض المنصة وتفاصيل الحجز</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(Object.keys(languageNames) as Array<keyof typeof languageNames>).map((lng) => (
                          <button
                            type="button"
                            key={lng}
                            onClick={() => {
                              setLanguage(lng);
                              alert(`تم تغيير لغة المنصة بنجاح إلى: ${languageNames[lng]}`);
                            }}
                            className={`py-3 px-4 text-xs font-black rounded-xl transition-all cursor-pointer ${
                              language === lng
                                ? 'bg-[#111111] text-white shadow-sm'
                                : 'bg-white hover:bg-zinc-100/80 text-zinc-700 border border-zinc-200'
                            }`}
                          >
                            {languageNames[lng]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Booking permissions */}
                {settingsSubSection === 'permissions' && (
                  <div className="space-y-3">
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-150 space-y-2">
                      <h4 className="text-xs font-black text-[#111111]">أذونات الكراء المتبادلة</h4>
                      <p className="text-[10px] text-zinc-450 leading-relaxed font-bold">
                        تسمح أذونات الحجز لمالكي الشاليهات ومكاتب الكراء التنسيق المالي مع ملفك التعريفي ومطابقة أوراق التعريف الجزائرية الموثقة.
                      </p>
                      <p className="text-[10px] text-zinc-400 font-bold italic pt-1 text-rose-500">
                        ✓ جميع الأذونات نشطة لمنح حجز فوري خالٍ من التعقيدات.
                      </p>
                    </div>
                  </div>
                )}

                {/* 8. Business Travel */}
                {settingsSubSection === 'business' && (
                  <div className="space-y-4">
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 text-center space-y-3.5">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto border shadow-xs">
                        <Briefcase className="w-5.5 h-5.5 text-zinc-900" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-zinc-900">سجل سفرك لغرض العمل بشكل أفضل</h4>
                        <p className="text-[10px] text-zinc-450 max-w-xs mx-auto leading-relaxed font-bold">
                          اربط بريدك المهني لسهولة تبرير المصارف واستصدار الفواتير الموجهة للشركات وإدارات الموارد البشرية محلياً ودولياً.
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => alert("سيتم تفعيل ربط البريد الإلكتروني للمؤسسات قريباً.")}
                          className="px-5 py-2.5 bg-[#ff385c] hover:bg-rose-600 text-white text-[10.5px] font-black rounded-xl cursor-pointer"
                        >
                          بدء الربط المهني
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. Accessibility */}
                {settingsSubSection === 'accessibility' && (
                  <div className="space-y-4">
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-xs font-black text-zinc-900">زيادة تباين الألوان</h5>
                          <p className="text-[9.5px] text-zinc-400 font-medium">تسهيل القراءة لذوي الهمم وكبار السن في الجزائر.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-10 h-5 accent-[#ff385c]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. Taxes info */}
                {settingsSubSection === 'taxes' && (
                  <div className="space-y-3 text-right" dir="rtl">
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 space-y-2">
                      <h4 className="text-xs font-black text-zinc-900">الجبايات والرسوم السياحية في الجزائر</h4>
                      <p className="text-[10.5px] text-zinc-500 leading-relaxed font-bold">
                        بموجب قوانين المالية لجمهورية الجزائر، يحمل الكراء السياحي المؤقت رسماً محلياً يختلف حسب البلدية والولاية السياحية (مثل تيبازة، بجاية، جيجل).
                      </p>
                      <p className="text-[10px] text-zinc-450 font-bold leading-relaxed">
                        يتم التصريح بهذه الرسوم من قبل المضيف الشريك مباشرة للجهات المعنية لضمان امتثال كامل وصيغة قانونية 100%.
                      </p>
                    </div>
                  </div>
                )}

                {/* 11. First Guest info */}
                {settingsSubSection === 'first_guest' && (
                  <div className="space-y-3 text-right" dir="rtl">
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 space-y-2">
                      <h4 className="text-xs font-black text-zinc-900">ضيفك الأول</h4>
                      <p className="text-[10.5px] text-zinc-500 leading-relaxed font-bold">
                        استعد لاستقبال أول ضيوفك مع باقة الترحيب المجانية والنصائح القانونية لنظام الكراء من Daro.
                      </p>
                      <p className="text-[10px] text-zinc-450 font-bold leading-relaxed">
                        نحن نوفر لك دليلاً خطوة بخطوة لتهيئة الشاليه أو المزرعة والحصول على تقييم 5 نجوم من البداية.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6" id="profile-subview-help">
            <div className="flex items-center gap-2 border-b pb-3 border-zinc-200/60 dark:border-zinc-850 animate-fade-in">
              <button onClick={() => setActiveSubView(null)} className="p-1 hover:bg-zinc-100 rounded-lg dark:hover:bg-zinc-800 text-rose-500 cursor-pointer">
                {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              </button>
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{t('getHelp')}</h2>
            </div>

            <div className="bg-rose-50/20 dark:bg-zinc-850 p-4 rounded-2xl border border-rose-100/50 space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
              <p className="font-extrabold text-rose-600 dark:text-rose-450">{t('needHelp')}</p>
              <p className="leading-relaxed">
                مركز المساعدة لشبكة Daro الجزائرية متاح لمتابعتكم:
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 sm:gap-6 text-[10px] text-zinc-600 dark:text-zinc-400 font-bold">
                <span>📞 رقم الاتصال بالدعم: <strong className="text-rose-600">021 99 88 77</strong></span>
                <span>✉️ البريد فني: <strong className="text-rose-600">support@daro.dz</strong></span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-black text-xs text-zinc-800 dark:text-zinc-200">{t('frequentQuestions')}</h3>
              
              <div className="space-y-2">
                {AlgerianFAQs.map((faq, idx) => (
                  <div key={idx} className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                      className="w-full text-right p-3 bg-zinc-50 hover:bg-zinc-100/80 dark:hover:bg-zinc-805 transition-colors flex justify-between items-center cursor-pointer"
                    >
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{faq.q}</span>
                      <span className="text-rose-500 font-bold">{faqOpen === idx ? '▲' : '▼'}</span>
                    </button>
                    {faqOpen === idx && (
                      <div className="p-3 bg-white dark:bg-zinc-850 text-zinc-650 dark:text-zinc-350 leading-relaxed border-t border-zinc-100 dark:border-zinc-800">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ticket submit form */}
            <form onSubmit={(e) => { e.preventDefault(); setContactSuccess(true); setContactMessage(''); }} className="space-y-3 pt-4 border-t border-zinc-200/50" dir="rtl">
              <h3 className="font-bold text-xs text-zinc-800">إرسال استفسار مباشر لقسم الحجوزات</h3>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                required
                placeholder="اكتب تفاصيل مشكلتك أو استفسارك هنا..."
                rows={3}
                className="w-full text-xs bg-zinc-50 text-zinc-850 p-3 rounded-xl border border-zinc-200 focus:border-rose-500 outline-none"
              />
              <button
                type="submit"
                className="bg-[#ff385c] hover:bg-rose-600 text-white text-[10px] font-black py-2.5 px-4 rounded-xl cursor-pointer shadow-xs haptic-tap"
              >
                إرسال التذكرة
              </button>
              {contactSuccess && (
                <p className="text-[10px] text-rose-600 flex items-center gap-1.5 font-bold animate-pulse">
                  <CheckCircle2 className="w-4 h-4" /> تم إرسال تذكرتك بنجاح! رقم المتابعة: #{Math.floor(Math.random() * 90000 + 10000)}
                </p>
              )}
            </form>
          </div>
        );



      case 'profile_card':
        return (
          <div className="space-y-6" id="profile-subview-card">
            <div className="flex items-center gap-2 border-b pb-3 border-zinc-200">
              <button onClick={() => setActiveSubView(null)} className="p-1 hover:bg-zinc-100 rounded-lg dark:hover:bg-zinc-800 text-rose-500 cursor-pointer">
                {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              </button>
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{t('viewProfile')}</h2>
            </div>

            {/* Physical Profile Card mockup - Pure Clean design in support of the white & rose theme */}
            <div className="max-w-md mx-auto bg-zinc-900 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden border border-zinc-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-sans font-black text-lg tracking-widest text-rose-500 uppercase">DARO</h3>
                  <p className="text-[8px] text-zinc-400 uppercase tracking-widest leading-none font-bold">ALGERIA GOLD MEMBER</p>
                </div>
                <div className="text-right">
                  <span className="text-[8px] bg-[#ff385c] text-white font-black py-0.5 px-2.5 rounded-full uppercase">VIP MEMBER</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={profileForm.avatar} 
                  alt={profileForm.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 flex-1 min-w-0">
                  <h4 className="font-black text-sm truncate">{profileForm.name}</h4>
                  <p className="text-[9px] text-rose-400 flex items-center gap-1 font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>حساب مستكشف سياحي موثق</span>
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-zinc-350 leading-relaxed italic mb-6">
                "{profileForm.bio}"
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 py-3.5 border-t border-zinc-800 text-center text-xs">
                <div>
                  <p className="text-[9px] text-zinc-450 font-bold">الرحلات</p>
                  <p className="text-sm font-black text-rose-450">{bookings.length}</p>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-450 font-bold">المفضلة</p>
                  <p className="text-sm font-black text-rose-450">{favorites.length}</p>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-450 font-bold">الرتبة</p>
                  <p className="text-sm font-black text-rose-450 flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-rose-550 text-rose-550" />
                    <span>ذهبية</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-zinc-450 max-w-sm mx-auto">
                هذه بطاقة الهوية الرقمية لـ Daro. يتم ترقيتها وتفعيل ميزاتها تلقائياً بناءً على حجوزاتك ومستويات رضا المضيفين.
              </p>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6" id="profile-subview-privacy">
            <div className="flex items-center gap-2 border-b pb-3 border-zinc-200">
              <button onClick={() => setActiveSubView(null)} className="p-1 hover:bg-zinc-100 rounded-lg dark:hover:bg-zinc-800 text-rose-500 cursor-pointer">
                {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              </button>
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{t('privacy')}</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-start bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-105">
                <Shield className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-black text-xs text-zinc-850 dark:text-zinc-100">{t('privacySettings')}</h4>
                  <p className="text-[10px] text-zinc-450 leading-relaxed font-bold">
                    {t('privacyDesc')}
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs font-bold">
                <div className="py-4 flex justify-between items-center">
                  <div className="max-w-[80%]">
                    <h5 className="font-extrabold text-zinc-800 dark:text-zinc-200">السماح بملفات تعريف الارتباط الإصدار الفاخر</h5>
                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5">تتبع التصفح لترشيح أفضل الشاليهات والمسابح التي تفضلها في الجزائر العاصمة ووهران.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={cookieConsent}
                    onChange={(e) => setCookieConsent(e.target.checked)}
                    className="w-10 h-5 accent-[#ff385c] rounded-lg cursor-pointer"
                  />
                </div>

                <div className="py-4 flex justify-between items-center">
                  <div className="max-w-[80%]">
                    <h5 className="font-extrabold text-zinc-800 dark:text-zinc-200">تفعيل تحديد الموقع الجغرافي</h5>
                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5">مشاركة موقعك التقريبي لعرض مزارع وقاعات حفلات قريبة منك للغاية.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={locationConsent}
                    onChange={(e) => setLocationConsent(e.target.checked)}
                    className="w-10 h-5 accent-[#ff385c] rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-2xl border border-rose-100 text-[10px] text-zinc-650 dark:bg-zinc-800/30 dark:text-zinc-350">
                <p className="font-black mb-1 flex items-center gap-1 text-[#ff385c]">
                  <AlertCircle className="w-4 h-4" /> قانون حماية البيانات رقم 18-07 في الجزائر
                </p>
                <p className="leading-relaxed">
                  تلتزم منصة Daro بالكامل بالقانون الجزائري رقم 18-07 المتعلق بحماية الأشخاص الطبيعيين في جبهة معالجة المعطيات ذات الطابع الشخصي. بياناتك آمنة ومحفوظة لتسهيل الكراء السياحي فقط.
                </p>
              </div>
            </div>
          </div>
        );

      case 'referral':
        return (
          <div className="space-y-6" id="profile-subview-referral">
            <div className="flex items-center gap-2 border-b pb-3 border-zinc-250/20">
              <button onClick={() => setActiveSubView(null)} className="p-1 hover:bg-zinc-100 rounded-lg dark:hover:bg-zinc-800 text-rose-500 cursor-pointer">
                {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              </button>
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{t('referHost')}</h2>
            </div>

            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                  <Share2 className="w-7 h-7 text-[#ff385c]" />
                </div>
                <h3 className="font-black text-xs text-zinc-800 dark:text-zinc-100">{t('referredHosts')}</h3>
                <p className="text-[10px] text-zinc-400 max-w-sm mx-auto font-medium leading-relaxed">
                  {t('referredDesc')}
                </p>
              </div>

              {/* Referral Code Copy board */}
              <div className="bg-zinc-50 dark:bg-zinc-850 p-4 rounded-2xl border border-zinc-200/60 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs font-bold">
                <div>
                  <span className="block text-[8px] text-zinc-450 uppercase font-black tracking-widest">{t('referredCode')}</span>
                  <span className="font-mono font-black text-[#ff385c] dark:text-rose-400 text-xs">
                    DARO-HOST-REF-{profileForm.phone.replace(/\s+/g, '') || '0550123456'}
                  </span>
                </div>
                <button
                  onClick={handleCopyReferral}
                  className="bg-[#ff385c] hover:bg-rose-600 text-white text-[10px] font-black py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shrink-0 haptic-tap cursor-pointer"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'تم النسخ!' : 'نسخ الرمز'}</span>
                </button>
              </div>

              {/* stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold animate-fade-in">
                <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50">
                  <p className="text-zinc-400 text-[9px]">المسجلون</p>
                  <p className="text-zinc-800 dark:text-zinc-200 mt-1">3 أصدقاء</p>
                </div>
                <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50">
                  <p className="text-zinc-400 text-[9px]">مكتمل الحجز</p>
                  <p className="text-zinc-800 dark:text-zinc-200 mt-1">1 مضيف</p>
                </div>
                <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50">
                  <p className="text-zinc-400 text-[9px]">عائدات الأرباح</p>
                  <p className="text-rose-500 font-black mt-1">10,000 دج</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'cohost':
        return (
          <div className="space-y-6" id="profile-subview-cohost">
            <div className="flex items-center gap-2 border-b pb-3 border-zinc-200">
              <button onClick={() => setActiveSubView(null)} className="p-1 hover:bg-zinc-100 rounded-lg dark:hover:bg-zinc-800 text-rose-500 cursor-pointer">
                {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              </button>
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{t('findCoHost')}</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-rose-50/10 p-4 rounded-2xl text-xs text-zinc-750 dark:bg-zinc-850 dark:text-zinc-350 border border-rose-100">
                <h4 className="font-extrabold text-xs text-rose-600 dark:text-rose-450 mb-1">
                  {t('legalCoHostTitle')}
                </h4>
                <p className="leading-relaxed font-bold">
                  {t('legalCoHostDesc')}
                </p>
              </div>

              {/* Applied successfully status toast */}
              <AnimatePresence>
                {requestedCoHostName && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-3 bg-rose-950 text-rose-300 rounded-xl text-[10px] font-black text-center border border-rose-500/20"
                  >
                    تم إرسال طلب تعاون قانوني إلى المضيف المشترك ({requestedCoHostName}). سيتواصل معك قريباً تلفونياً لتأكيد شروط الكراء!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Co-hosts directories */}
              <div className="space-y-3.5">
                {CO_HOSTS_LIST.map((co) => (
                  <div 
                    key={co.id}
                    className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 space-y-2.5 shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-xs text-zinc-900 dark:text-zinc-100">{co.name}</h4>
                        <span className="inline-block text-[10px] text-[#ff385c] bg-rose-50/70 dark:bg-zinc-800 font-bold py-0.5 px-2 rounded-md mt-1">
                          📍 {co.city}
                        </span>
                      </div>
                      <span className="flex items-center gap-0.5 font-bold text-rose-550 text-xs">
                        <Star className="w-3.5 h-3.5 fill-[#ff385c] text-[#ff385c]" />
                        <span>{co.rating}</span>
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-450 font-bold leading-relaxed">{co.bio}</p>

                    <div className="flex justify-between items-center pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-500">
                      <span>📞 {co.phone}</span>
                      <button
                        onClick={() => handleCoHostRequest(co.name)}
                        className="bg-[#ff385c] hover:bg-rose-600 text-white font-black py-1.5 px-3 rounded-lg text-[9px] cursor-pointer shadow-xs haptic-tap"
                      >
                        طلب تعاون
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="space-y-6 animate-fade-in" id="profile-subview-legal">
            <div className="flex items-center gap-2 border-b pb-3 border-zinc-250/20">
              <button 
                onClick={() => setActiveSubView(null)} 
                className="p-1 hover:bg-zinc-100 rounded-lg text-[#ff385c] cursor-pointer"
              >
                {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              </button>
              <h2 className="text-lg font-black text-zinc-900">الملف القانوني والشروط</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-rose-50/10 p-4 rounded-2xl border border-rose-100/50 space-y-2.5 text-xs text-zinc-700">
                <p className="font-extrabold text-rose-600">تنظيمات الكراء السياحي في الجزائر</p>
                <p className="leading-relaxed font-bold">
                  تخضع منصة Daro بالكامل للقوانين والترتيبات المنظمة لتأجير الإقامات السياحية وصيغ الكراء المؤقت للمصطافين في الجزائر لدعم السياحة المحلية بصورة آمنة ومدروسة.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
                  <h4 className="font-extrabold text-[#111111] text-xs">شروط الاستخدام والخدمة</h4>
                  <p className="text-[10px] text-zinc-450 leading-relaxed font-bold">
                    بموجب اتفاقيتنا الأمنية المشتركة، يتوجب على كافة المستأجرين تقديم إثبات هوية موثق، وتأكيد الحجز ومطابقته بالتنسيق الكامل مع السلطات والبلديات المحلية.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
                  <h4 className="font-extrabold text-[#111111] text-xs">سياسة الخصوصية وحماية المعطيات</h4>
                  <p className="text-[10px] text-zinc-450 leading-relaxed font-bold">
                    نحن نحمي بياناتك الشخصية برمزية مشفرة بالكامل. لا نقوم بمشاركة أي أرقام أو تفاصيل شخصية إلا لتأكيد وحفظ اتفاقية الكراء بين الملاك والمستأجرين.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-5 pb-6 space-y-4 bg-white text-zinc-900 animate-page-in" id="profile-tab-container" dir="rtl">
      {/* High Quality Header matching Image 3 with proper RTL order */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
        <h1 className="text-[20px] font-black text-zinc-900 tracking-tight leading-none">
          الملف الشخصي
        </h1>
        <button 
          type="button"
          className="w-9 h-9 hover:bg-zinc-50 rounded-full flex items-center justify-center transition-all cursor-pointer relative haptic-tap text-zinc-650"
          title="التنبيهات"
        >
          <Bell className="w-4.5 h-4.5 stroke-[2.2px] text-zinc-900" />
          <span className="absolute top-2 left-2.5 w-1.5 h-1.5 bg-[#ff385c] rounded-full" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!activeSubView ? (
          /* Main menu options - Perfectly Flat List matching Screenshot */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* 1. Profile Guest Card (Image 2) */}
            <div className="bg-white rounded-[2rem] p-7 border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.025)] flex flex-col items-center justify-center text-center space-y-4" id="main-profile-card">
              <div className="w-24 h-24 bg-[#ffe4e6] rounded-full flex items-center justify-center text-[#be123c] font-sans text-4xl font-black shadow-inner select-none">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'G'}
              </div>
              <div className="space-y-1.5">
                <h2 className="text-[22px] font-black text-zinc-950 tracking-tight leading-none">
                  {userProfile.name || 'Ghouat'}
                </h2>
                <p className="text-zinc-400 font-bold text-xs">
                  {language === 'ar' ? 'ضيف' : 'Guest'}
                </p>
              </div>
            </div>

            {/* 2. Join as Host Banner Card (Image 1) */}
            <div 
              onClick={() => triggerModeTransition('host')}
              className="bg-white rounded-[2rem] p-6 pr-8 border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.025)] flex items-center justify-between text-right cursor-pointer hover:bg-zinc-50/30 active:scale-[0.99] transition-all relative overflow-hidden group"
              id="join-host-banner-card"
            >
              {/* Left Side: Texts */}
              <div className="flex-1 space-y-2 text-right">
                <h2 className="text-[20px] font-black text-zinc-950 tracking-tight leading-snug">
                  انضم كمضيف
                </h2>
                <p className="text-[12px] font-bold text-zinc-400 leading-relaxed max-w-[210px]">
                  من السهل بدء الاستضافة وكسب دخل إضافي.
                </p>
              </div>

              {/* Right Side: 3D Waving Character Illustration */}
              <div className="w-16 h-24 flex items-end justify-center shrink-0 overflow-visible relative pointer-events-none">
                <img 
                  src={hostWavingAvatar} 
                  alt="3D Character" 
                  className="h-[110px] max-h-[110px] object-contain object-bottom select-none translate-y-3 group-hover:scale-105 duration-300 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Logout prompt in-UI instead of alert popup */}
            <AnimatePresence>
              {showLogoutConfirm && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-zinc-50 text-zinc-900 p-5 rounded-3xl border border-zinc-200 text-center space-y-3 shadow-sm"
                >
                  <p className="text-xs font-black text-zinc-800">هل أنت متأكد من تسجيل خروجك بالكامل؟ سيتم إعادة تهيئة بيانات الحساب المحفوظة.</p>
                  <div className="flex justify-center gap-3">
                    <button onClick={executeLogout} className="bg-[#ff385c] hover:bg-rose-600 text-white font-black text-[10px] py-1.5 px-4 rounded-xl cursor-pointer">
                      تأكيد الخروج
                    </button>
                    <button onClick={() => setShowLogoutConfirm(false)} className="bg-zinc-250 text-zinc-800 hover:bg-zinc-300 font-extrabold text-[10px] py-1.5 px-4 rounded-xl cursor-pointer">
                      إلغاء التراجع
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flat Menu Options Section 1 */}
            <div className="space-y-0.5">
              {/* 1. Account Settings */}
              <button
                onClick={() => setActiveSubView('settings')}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                id="btn-profile-settings"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                    <Settings className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#ff385c] rounded-full" />
                  </div>
                  <span className="text-[13px] font-extrabold text-[#111111]">إعدادات الحساب</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* 2. Get Help */}
              <button
                onClick={() => setActiveSubView('help')}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                id="btn-profile-help"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                  </div>
                  <span className="text-[13px] font-extrabold text-[#111111]">اطلب المساعدة</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* 3. View Profile Card */}
              <button
                onClick={() => setActiveSubView('profile_card')}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                id="btn-profile-card"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                    <User className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                  </div>
                  <span className="text-[13px] font-extrabold text-[#111111]">عرض الملف الشخصي</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* 4. Privacy */}
              <button
                onClick={() => setActiveSubView('privacy')}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                id="btn-profile-privacy"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                    <Hand className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                  </div>
                  <span className="text-[13px] font-extrabold text-[#111111]">الخصوصية</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] transition-transform group-hover:-translate-x-0.5" />
              </button>
            </div>

            {/* Separator Divider */}
            <div className="border-t border-zinc-150 my-1" />

            {/* Flat Menu Options Section 2 */}
            <div className="space-y-0.5">
              {/* 5. Refer a Host */}
              <button
                onClick={() => setActiveSubView('referral')}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                id="btn-profile-referral"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                    <Share2 className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                  </div>
                  <span className="text-[13px] font-extrabold text-[#111111]">إحالة مضيف</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* 6. Co-host */}
              <button
                onClick={() => setActiveSubView('cohost')}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                id="btn-profile-cohost"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                    <Key className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                  </div>
                  <span className="text-[13px] font-extrabold text-[#111111]">العثور على مضيف مشارك</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* 7. Legal */}
              <button
                onClick={() => setActiveSubView('legal')}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group"
                id="btn-profile-legal"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                    <FileText className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                  </div>
                  <span className="text-[13px] font-extrabold text-[#111111]">قانوني</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px] transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* 8. Log Out */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-50/50 px-1 rounded-2xl transition-all cursor-pointer group text-red-500"
                id="btn-profile-logout"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                    <LogOut className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8px]" />
                  </div>
                  <span className="text-[13px] font-extrabold text-red-500">تسجيل الخروج</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-400 stroke-[2px]" />
              </button>
            </div>

            {/* Pill Hosting Button matching user's animation request */}
            <AnimatePresence>
              {scrollVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30, x: '-50%' }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, scale: 0.9, y: 30, x: '-50%' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="fixed bottom-[88px] left-1/2 z-40"
                  style={{ x: '-50%' }}
                >
                  <button 
                    onClick={() => {
                      triggerModeTransition('host');
                    }}
                    type="button"
                    className="bg-[#111111] hover:bg-black transition-all text-white text-[12px] font-black py-3 px-6 rounded-full flex items-center gap-2 shadow-[0_12px_24px_rgba(0,0,0,0.18)] border border-zinc-800 haptic-tap cursor-pointer whitespace-nowrap"
                    id="btn-profile-hosting"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-rose-500" />
                    <span>الاستضافة</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Subviews panel (Settings/Help/etc) - Light theme only to avoid unwanted dark styling */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white w-full border border-zinc-200 rounded-3xl p-4 md:p-5 shadow-xs text-zinc-900"
          >
            {renderSubView()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
