import React, { useState, useEffect, useRef } from 'react';
import { useApp } from './AppContext';
import { useLanguage } from './LanguageContext';
import { languageNames } from '../translations';
import { UserProfile } from '../types';
import hostWavingAvatar from '../assets/images/host_waving_avatar_1780305236362.png';
import asiremLogo from '../assets/images/asirem_logo_1780199814542.png';
import alMaarifCharacters from '../assets/images/al_maarif_characters_1780659137277.png';
import { 
  User, Settings, HelpCircle, Shield, Share2, Scale, 
  LogOut, CheckCircle2, Copy, Globe, ChevronLeft, 
  ChevronRight, ArrowRight, ArrowLeft, Star, Award, Sparkles, AlertCircle,
  Bell, Hand, Key, FileText, ArrowLeftRight, X, Lock, CreditCard, Briefcase, UserPlus, Search,
  Music, BookOpen, Clock, Languages, Heart, MapPin, Smile, Camera, Plus, Check,
  Tent, Utensils, Soup, ShoppingBag, Clapperboard, ChefHat, Footprints, Landmark, Palmtree, Mountain, Gamepad2, Coffee, Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playHapticSound } from './InteractionShowcase';

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


interface ProfileTabProps {
  onLoginRequested?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ onLoginRequested }) => {
  const { userProfile, updateUserProfile, bookings, favorites, triggerModeTransition, isHostRegistered, setIsHostRegistered, isRegistered, setIsRegistered } = useApp();
  const { t, language, setLanguage } = useLanguage();

  // Registration local form states in Profile Tab
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorWilaya, setVisitorWilaya] = useState('الجزائر العاصمة');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorRegError, setVisitorRegError] = useState('');
  const [isLoginTab, setIsLoginTab] = useState(false); // Switch between login and signup

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

  // Host registration states matching target screens
  const [hostCountry, setHostCountry] = useState('الجزائر');
  const [hostStreet, setHostStreet] = useState('الزمالة');
  const [hostApt, setHostApt] = useState('باتنة');
  const [hostCity, setHostCity] = useState('باتنة');
  const [hostState, setHostState] = useState('ولاية باتنة');
  const [hostZip, setHostZip] = useState('05000');
  const [showHostSuccessScreen, setShowHostSuccessScreen] = useState(false);

  // Edit Profile custom states
  const [work, setWork] = useState('');
  const [dreamDestination, setDreamDestination] = useState('');
  const [favoriteActivities, setFavoriteActivities] = useState('');
  const [pets, setPets] = useState('');
  const [birthDecade, setBirthDecade] = useState('');
  const [school, setSchool] = useState('');
  const [funFact, setFunFact] = useState('');
  const [uselessSkill, setUselessSkill] = useState('');
  const [highSchoolSong, setHighSchoolSong] = useState('');
  const [biographyTitle, setBiographyTitle] = useState('');
  const [languages, setLanguages] = useState('');
  const [favoriteThing, setFavoriteThing] = useState('');
  const [placeLiving, setPlaceLiving] = useState('');
  const [bioText, setBioText] = useState(profileForm.bio || '');
  const [togglePlaces, setTogglePlaces] = useState(true);
  const [destination1, setDestination1] = useState('تيبازة، الجزائر');
  const [destination2, setDestination2] = useState('ثنية الحد، تيسمسيلت');
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showEditProfileSheet, setShowEditProfileSheet] = useState(false);

  // Interest list and dialog
  const [interests, setInterests] = useState<string[]>([]);
  const [showInterestsDialog, setShowInterestsDialog] = useState(false);
  const [newInterestInput, setNewInterestInput] = useState('');
  const [langSearch, setLangSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  // Active field being edited in an interactive drawer/overlay
  const [editingField, setEditingField] = useState<{ id: string; label: string; value: string; icon: React.ReactNode } | null>(null);

  const editableFields = [
    { id: 'work', label: 'عملي', value: work, setValue: setWork, icon: <Briefcase className="w-5 h-5 text-zinc-700" /> },
    { id: 'dreamDestination', label: 'الوجهة المفضلة التي لطالما حلمت بزيارتها', value: dreamDestination, setValue: setDreamDestination, icon: <Globe className="w-5 h-5 text-zinc-700" /> },
    { id: 'favoriteActivities', label: 'أنشطتي المفضلة', value: favoriteActivities, setValue: setFavoriteActivities, icon: <Clock className="w-5 h-5 text-zinc-700" /> },
    { id: 'pets', label: 'حيواناتي الأليفة', value: pets, setValue: setPets, icon: <Heart className="w-5 h-5 text-zinc-700" /> },
    { id: 'birthDecade', label: 'العقد الذي ولدت فيه', value: birthDecade, setValue: setBirthDecade, icon: <AlertCircle className="w-5 h-5 text-zinc-700" /> },
    { id: 'school', label: 'المدرسة التي ارتدتها', value: school, setValue: setSchool, icon: <Award className="w-5 h-5 text-zinc-700" /> },
    { id: 'funFact', label: 'معلومة ممتعة عني', value: funFact, setValue: setFunFact, icon: <Smile className="w-5 h-5 text-zinc-700" /> },
    { id: 'uselessSkill', label: 'مهارة أتقنها لكن ليس لها فائدة', value: uselessSkill, setValue: setUselessSkill, icon: <Sparkles className="w-5 h-5 text-zinc-700" /> },
    { id: 'highSchoolSong', label: 'أغنيتي المفضلة في فترة المدرسة الثانوية', value: highSchoolSong, setValue: setHighSchoolSong, icon: <Music className="w-5 h-5 text-zinc-700" /> },
    { id: 'biographyTitle', label: 'عنوان سيرة حياتي سيكون', value: biographyTitle, setValue: setBiographyTitle, icon: <BookOpen className="w-5 h-5 text-zinc-700" /> },
    { id: 'languages', label: 'اللغات التي أتحدثها', value: languages, setValue: setLanguages, icon: <Languages className="w-5 h-5 text-zinc-700" /> },
    { id: 'favoriteThing', label: 'شيء أحبه كثيراً', value: favoriteThing, setValue: setFavoriteThing, icon: <Heart className="w-5 h-5 text-zinc-700" /> },
    { id: 'placeLiving', label: 'المكان الذي أعيش فيه', value: placeLiving, setValue: setPlaceLiving, icon: <MapPin className="w-5 h-5 text-zinc-700" /> },
  ];

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`LACASA-HOST-REF-${profileForm.phone.replace(/\s+/g, '')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeLogout = () => {
    localStorage.clear();
    setIsRegistered(false);
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
      case 'edit_profile':
        return null;

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
                className="w-10 h-10 bg-zinc-100/80 hover:bg-zinc-200/60 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 text-zinc-900 border border-zinc-200/30 shadow-xs"
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

                {/* Precise bottom label containing version number with the company logo directly below it */}
                <div className="pt-8 flex flex-col items-end justify-start gap-1 pr-4 animate-fade-in" dir="rtl">
                  <span className="text-[11px] font-sans font-bold text-zinc-400 tracking-wide leading-none">
                    Version 6.7.34
                  </span>
                  <div className="flex items-center -mt-0.5 select-none -translate-x-1" dir="ltr">
                    <img
                      src={asiremLogo}
                      alt="Asirem CORP"
                      className="w-[80px] h-auto object-contain select-none pointer-events-none"
                      style={{ mixBlendMode: 'multiply' }}
                      referrerPolicy="no-referrer"
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
                      className="bg-[#ff385c] hover:bg-rose-600 transition-all text-white font-black text-xs py-3.5 px-6 rounded-xl w-full cursor-pointer active:scale-95 flex items-center justify-center gap-2"
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
                className="bg-[#ff385c] hover:bg-rose-600 text-white text-[10px] font-black py-2.5 px-4 rounded-xl cursor-pointer shadow-xs active:scale-95"
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
          <div className="space-y-6 animate-fade-in text-right" id="profile-subview-card" dir="rtl">
            {/* Header: Symmetrical buttons based on the user screenshot layout */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
              <button 
                onClick={() => setShowEditProfileSheet(true)}
                className="px-5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-full font-black text-xs transition-all cursor-pointer active:scale-95"
              >
                {language === 'ar' ? 'تعديل' : 'Edit'}
              </button>
              <button 
                onClick={() => setActiveSubView(null)}
                className="w-9 h-9 bg-zinc-50 hover:bg-zinc-100 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 text-zinc-850"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5px]" />
              </button>
            </div>

            {/* Profile Avatar Card mockup - Symmetrical rounded design from the screenshot */}
            <div className="bg-white rounded-[2rem] border border-zinc-150/80 shadow-[0_15px_40px_rgba(0,0,0,0.03)] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden max-w-sm mx-auto">
              {/* Soft decorative background circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/40 rounded-full blur-3xl pointer-events-none" />
              
              {/* Circular light pink avatar of G */}
              <div className="w-24 h-24 bg-[#ffe4e6] border-2 border-rose-100/50 rounded-full flex items-center justify-center text-[#be123c] font-sans text-4xl font-black shadow-[inset_0_-4px_10px_rgba(190,18,60,0.05)] select-none shrink-0 mb-4 animate-bounce-subtle">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'أ'}
              </div>

              {/* User Name */}
              <h2 className="text-[20px] font-black text-zinc-950 tracking-tight leading-none">
                {userProfile.name || 'أحمد بن علي'}
              </h2>
              
              {/* Role */}
              <p className="text-zinc-400 font-bold text-xs mt-2 select-none">
                {language === 'ar' ? 'ضيف' : 'Guest'}
              </p>
            </div>

            {/* Complete Profile details banner */}
            <div className="space-y-4 pt-4 text-center max-w-sm mx-auto">
              <h3 className="text-[19px] sm:text-[21px] font-black text-zinc-950 tracking-tight leading-snug">
                {language === 'ar' ? 'أكمل ملفك الشخصي' : 'Complete your profile'}
              </h3>
              
              <p className="text-[11px] text-zinc-500 font-extrabold leading-relaxed px-2 text-center max-w-xs mx-auto">
                {language === 'ar' 
                  ? 'يمثّل ملفك الشخصي على Airbnb جزءًا مهمًا من كل عملية حجز. أكمل بيانات ملفك الشخصي لمساعدة المضيفين والضيوف الآخرين في التعرّف عليك بشكلٍ أفضل.'
                  : 'Your profile is an important part of every booking. Complete your profile details to help hosts and other guests get to know you better.'
                }
              </p>

              <button
                onClick={() => setShowEditProfileSheet(true)}
                className="w-full py-3.5 mt-4 bg-gradient-to-r from-[#e61e4d] via-[#d91b5c] to-[#be123c] hover:opacity-95 text-white font-black text-xs rounded-xl shadow-[0_8px_20px_rgba(230,30,77,0.25)] hover:shadow-[0_10px_25px_rgba(230,30,77,0.3)] transition-all cursor-pointer active:scale-95"
              >
                {language === 'ar' ? 'ابدأ الآن' : 'Start Now'}
              </button>
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
                    LACASA-HOST-REF-{profileForm.phone.replace(/\s+/g, '') || '0550123456'}
                  </span>
                </div>
                <button
                  onClick={handleCopyReferral}
                  className="bg-[#ff385c] hover:bg-rose-600 text-white text-[10px] font-black py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shrink-0 active:scale-95 cursor-pointer"
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
                        className="bg-[#ff385c] hover:bg-rose-600 text-white font-black py-1.5 px-3 rounded-lg text-[9px] cursor-pointer shadow-xs active:scale-95"
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

      case 'unavailable_service_tab':
        return (
          <div className="space-y-6 animate-fade-in text-right" id="profile-subview-unavailable" dir="rtl">
            <div className="flex items-center gap-2 border-b pb-3 border-zinc-150">
              <button 
                onClick={() => setActiveSubView(null)} 
                className="p-1 hover:bg-zinc-100 rounded-lg text-[#ff385c] cursor-pointer"
              >
                {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              </button>
              <h2 className="text-md font-black text-zinc-900">{language === 'ar' ? 'المعارف' : 'Al-Ma\'arif'}</h2>
            </div>

            <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-5">
              <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-[#ff385c] animate-pulse">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-zinc-900">{language === 'ar' ? 'الخدمة غير متوفرة' : 'Service Unavailable'}</h3>
              <p className="text-xs text-zinc-500 font-bold max-w-xs leading-relaxed">
                {language === 'ar' ? 'هذه الخدمة ليست متوفرة حالياً' : 'This service is currently unavailable'}
              </p>
              <button
                onClick={() => setActiveSubView(null)}
                className="inline-flex items-center justify-center px-8 py-3 bg-zinc-950 hover:bg-black text-white text-xs font-black rounded-xl transition-all cursor-pointer active:scale-95"
              >
                {language === 'ar' ? 'موافق' : 'OK'}
              </button>
            </div>
          </div>
        );

      case 'host_register_1':
        return (
          <div className="space-y-5 animate-fade-in" id="profile-subview-host-register-1" dir="rtl">
            <div className="relative h-[280px] w-full rounded-2xl overflow-hidden shadow-sm border border-zinc-100/20">
              <img 
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" 
                alt="Beautiful Blue House" 
                className="w-full h-full object-cover select-none pointer-events-none" 
              />
              <button 
                onClick={() => setActiveSubView(null)} 
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/95 hover:bg-white flex items-center justify-center text-zinc-950 shadow-md cursor-pointer transition active:scale-90"
              >
                <X className="w-4 h-4 text-zinc-950 stroke-[2.5px]" />
              </button>
            </div>

            <div className="pt-2 text-right space-y-3">
              <h1 className="text-[34px] font-black text-[#111111] leading-none tracking-tight pr-1">إعداد إعلانك</h1>
              <h1 className="text-[34px] font-black text-rose-600 leading-none tracking-tight mt-1 pr-1">على Daro</h1>
              <p className="text-zinc-500 font-bold text-[12.5px] leading-relaxed pt-1 pr-1">
                من السهل إنشاء إعلان رائع، لنبدأ بإضافة العنوان أولاً.
              </p>

              <button 
                onClick={() => setActiveSubView('host_register_2')}
                className="w-full mt-7 py-4.5 px-6 bg-white border border-zinc-300 hover:border-zinc-400 rounded-full flex items-center justify-between text-right cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.015)] transition active:scale-[0.985] group"
              >
                <span className="text-zinc-400 font-extrabold text-[12.5px]">أدخل عنوانك</span>
                <Search className="w-5 h-5 text-zinc-800 shrink-0 stroke-[2.2px] group-hover:text-black transition-colors" />
              </button>
            </div>
          </div>
        );

      case 'host_register_2':
        return (
          <div className="space-y-5 animate-fade-in relative min-h-[500px]" id="profile-subview-host-register-2" dir="rtl">
            {/* Header matches second screen */}
            <div className="flex items-center justify-between border-b pb-3 border-zinc-100">
              <button 
                onClick={() => setActiveSubView(null)} 
                className="w-8 h-8 hover:bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4.5 h-4.5 stroke-[2.5px]" />
              </button>
              <h2 className="text-sm font-black text-zinc-900 tracking-tight">تأكيد عنوانك</h2>
              <button 
                onClick={() => setActiveSubView('host_register_1')} 
                className="w-8 h-8 hover:bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 cursor-pointer"
                title="رجوع"
              >
                <ArrowRight className="w-4.5 h-4.5 stroke-[2.5px]" />
              </button>
            </div>

            <div className="space-y-5 pt-1">
              {/* Stacked Fields matched to screenshot 2 */}
              <div className="border border-zinc-300 rounded-2xl overflow-hidden divide-y divide-zinc-250 bg-white shadow-xs">
                {/* 1. البلد / المنطقة */}
                <div className="p-3 text-right">
                  <label className="block text-[8.5px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">البلد / المنطقة</label>
                  <div className="flex items-center justify-between cursor-pointer">
                    <ChevronLeft className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="text-xs font-black text-zinc-800">{hostCountry}</span>
                  </div>
                </div>

                {/* 2. عنوان الشارع */}
                <div className="p-3 text-right">
                  <label className="block text-[8.5px] font-bold text-zinc-405 uppercase tracking-wider mb-0.5">عنوان الشارع</label>
                  <input 
                    type="text" 
                    value={hostStreet} 
                    onChange={(e) => setHostStreet(e.target.value)}
                    className="w-full text-xs font-black text-zinc-850 focus:outline-none text-right bg-transparent p-0" 
                  />
                </div>

                {/* 3. الشقة، الطابق، المبنى */}
                <div className="p-3 text-right">
                  <label className="block text-[8.5px] font-bold text-zinc-405 uppercase tracking-wider mb-0.5">الشقة، الطابق، المبنى (إن وجد)</label>
                  <input 
                    type="text" 
                    value={hostApt} 
                    onChange={(e) => setHostApt(e.target.value)}
                    className="w-full text-xs font-black text-zinc-850 focus:outline-none text-right bg-transparent p-0" 
                  />
                </div>

                {/* 4. المدينة / البلدة / القرية */}
                <div className="p-3 text-right">
                  <label className="block text-[8.5px] font-bold text-zinc-405 uppercase tracking-wider mb-0.5">المدينة / البلدة / القرية</label>
                  <input 
                    type="text" 
                    value={hostCity} 
                    onChange={(e) => setHostCity(e.target.value)}
                    className="w-full text-xs font-black text-zinc-850 focus:outline-none text-right bg-transparent p-0" 
                  />
                </div>

                {/* 5. المقاطعة / الولاية / الإقليم */}
                <div className="p-3 text-right">
                  <label className="block text-[8.5px] font-bold text-zinc-405 uppercase tracking-wider mb-0.5">المقاطعة / الولاية / الإقليم (إن وجد)</label>
                  <input 
                    type="text" 
                    value={hostState} 
                    onChange={(e) => setHostState(e.target.value)}
                    className="w-full text-xs font-black text-zinc-850 focus:outline-none text-right bg-transparent p-0" 
                  />
                </div>

                {/* 6. الرمز البريدي */}
                <div className="p-3 text-right">
                  <label className="block text-[8.5px] font-bold text-zinc-405 uppercase tracking-wider mb-0.5">الرمز البريدي (إن وجد)</label>
                  <input 
                    type="text" 
                    value={hostZip} 
                    onChange={(e) => setHostZip(e.target.value)}
                    className="w-full text-xs font-black text-zinc-850 focus:outline-none text-right bg-transparent p-0" 
                  />
                </div>
              </div>

              {/* Action Big Next Button */}
              <button 
                onClick={() => {
                  setIsHostRegistered(true);
                  setShowHostSuccessScreen(true);
                  setTimeout(() => {
                    setShowHostSuccessScreen(false);
                    setActiveSubView(null);
                    triggerModeTransition('host');
                  }, 3000);
                }}
                className="w-full py-4 bg-zinc-950 hover:bg-black text-white font-black text-xs rounded-xl cursor-pointer shadow-md transition active:scale-[0.985] mt-3 mr-auto ml-auto text-center"
              >
                التالي
              </button>
            </div>

            {/* Celebrate success toast/overlay without blocks */}
            <AnimatePresence>
              {showHostSuccessScreen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white z-[60] flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-3xl"
                >
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 animate-bounce">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-black text-zinc-900">تهانينا الحارة! 🎉</h2>
                  <p className="text-xs text-zinc-500 font-bold max-w-[270px] leading-relaxed">
                    لقد أكملت تسجيل عنوان استضافتك الأول بنجاح! جاري تحويلك الآن إلى لوحة تحكم المضيف للاستفادة الكاملة وكسب المال.
                  </p>
                  <div className="w-16 h-1 bg-rose-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full animate-pulse w-2/3" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isRegistered) {
    return (
      <div className="max-w-md mx-auto px-6 pt-16 pb-12 space-y-7 bg-white min-h-[85vh] text-right font-sans flex flex-col justify-start animate-fade-in" id="profile-tab-unregistered" dir="rtl">
        {/* Title and Subtitle */}
        <div className="space-y-2 pt-4">
          <h1 className="text-[32px] font-black text-zinc-950 tracking-tight leading-tight">
            الملف الشخصي
          </h1>
          <p className="text-zinc-500 font-bold text-sm leading-relaxed max-w-[280px]">
            سجّل الدخول وابدأ في التخطيط لرحلتك القادمة.
          </p>
        </div>

        {/* Large Brand Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              playHapticSound('select');
              if (onLoginRequested) onLoginRequested();
            }}
            className="w-full py-4 bg-zinc-950 text-white font-extrabold text-[15px] rounded-xl hover:bg-zinc-900 active:scale-98 transition-all cursor-pointer text-center leading-none"
          >
            تسجيل الدخول أو الاشتراك
          </button>
        </div>

        {/* Gray spacer line */}
        <div className="border-t border-zinc-150/70 pt-2" />

        {/* Action Lists */}
        <div className="space-y-0.5">
          {/* Account Settings Row */}
          <button
            type="button"
            onClick={() => {
              playHapticSound('select');
              if (onLoginRequested) onLoginRequested();
            }}
            className="w-full flex items-center justify-between py-4.5 group text-right hover:bg-zinc-50/50 px-1 rounded-xl transition-all"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-zinc-400 group-hover:text-zinc-700 transition" strokeWidth={2} />
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-extrabold text-zinc-800">إعدادات الحساب</span>
              <Settings className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8]" />
            </div>
          </button>

          {/* Help Row */}
          <button
            type="button"
            onClick={() => {
              playHapticSound('select');
              window.open('mailto:support@daro.dz');
            }}
            className="w-full flex items-center justify-between py-4.5 group text-right hover:bg-zinc-50/50 px-1 rounded-xl transition-all"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-zinc-400 group-hover:text-zinc-700 transition" strokeWidth={2} />
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-extrabold text-zinc-800">اطلب المساعدة</span>
              <HelpCircle className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8]" />
            </div>
          </button>

          {/* Legal Row */}
          <button
            type="button"
            onClick={() => {
              playHapticSound('select');
              if (onLoginRequested) onLoginRequested();
            }}
            className="w-full flex items-center justify-between py-4.5 group text-right hover:bg-zinc-50/50 px-1 rounded-xl transition-all"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-zinc-400 group-hover:text-zinc-700 transition" strokeWidth={2} />
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-extrabold text-zinc-800">قانوني</span>
              <FileText className="w-5.5 h-5.5 text-zinc-900 stroke-[1.8]" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-5 pb-6 space-y-4 bg-white text-zinc-900 animate-fade-in" id="profile-tab-container" dir="rtl">
      {/* High Quality Header matching Image 3 with proper RTL order */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
        <h1 className="text-[20px] font-black text-zinc-900 tracking-tight leading-none">
          الملف الشخصي
        </h1>
        <button 
          type="button"
          className="w-9 h-9 hover:bg-zinc-50 rounded-full flex items-center justify-center transition-all cursor-pointer relative active:scale-95 text-zinc-650"
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
            {/* 1. Profile Guest Card & Services Square Card - Symmetrical Columns */}
            <div className="grid grid-cols-2 gap-3.5" dir="rtl">
              {/* Symmetrical Square Profile Card - Clickable */}
              <button 
                onClick={() => setActiveSubView('profile_card')}
                className="bg-white rounded-3xl p-4 border border-zinc-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center aspect-square text-center relative overflow-hidden group cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] active:scale-95 transition-all w-full" 
                id="main-profile-card"
              >
                {/* Accent background details inside square */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-50/50 rounded-full blur-xl pointer-events-none transition-transform duration-500 group-hover:scale-110" />
                
                {/* Profile Portrait Square Avatar */}
                <div className="w-14 h-14 bg-[#ffe4e6] border border-rose-100/80 rounded-2xl flex items-center justify-center text-[#be123c] font-sans text-[22px] font-black shadow-[inset_0_-2px_4px_rgba(0,0,0,0.04)] select-none shrink-0 mb-3 transition-transform duration-350 group-hover:scale-105">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'أ'}
                </div>

                {/* Profile Text Details */}
                <div className="space-y-1 z-10 w-full text-center">
                  <h2 className="text-[13.5px] font-black text-zinc-950 tracking-tight leading-none truncate max-w-full px-1">
                    {userProfile.name || 'أحمد بن علي'}
                  </h2>
                </div>
              </button>

              {/* Symmetrical Square Services Button with exact representation of the screenshot */}
              <button
                onClick={() => setActiveSubView('unavailable_service_tab')}
                className="bg-white rounded-3xl border border-zinc-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between aspect-square relative overflow-hidden group cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] active:scale-95 transition-all p-3.5 w-full"
                title={language === 'ar' ? 'المعارف' : 'Al-Ma\'arif'}
                id="btn-extra-services"
              >
                {/* 1. Top Section - Pill-shaped Blueish 'قريباً' Badge exactly on the left */}
                <div className="w-full flex justify-end" dir="rtl">
                  <span className="bg-gradient-to-b from-[#2e4768] to-[#152538] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_3px_10px_rgba(31,48,71,0.22)] border border-[#3e5e86]/25 tracking-wider select-none transform transition-transform duration-350 group-hover:scale-105">
                    {language === 'ar' ? 'قريباً' : 'Soon'}
                  </span>
                </div>

                {/* 2. Middle Section - Characters Figurine illustration directly blending into white bg */}
                <div className="flex-1 flex items-center justify-center w-full my-1">
                  <img 
                    src={alMaarifCharacters} 
                    alt="المعارف" 
                    className="h-[75px] sm:h-[82px] max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110 select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* 3. Bottom Section - Bold black text 'المعارف' */}
                <div className="w-full text-center pb-0.5">
                  <span className="text-[14px] sm:text-[15.5px] font-black text-zinc-950 tracking-tight leading-none block">
                    {language === 'ar' ? 'المعارف' : 'Al-Ma\'arif'}
                  </span>
                </div>
              </button>
            </div>

            {/* 2. Join as Host Banner Card - Enlarged Waving Avatar with Compact Custom Texts */}
            <div 
              onClick={() => {
                if (isHostRegistered) {
                  triggerModeTransition('host');
                } else {
                  setActiveSubView('host_register_1');
                }
              }}
              className="bg-white rounded-2xl p-5 border border-zinc-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center justify-between text-right cursor-pointer hover:bg-zinc-50/30 active:scale-[0.99] transition-all relative overflow-hidden h-[105px] group"
              id="join-host-banner-card"
            >
              {/* Right Side: Texts (RTL right-aligned), beautifully matched & proportioned */}
              <div className="space-y-1 text-right z-10 max-w-[210px] pr-1">
                <h2 className="text-[15px] font-black text-zinc-950 tracking-tight leading-none">
                  انضم كمضيف
                </h2>
                <p className="text-[11px] font-bold text-zinc-400 leading-normal">
                  من السهل بدء الاستضافة وكسب دخل إضافي.
                </p>
              </div>

              {/* Left Side: Custom 3D character (Absolute, larger, covering/extending over the frame) */}
              <img 
                src={hostWavingAvatar} 
                alt="3D Character" 
                className="absolute left-1.5 bottom-0 h-[142px] max-h-[142px] object-contain object-bottom select-none pointer-events-none translate-y-2 group-hover:scale-105 duration-300 transition-transform z-10"
                referrerPolicy="no-referrer"
              />
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
                      setIsHostRegistered(true);
                      triggerModeTransition('host');
                    }}
                    type="button"
                    className="bg-[#111111] hover:bg-black transition-all text-white text-[12px] font-black py-3 px-6 rounded-full flex items-center gap-2 shadow-[0_12px_24px_rgba(0,0,0,0.18)] border border-zinc-800 active:scale-95 cursor-pointer whitespace-nowrap"
                    id="btn-profile-hosting"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#ff385c]" />
                    <span>التبديل إلى فضاء المضيف</span>
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

      {/* Field Editing Overlay / Dialog popup */}
      <AnimatePresence>
        {editingField && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center backdrop-blur-xs"
            onClick={() => setEditingField(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white rounded-t-[2.2rem] px-6 pt-5 pb-8 w-full max-w-md text-right shadow-2xl border-t border-zinc-100 relative max-h-[85vh] overflow-y-auto flex flex-col no-scrollbar font-sans"
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              {/* Drag handle */}
              <div className="w-12 h-1 bg-zinc-200 rounded-full mx-auto mb-4 shrink-0" />

              {/* Header Close button */}
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 shrink-0">
                <button 
                  onClick={() => setEditingField(null)} 
                  className="w-10 h-10 hover:bg-zinc-100 rounded-full flex items-center justify-center transition-all cursor-pointer border border-zinc-100"
                  title="إغلاق"
                >
                  <X className="w-5 h-5 text-zinc-800 stroke-[2.5px]" />
                </button>
                <span className="text-[11px] font-black text-rose-500 tracking-wider">تعديل الملف الشخصي</span>
                <div className="w-10 h-10 opacity-0 pointer-events-none" />
              </div>

              {/* Dynamic Body Content according to image slots */}
              <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-5 text-right">
                {editingField.id === 'work' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">ما هي مهنتك؟</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      أخبرنا ما هي مهنتك. إذا لم يكن لديك وظيفة تقليدية، أخبرنا بمهمتك في الحياة. مثال: ممرضة، أو والد لأربعة أطفال، أو راكب أمواج متقاعد. <span className="underline cursor-pointer hover:text-zinc-950">أين ستظهر هذه المعلومات؟</span>
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">عملي:</span>
                      <input
                        type="text"
                        maxLength={20}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="أخبرنا ما هي مهنتك..."
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/20 حروف</p>
                  </div>
                )}

                {editingField.id === 'dreamDestination' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">ما وجهة أحلامك؟</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      أخبرنا بوجهة تتشوق لزيارتها، سواء كانت ضمن قائمة مختاراتك أو قائمة الوجهات المفضلة لديك.
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">الوجهة المفضّلة التي لطالما حلمت بزيارتها:</span>
                      <input
                        type="text"
                        maxLength={40}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="مثلاً: جبال جرجرة، شواطئ جيجل..."
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/40 حروف</p>
                  </div>
                )}

                {editingField.id === 'pets' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">هل لديك حيوانات أليفة؟</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      شارك أنواع وأسماء الحيوانات الأليفة التي تمتلكها. على سبيل المثال: قطتي المرقّطة ميتزي، أو سلحفاتي السريعة ليوناردو.
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">حيواناتي الأليفة:</span>
                      <input
                        type="text"
                        maxLength={40}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="شارك أنواع وأسماء حيواناتك الأليفة..."
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/40 حروف</p>
                  </div>
                )}

                {editingField.id === 'favoriteActivities' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">ما هي الأنشطة التي تقضي الكثير من الوقت عليها؟</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      شارك أحد الأنشطة أو الهوايات التي تقضي الكثير من وقت فراغك عليها. مثلاً: مشاهدة مقاطع فيديو للقطط أو لعب الشطرنج.
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">أنشطتي المفضّلة:</span>
                      <input
                        type="text"
                        maxLength={40}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="شارك أنشطتك المفضّلة..."
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/40 حروف</p>
                  </div>
                )}

                {editingField.id === 'birthDecade' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">الفترة التي ولدت فيها</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      لا تقلق، لن يظهر تاريخ ميلادك الدقيق.
                    </p>
                    
                    {/* Active toggle and info text */}
                    <div className="flex items-center justify-between py-6 border-b border-zinc-100">
                      {/* True Apple Toggle */}
                      <button 
                        type="button"
                        onClick={() => {
                          if (editingField.value) {
                            setEditingField({ ...editingField, value: '' });
                          } else {
                            setEditingField({ ...editingField, value: 'فترة ال 90' });
                          }
                        }}
                        className="cursor-pointer"
                      >
                        {editingField.value ? (
                          <div className="w-12 h-6.5 bg-zinc-950 rounded-full p-0.5 flex justify-end items-center transition-all duration-300">
                            <div className="w-5.5 h-5.5 bg-white rounded-full shadow-md" />
                          </div>
                        ) : (
                          <div className="w-12 h-6.5 bg-zinc-200 rounded-full p-0.5 flex justify-start items-center transition-all duration-300">
                            <div className="w-5.5 h-5.5 bg-white rounded-full shadow-md" />
                          </div>
                        )}
                      </button>

                      <div className="text-right">
                        <p className="text-[13px] font-black text-zinc-900">إظهار الفترة التي ولدت فيها</p>
                        <p className="text-[11px] text-zinc-400 font-extrabold mt-0.5">
                          {editingField.value ? `الفترة التي ولدت فيها وُلدت في ${editingField.value}` : 'الفترة التي ولدت فيها مخفية'}
                        </p>
                      </div>
                    </div>

                    {/* Decade selectors */}
                    <div className="pt-2">
                      <p className="text-[12px] font-black text-zinc-800 mb-3 block">اختر العقد الذي ولدت فيه:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {['الخمسينات', 'الستينيات', 'السبعينيات', 'الثمانينيات', 'التسعينيات', 'الألفينات'].map((decade) => {
                          const valueToStore = `فترة ${decade}`;
                          const isSelected = editingField.value === valueToStore;
                          return (
                            <button
                              key={decade}
                              type="button"
                              onClick={() => setEditingField({ ...editingField, value: valueToStore })}
                              className={`py-2.5 px-2 rounded-xl text-xs font-extrabold text-center transition-all border cursor-pointer ${
                                isSelected 
                                  ? 'bg-zinc-950 border-zinc-950 text-white shadow-xs' 
                                  : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100'
                              }`}
                            >
                              {decade}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {editingField.id === 'school' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">ما المدرسة التي درست بها؟</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      شارك اسم المدرسة التي ساهمت في بناء شخصيتك سواء كانت دراسة منزلية، أو مدرسة ثانوية، أو مدرسة مهنية.
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">المدرسة التي ارتدتُها:</span>
                      <input
                        type="text"
                        maxLength={40}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="مثلاً: جامعة باب الزوار..."
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/40 حروف</p>
                  </div>
                )}

                {editingField.id === 'funFact' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">هل هناك أي معلومة ممتعة عنك؟</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      شارك شيئاً فريداً أو غير متوقع عنك. مثال: "شاركت في فيديو موسيقي" أو "أنا لاعب خفة".
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">معلومة ممتعة عني:</span>
                      <input
                        type="text"
                        maxLength={40}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="شارك معلومة غريبة أو طريفة عنك..."
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/40 حروف</p>
                  </div>
                )}

                {editingField.id === 'uselessSkill' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">ما هي المهارات التي تتقنها لكن ليس لها فائدة؟</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      شارك موهبة مدهشة تمتلكها ولكنها عديمة الفائدة. مثال: خلط البطاقات بيد واحدة.
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">مهارة أتقنها لكن ليس لها فائدة:</span>
                      <input
                        type="text"
                        maxLength={40}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="شارك موهبتك السرية عديمة الفائدة..."
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/40 حروف</p>
                  </div>
                )}

                {editingField.id === 'highSchoolSong' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">ما هي أغنيتك المفضّلة في فترة المدرسة الثانوية؟</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      مهما كان الأمر محرجاً، شارك النغمة التي استمعت إليها مراراً وتكراراً في سن المراهقة.
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">أغنيتي المفضلة في فترة المدرسة الثانوية:</span>
                      <input
                        type="text"
                        maxLength={40}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="ما هي الأغنية التي تذكرك بالثانوية؟"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/40 حروف</p>
                  </div>
                )}

                {editingField.id === 'biographyTitle' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">ما العنوان الذي قد تعطيه لسيرة حياتك؟</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      إذا كتب شخص ما كتاباً عن حياتك، ماذا سيسميه؟ مثال: وُلد ليسافر أو يوميات عاشق الكلاب.
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">عنوان سيرة حياتي سيكون:</span>
                      <input
                        type="text"
                        maxLength={40}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="ماذا سيكون العنوان الرئيسي؟"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/40 حروف</p>
                  </div>
                )}

                {editingField.id === 'languages' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">اللغات التي تتحدثها</h3>
                    
                    {/* Search Language Bar */}
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-full py-2.5 px-4 flex items-center gap-2 bg-white transition-all">
                      <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                      <input
                        type="text"
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        className="w-full bg-transparent outline-none border-none text-xs text-zinc-900 text-right focus:ring-0 focus:outline-none"
                        placeholder="البحث عن لغة..."
                      />
                    </div>

                    {/* Language Checkboxes precisely styled with checkbox on the Left, Name on the Right */}
                    <div className="max-h-[30vh] overflow-y-auto pr-1 space-y-1 scroll-smooth divide-y divide-zinc-50 pt-2 text-right">
                      {[
                        "العربية", "Xhosa", "أذربيجاني", "الأردية", "الأرمينية", "الأفريقانية", 
                        "الإنجليزية", "الفرنسية", "الإسبانية", "الألمانية", "التركية", "الإيطالية"
                      ]
                        .filter(lang => lang.toLowerCase().includes(langSearch.toLowerCase()))
                        .map((lang) => {
                          const listLangs = editingField.value ? editingField.value.split('، ').map(l => l.trim()).filter(Boolean) : [];
                          const isChecked = listLangs.includes(lang);
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => {
                                let newLangs;
                                if (listLangs.includes(lang)) {
                                  newLangs = listLangs.filter(l => l !== lang);
                                } else {
                                  newLangs = [...listLangs, lang];
                                }
                                setEditingField({ ...editingField, value: newLangs.join('، ') });
                              }}
                              className="w-full py-3.5 flex items-center justify-between text-right cursor-pointer hover:bg-zinc-50/50 px-2 rounded-xl transition-all"
                            >
                              {/* Language text */}
                              <span className="text-[13px] font-extrabold text-zinc-900">{lang}</span>

                              {/* Checkbox on the left */}
                              <div className={`w-5.5 h-5.5 rounded-md border flex items-center justify-center transition-all ${
                                isChecked 
                                  ? 'bg-zinc-950 border-zinc-950 text-white' 
                                  : 'border-zinc-300 hover:border-zinc-950'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {editingField.id === 'favoriteThing' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">ما هو الشيء الذي تحبه كثيراً؟</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      أخبرنا عن شيء لا يمكنك الاكتفاء منه. مثال: تحضير خبز الفوكاشيا بإكليل الجبل.
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">شيء أحبه كثيراً:</span>
                      <input
                        type="text"
                        maxLength={40}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="ما الذي تحبه ولا تملّ منه؟"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/40 حروف</p>
                  </div>
                )}

                {editingField.id === 'placeLiving' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">المكان الذي تسكن فيه</h3>
                    
                    {/* Living Search Bar */}
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-full py-2.5 px-4 flex items-center gap-2 bg-white transition-all">
                      <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                      <input
                        type="text"
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="w-full bg-transparent outline-none border-none text-xs text-zinc-900 text-right focus:ring-0 focus:outline-none"
                        placeholder="البحث عن مدينتك..."
                      />
                    </div>

                    {/* Filtered Cities List */}
                    <div className="max-h-[30vh] overflow-y-auto pr-1 space-y-1 pt-1 text-right">
                      {[
                        "الجزائر العاصمة", "وهران", "قسنطينة", "باتنة", "بجاية", "تلمسان",
                        "جيجل", "تيبازة", "سطيف", "سكيكدة", "سيدي بلعباس", "مستغانم"
                      ]
                        .filter(city => city.includes(citySearch))
                        .map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => {
                              setEditingField({ ...editingField, value: city });
                              setCitySearch('');
                            }}
                            className={`w-full py-3 px-4 rounded-xl text-right font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                              editingField.value === city 
                                ? 'bg-zinc-100 text-zinc-950 font-black' 
                                : 'hover:bg-zinc-50 text-zinc-700'
                            }`}
                          >
                            <MapPin className="w-4 h-4 text-zinc-400" />
                            <span>{city}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {editingField.id === 'bio' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">نبذة عني</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      أخبرنا القليل عن نفسك، حتى يتمكّن ضيوفك أو المضيفون المستقبلون من التعرف عليك بشكل أفضل.
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.8rem] py-4 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <textarea
                        maxLength={500}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full min-h-[140px] bg-transparent outline-none border-none text-zinc-950 font-extrabold text-xs text-right p-0 focus:ring-0 focus:outline-none leading-relaxed resize-none"
                        placeholder="اكتب شيئاً مرحاً ومميزاً..."
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/500 حروف</p>
                  </div>
                )}

                {editingField.id === 'destination1' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">الوجهة التالية الأولى</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      أخبرنا بوجهة تتشوق وتخطط لزيارتها قريباً لتظهر كختم رحلة في صفحتك.
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">الوجهة السياحية:</span>
                      <input
                        type="text"
                        maxLength={35}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="مثلاً: تيبازة، الجزائر..."
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/35 حروف</p>
                  </div>
                )}

                {editingField.id === 'destination2' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">الوجهة التالية الثانية</h3>
                    <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                      أخبرنا بوجهة ثانية تتشوق وتخطط لزيارتها قريباً لتظهر كختم رحلة في صفحتك.
                    </p>
                    <div className="border-2 border-zinc-200 focus-within:border-zinc-950 rounded-[1.2rem] py-3.5 px-5 flex flex-col text-right w-full bg-white transition-all shadow-inner">
                      <span className="text-zinc-500 font-extrabold text-[12px] mb-1">الوجهة السياحية:</span>
                      <input
                        type="text"
                        maxLength={35}
                        value={editingField.value}
                        onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        className="w-full bg-transparent outline-none border-none text-zinc-950 font-black text-[13px] text-right p-0 focus:ring-0 focus:outline-none"
                        placeholder="مثلاً: ثنية الحد، تيسمسيلت..."
                        autoFocus
                      />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 font-bold pr-1">{editingField.value.length}/35 حروف</p>
                  </div>
                )}
              </div>

              {/* Saved Bottom Bar exactly matching images */}
              <div className="pt-4 border-t border-zinc-100 mt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (editingField.id === 'bio') {
                      setBioText(editingField.value);
                    } else if (editingField.id === 'destination1') {
                      setDestination1(editingField.value || 'تيبازة، الجزائر');
                    } else if (editingField.id === 'destination2') {
                      setDestination2(editingField.value || 'ثنية الحد، تيسمسيلت');
                    } else {
                      const matched = editableFields.find(f => f.id === editingField.id);
                      if (matched) {
                        matched.setValue(editingField.value);
                      }
                    }
                    setEditingField(null);
                  }}
                  className="w-full py-4.5 bg-zinc-950 hover:bg-black text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer active:scale-[0.98] text-center"
                >
                  {editingField.id === 'languages' ? 'تم' : 'حفظ'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interests Dialog popup */}
      <AnimatePresence>
        {showInterestsDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center backdrop-blur-xs"
            onClick={() => setShowInterestsDialog(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white rounded-t-[2.2rem] px-6 pt-5 pb-8 w-full max-w-md text-right shadow-2xl border-t border-zinc-100 relative max-h-[85vh] overflow-y-auto flex flex-col no-scrollbar font-sans"
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              {/* Drag handle */}
              <div className="w-12 h-1 bg-zinc-200 rounded-full mx-auto mb-4 shrink-0" />

              {/* Header Close button */}
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 shrink-0">
                <button 
                  onClick={() => setShowInterestsDialog(false)} 
                  className="w-10 h-10 hover:bg-zinc-100 rounded-full flex items-center justify-center transition-all cursor-pointer border border-zinc-100"
                  title="إغلاق"
                >
                  <X className="w-5 h-5 text-zinc-800 stroke-[2.5px]" />
                </button>
                <span className="text-[11px] font-black text-rose-500 tracking-wider">الاهتمامات والهوايات</span>
                <div className="w-10 h-10 opacity-0 pointer-events-none" />
              </div>

              {/* Dynamic content area matching Image 15 */}
              <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-6 text-right">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-zinc-950 tracking-tight">ما هي اهتماماتك؟</h3>
                  <p className="text-[13px] text-zinc-500 font-extrabold leading-relaxed">
                    اختر بعض الاهتمامات التي تستمتع بها وتريد عرضها في ملفك الشخصي.
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-black text-zinc-900 mb-3.5">الاهتمامات</h4>
                  
                  {/* Grid of Interests options precisely matching screenshot 15 styles */}
                  <div className="flex flex-wrap gap-2.5 justify-start" dir="rtl">
                    {[
                      { label: 'في الهواء الطلق', icon: (props: any) => <Tent {...props} /> },
                      { label: 'ما يتعلق بالطعام', icon: (props: any) => <Utensils {...props} /> },
                      { label: 'التصوير', icon: (props: any) => <Camera {...props} /> },
                      { label: 'التسوق', icon: (props: any) => <ShoppingBag {...props} /> },
                      { label: 'الأفلام', icon: (props: any) => <Clapperboard {...props} /> },
                      { label: 'الطهي', icon: (props: any) => <ChefHat {...props} /> },
                      { label: 'المشي', icon: (props: any) => <Footprints {...props} /> },
                      { label: 'القهوة', icon: (props: any) => <Coffee {...props} /> },
                      { label: 'القراءة', icon: (props: any) => <BookOpen {...props} /> },
                      { label: 'العروض الموسيقية', icon: (props: any) => <Music {...props} /> },
                      { label: 'المتاحف', icon: (props: any) => <Landmark {...props} /> },
                      { label: 'كرة القدم', icon: (props: any) => (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 7.5L9 9.5v3l3 2 3-2v-3z" />
                          <path d="M12 2v5.5M12 22v-5.5M2 12h5.5M22 12h-5.5" />
                        </svg>
                      )},
                      { label: 'الثقافة المحلية', icon: (props: any) => <Globe {...props} /> },
                      { label: 'الحيوانات', icon: (props: any) => (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
                          <path d="M12 5c.67 0 1.2.32 1.6.8a3 3 0 0 0-3.2 0c.4-.48.93-.8 1.6-.8zm-5 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm10 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-5 11c3.1 0 5.5-2.4 5.5-5.5.03-1-.4-2-.9-2.5-1.1-1.1-2.9-.6-4.6-.6s-3.5-.5-4.6.6c-.5.5-.9 1.5-.9 2.5 0 3.1 2.4 5.5 5.5 5.5z" />
                        </svg>
                      )},
                      { label: 'التخييم', icon: (props: any) => <Mountain {...props} /> },
                      { label: 'الشواطئ', icon: (props: any) => <Palmtree {...props} /> },
                      { label: 'الطبخ التقليدي', icon: (props: any) => <Soup {...props} /> },
                      { label: 'السياحة الجبلية', icon: (props: any) => <Mountain {...props} /> },
                      { label: 'ألعاب الفيديو', icon: (props: any) => <Gamepad2 {...props} /> }
                    ].map((item) => {
                      const isSelected = interests.includes(item.label);
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setInterests(interests.filter(i => i !== item.label));
                            } else {
                              if (interests.length < 20) {
                                setInterests([...interests, item.label]);
                              }
                            }
                          }}
                          className={`inline-flex items-center gap-1.5 px-4.5 py-2.5 border rounded-full text-xs font-black cursor-pointer select-none transition-all duration-200 ${
                            isSelected 
                              ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm' 
                              : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-950 hover:bg-zinc-50'
                          }`}
                        >
                          {item.icon({ className: "w-4 h-4 shrink-0 stroke-[2px] transition-colors" })}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="mt-4 inline-block text-xs font-black text-zinc-950 underline hover:text-[#ff385c]"
                  >
                    عرض الكل
                  </button>
                </div>
              </div>

              {/* Bottom Save bar matching Image 15 */}
              <div className="pt-4 border-t border-zinc-100 mt-2 shrink-0 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowInterestsDialog(false)}
                  className="py-3 px-8 bg-zinc-950 hover:bg-black text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  حفظ
                </button>
                <span className="text-xs font-black text-zinc-900">
                  تم تحديد {interests.length}/20
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Bottom Sheet */}
      <AnimatePresence>
        {showEditProfileSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center backdrop-blur-xs"
            onClick={() => setShowEditProfileSheet(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="bg-white rounded-t-[2.2rem] w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl border-t border-zinc-150 relative text-right flex flex-col font-sans"
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              {/* Drag handle decoration */}
              <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto my-3.5 shrink-0" />

              <div className="px-6 pb-8 space-y-6 overflow-y-auto no-scrollbar">
                {/* Header exactly matching Image 1: 'X' button on the left, title 'تعديل الملف الشخصي' centered */}
                <div className="flex items-center justify-between pb-3.5 border-b border-zinc-105 sticky top-0 bg-white z-10 pt-1">
                  <button 
                    onClick={() => setShowEditProfileSheet(false)} 
                    className="w-10 h-10 hover:bg-zinc-100/70 rounded-full flex items-center justify-center transition-all cursor-pointer text-zinc-900 border border-zinc-100"
                    title="إغلاق"
                  >
                    <X className="w-5 h-5 text-zinc-850 stroke-[2.5px]" />
                  </button>
                  <h2 className="text-sm font-black text-zinc-950 mx-auto">تعديل الملف الشخصي</h2>
                  {/* Spacer on the right to center the title strictly */}
                  <div className="w-10 h-10 opacity-0 pointer-events-none" />
                </div>

                {/* Pinkish Avatar Group with كاميرا 'إضافة' Badge matching Image 1 */}
                <div className="flex flex-col items-center justify-center py-4 relative">
                  <div className="w-28 h-28 bg-[#ffe4e6] border border-rose-100 rounded-full flex items-center justify-center text-[#be123c] font-sans text-5xl font-black shadow-[inset_0_-4px_10px_rgba(190,18,60,0.05)] select-none relative">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'أ'}
                    
                    {/* Adding camera badge overlapping */}
                    <button 
                      onClick={() => {
                        const newName = prompt(language === 'ar' ? 'أدخل اسمك الجديد:' : 'Enter your new name:', userProfile.name || 'أحمد بن علي');
                        if (newName) {
                          updateUserProfile({ ...userProfile, name: newName });
                        }
                      }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-zinc-200 shadow-md py-1.5 px-3 rounded-full flex items-center gap-1 cursor-pointer hover:bg-zinc-50 active:scale-95 transition-all text-[11px] font-black text-zinc-950 whitespace-nowrap"
                    >
                      <Camera className="w-3.5 h-3.5 text-zinc-950 stroke-[2.2px]" />
                      <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>
                    </button>
                  </div>
                </div>

                {/* "ملفي الشخصي" titles + subdescription matching Image 1 */}
                <div className="space-y-1.5 text-right w-full pt-4">
                  <h3 className="text-xl font-black text-zinc-950">ملفي الشخصي</h3>
                  <p className="text-[11.5px] text-zinc-500 font-extrabold leading-relaxed">
                    يمكن للمضيفين والضيوف رؤية ملفك الشخصي وقد يظهر في أقسام أخرى على منصة Airbnb لمساعدتنا في بناء الثقة في مجتمعنا. <span onClick={() => setShowLearnMore(true)} className="underline cursor-pointer font-bold hover:text-[#ff385c] transition-colors">معرفة المزيد</span>
                  </p>
                </div>

                {/* List of Symmetrical fields dynamically clickable & editable */}
                <div className="space-y-0.5 pt-2">
                  {editableFields.map((field) => (
                    <button
                      key={field.id}
                      onClick={() => setEditingField({ id: field.id, label: field.label, value: field.value, icon: field.icon })}
                      className="w-full py-4 bg-white border-b border-zinc-100 flex items-center justify-between text-right cursor-pointer hover:bg-zinc-50/50 rounded-xl px-2.5 transition-all active:scale-[0.99] group"
                    >
                      {/* Right side in RTL (Icon rightmost, then Label/الكتابة next to it) */}
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center text-zinc-550 group-hover:text-[#ff385c] group-hover:border-rose-100 transition-colors">
                          {field.icon}
                        </div>
                        <span className="text-[13px] font-extrabold text-zinc-805 group-hover:text-black transition-colors">
                          {field.label}
                        </span>
                      </div>

                      {/* Left side in RTL (Value or Arrow) */}
                      <div className="flex items-center gap-1.5 transition-all">
                        {field.value ? (
                          <span className="text-[11.5px] font-black text-[#be123c] bg-[#ffe4e6]/30 border border-rose-100/50 py-1.5 px-3 rounded-xl max-w-[160px] truncate">
                            {field.value}
                          </span>
                        ) : (
                          <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover:text-[#ff385c] stroke-[2.2px] transition-colors" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* "نبذة عني" Card exactly matching Image 4 */}
                <div className="pt-6 space-y-2">
                  <h4 className="text-sm font-black text-zinc-950 text-right">نبذة عني</h4>
                  <div className="border border-dashed border-zinc-300 rounded-3xl p-6 text-center space-y-4 my-2 hover:bg-zinc-50/40 transition-colors">
                    <p className="text-zinc-650 font-extrabold text-xs leading-relaxed px-4">
                      {bioText || 'اكتب شيئاً مرحاً ومميزاً.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setEditingField({ id: 'bio', label: 'نبذة عني', value: bioText, icon: <Smile className="w-5 h-5 text-zinc-500" /> })}
                      className="mx-auto block text-xs font-black bg-zinc-950 hover:bg-black text-white py-2.5 px-6 rounded-full shadow-xs cursor-pointer active:scale-95 transition-all"
                    >
                      عرّف عن نفسك
                    </button>
                  </div>
                </div>

                {/* "الأماكن التي تواجدت فيها" Section with Toggle and Slide Card exactly matching Image 4 & 5 */}
                <div className="pt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-zinc-950">الأماكن التي تواجدت فيها</h4>
                    {/* Active Apple/WeChat Style Toggle switch with clean state */}
                    <button 
                      onClick={() => setTogglePlaces(!togglePlaces)}
                      className="cursor-pointer transition-all"
                    >
                      {togglePlaces ? (
                        <div className="w-12 h-6.5 bg-[#ff385c] rounded-full p-0.5 flex justify-end items-center transition-all duration-300 shadow-inner">
                          <div className="w-5.5 h-5.5 bg-white rounded-full shadow-md" />
                        </div>
                      ) : (
                        <div className="w-12 h-6.5 bg-zinc-200 rounded-full p-0.5 flex justify-start items-center transition-all duration-300 shadow-inner">
                          <div className="w-5.5 h-5.5 bg-white rounded-full shadow-md" />
                        </div>
                      )}
                    </button>
                  </div>

                  <p className="text-[11.5px] text-zinc-500 font-bold leading-relaxed text-right pr-0.5">
                    اختر الأختام التي تريد أن يراها الآخرون في ملفك الشخصي.
                  </p>

                  {/* Slider for Places - Beautifully styled with Sun and Earth Icon exactly matching images */}
                  <div className="flex flex-row gap-3.5 overflow-x-auto py-3 no-scrollbar scroll-smooth justify-start w-full" dir="rtl">
                    {/* tissemsilt destination */}
                    <button
                      type="button"
                      onClick={() => setEditingField({ id: 'destination2', label: 'الوجهة التالية الثانية', value: destination2, icon: <Globe className="w-5 h-5 text-zinc-700" /> })}
                      className="bg-white border border-zinc-150 rounded-[1.8rem] p-5 min-w-[190px] text-center space-y-3.5 shrink-0 relative hover:shadow-xs transition-shadow cursor-pointer active:scale-95 text-right flex flex-col items-center justify-center"
                    >
                      <div className="w-13 h-13 rounded-full border border-zinc-150 flex items-center justify-center mx-auto text-zinc-900 bg-zinc-50 shadow-inner">
                        <Globe className="w-5.5 h-5.5 stroke-[1.8px]" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-950 text-center">الوجهة التالية</p>
                        <p className="text-[10px] text-zinc-500 font-extrabold mt-0.5 text-center">{destination2}</p>
                      </div>
                    </button>

                    {/* tipaza destination */}
                    <button
                      type="button"
                      onClick={() => setEditingField({ id: 'destination1', label: 'الوجهة التالية الأولى', value: destination1, icon: <Sun className="w-5 h-5 text-zinc-700" /> })}
                      className="bg-white border border-zinc-150 rounded-[1.8rem] p-5 min-w-[190px] text-center space-y-3.5 shrink-0 relative hover:shadow-xs transition-shadow cursor-pointer active:scale-95 text-right flex flex-col items-center justify-center"
                    >
                      <div className="w-13 h-13 rounded-full border border-zinc-150 flex items-center justify-center mx-auto text-zinc-900 bg-zinc-50 shadow-inner">
                        <Sun className="w-5.5 h-5.5 stroke-[1.8px]" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-950 text-center">الوجهة التالية</p>
                        <p className="text-[10px] text-zinc-500 font-extrabold mt-0.5 text-center">{destination1}</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Bottom Done Bar exactly matching Image 1, 2, 3, 4, 5 */}
                <div className="pt-6 border-t border-zinc-101 mt-6 sticky bottom-0 bg-white pb-2 z-10">
                  <button
                    type="button"
                    onClick={() => {
                      updateUserProfile({
                        ...userProfile,
                        bio: bioText || userProfile.bio
                      });
                      setIsSaved(true);
                      setShowEditProfileSheet(false);
                      setTimeout(() => setIsSaved(false), 3000);
                    }}
                    className="w-full py-4 bg-zinc-950 hover:bg-black text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer active:scale-[0.98] text-center"
                    id="btn-edit-profile-final-done"
                  >
                    تم
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learn More Dialog popup */}
      <AnimatePresence>
        {showLearnMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-xs"
            onClick={() => setShowLearnMore(false)}
          >
            <motion.div
              initial={{ y: 100, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 100, scale: 0.95 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm text-right space-y-4 shadow-xl border border-zinc-100 font-sans"
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b pb-3 border-zinc-100">
                <button onClick={() => setShowLearnMore(false)} className="text-zinc-400 hover:text-zinc-900 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
                <h4 className="text-sm font-black text-zinc-950">بناء الثقة في مجتمعنا</h4>
              </div>

              <div className="space-y-3.5 text-xs text-zinc-600 leading-relaxed font-semibold">
                <p>
                  نحن في <strong>Lacasa</strong> نؤمن بأن الثقة والشفافية هما أساس مجتمعنا النابض بالحياة والآمن.
                </p>
                <p>
                  يساعد إكمال ملفك الشخصي المضيفين والضيوف الآخرين في التعرف عليك بشكل أفضل قبل حجز المساكن أو استضافتها.
                </p>
                <p>
                  يضمن إثبات هويتك وعرض هواياتك وعملك وإقامتك تجربة إقامة دافئة وسلسة وبناء علاقات إنسانية ممتدة ملؤها الاحترام والتقدير المتبادل.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowLearnMore(false)}
                  className="w-full py-3.5 bg-zinc-950 hover:bg-black text-white rounded-xl text-xs font-black cursor-pointer shadow-sm active:scale-95 text-center transition-all"
                >
                  حسناً، فهمت
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
