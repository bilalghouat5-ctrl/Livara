import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { useApp } from './AppContext';
import { 
  Wifi, Signal, Battery, BatteryWarning, Globe, 
  Smartphone, Monitor, Sparkles, RefreshCw, Eye, EyeOff, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { language, setLanguage, isRtl } = useLanguage();
  const { isHosting, triggerModeTransition, isTransitioning, setSelectedListing } = useApp();

  // Local storage viewMode check. Default to 'phone' on desktop, 'full' on real mobile sizes.
  const [viewMode, setViewMode] = useState<'phone' | 'full'>(() => {
    const saved = localStorage.getItem('lacasa_view_mode');
    if (saved === 'phone' || saved === 'full') return saved;
    // Default to 'phone' on wider screens, 'full' on narrow viewports
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768 ? 'phone' : 'full';
    }
    return 'phone';
  });

  const [batteryLevel, setBatteryLevel] = useState<number>(98);
  const [signalType, setSignalType] = useState<'5G' | 'LTE' | 'WiFi' | 'NoSignal'>('WiFi');
  const [currentTime, setCurrentTime] = useState<string>('12:00');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);
  const [showHapticRipple, setShowHapticRipple] = useState<boolean>(false);
  const [rippleCoords, setRippleCoords] = useState({ x: 0, y: 0 });

  // Update localStorage when viewMode changes
  useEffect(() => {
    localStorage.setItem('lacasa_view_mode', viewMode);
  }, [viewMode]);

  // Real-time status bar clock synchronization
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'م' : 'ص'; // Simplified Arabic AM/PM
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${minutes}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Trigger a simulated haptic visual touch ripple inside the phone coordinate frame
  const simulateHapticTouch = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRippleCoords({ x, y });
    setShowHapticRipple(true);
    setTimeout(() => setShowHapticRipple(false), 850);

    // Also trigger physical hardware vibration if available on actual device
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(20);
      } catch (err) {
        // Ignored
      }
    }
  };

  const signalTexts = {
    '5G': 'Daro 5G',
    'LTE': 'Daro LTE',
    'WiFi': 'Daro WiFi',
    'NoSignal': 'لا توجد شبكة'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 transition-all duration-500 flex flex-col md:flex-row justify-center items-center p-0 md:p-6 lg:p-8 overflow-x-hidden select-none">
      
      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-30">
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-[#ff385c]/10 blur-3xl" />
      </div>

      {/* DETACHABLE SIDE CONTROL PLATFORM (DESKTOP CONTROLLER PANEL) */}
      {viewMode === 'phone' && (
        <motion.div 
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col w-72 h-[820px] bg-white border border-zinc-200/80 rounded-[35px] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.03)] mr-6 justify-between shrink-0"
          dir="rtl"
        >
          {/* Section 1: Dashboard Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#ff385c]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#ff385c]" />
              </div>
              <div className="text-right">
                <h2 className="text-sm font-black text-zinc-950">لوحة التحكم الفاخرة</h2>
                <p className="text-[10px] font-bold text-zinc-450 leading-none">مُحاكي الهاتف التفاعلي 3D</p>
              </div>
            </div>
            <div className="border-b border-zinc-100 my-2" />
          </div>

          {/* Section 2: UI View Modes & Simulators */}
          <div className="space-y-5 flex-1 py-4 overflow-y-auto scrollbar-none">
            
            {/* 1. View Mode Toggles */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400">طريقة العرض بالتطبيق</label>
              <div className="grid grid-cols-2 gap-1.5 bg-zinc-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('phone')}
                  className={`py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition ${
                    viewMode === 'phone' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-550 hover:text-zinc-850'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>وضع الهاتف</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('full');
                    setSelectedListing(null);
                  }}
                  className={`py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition ${
                    viewMode === 'full' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-550 hover:text-zinc-850'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>شاشة كاملة</span>
                </button>
              </div>
            </div>

            {/* 2. Language Quick Swapper */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400">تغيير لغة التطبيق الفوري</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { code: 'ar', label: 'العربية 🇩🇿' },
                  { code: 'kab', label: 'Amazigh ⵣ' },
                  { code: 'fr', label: 'Français 🇫ⵔ' },
                  { code: 'en', label: 'English 🇺🇸' }
                ].map((langItem) => (
                  <button
                    key={langItem.code}
                    onClick={() => setLanguage(langItem.code as any)}
                    className={`p-2.5 rounded-xl border text-[11px] font-black text-right flex items-center justify-between cursor-pointer transition active:scale-95 ${
                      language === langItem.code 
                        ? 'bg-rose-50 border-rose-200 text-[#ff385c]' 
                        : 'bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700'
                    }`}
                  >
                    <span>{langItem.label}</span>
                    {language === langItem.code && <Check className="w-3 h-3 text-[#ff385c]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. User Role Direct Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-zinc-400">حالة الحساب النشطة</label>
                {isTransitioning && (
                  <span className="text-[8px] font-extrabold text-[#ff385c] animate-pulse">جاري التحويل...</span>
                )}
              </div>
              <button
                onClick={() => triggerModeTransition(isHosting ? 'guest' : 'host')}
                disabled={isTransitioning}
                className={`w-full py-2.5 rounded-xl text-xs font-black text-center cursor-pointer transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 ${
                  isHosting 
                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                    : 'bg-[#ff385c] text-white hover:bg-[#e61e4d]'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTransitioning ? 'animate-spin' : ''}`} />
                <span>التحويل إلى وضع {isHosting ? 'المسافر (Guest)' : 'المضيف (Host)'}</span>
              </button>
            </div>

            {/* 4. Battery Level Slider */}
            <div className="space-y-2 bg-zinc-50 border border-zinc-150 p-3 rounded-2xl">
              <div className="flex justify-between items-center text-[10px] font-black">
                <span className="text-zinc-700">شحن البطارية محاكاة</span>
                <span className={batteryLevel > 20 ? 'text-green-600' : 'text-red-500'}>{batteryLevel}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
                className="w-full accent-[#ff385c] cursor-ew-resize h-1 bg-zinc-200 rounded-full"
              />
            </div>

            {/* 5. Cellular Signal Type Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400">شبكة الاتصال</label>
              <div className="grid grid-cols-4 gap-1 p-0.5 bg-zinc-100 rounded-xl">
                {(['WiFi', '5G', 'LTE', 'NoSignal'] as const).map((sig) => (
                  <button
                    key={sig}
                    onClick={() => setSignalType(sig)}
                    className={`py-1.5 text-[9px] font-black rounded-lg cursor-pointer transition ${
                      signalType === sig ? 'bg-white shadow-xs text-[#ff385c]' : 'text-zinc-500'
                    }`}
                  >
                    {sig === 'NoSignal' ? 'إيقاف' : sig}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Screen Lock & Brightness */}
            <div className="space-y-2.5 pt-1.5">
              <div className="flex items-center justify-between text-[11px] font-black text-zinc-400">
                <span>إضاءة الشاشة</span>
                <span>{brightness}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full accent-zinc-800 cursor-ew-resize h-1 bg-zinc-200 rounded-full"
              />

              <button
                onClick={() => setIsLocked(!isLocked)}
                className={`w-full py-2 border rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition ${
                  isLocked 
                    ? 'bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800' 
                    : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'
                }`}
              >
                {isLocked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isLocked ? 'إلغاء قفل الشاشة' : 'قفل شاشة الهاتف'}</span>
              </button>
            </div>

          </div>

          {/* Section 3: Brand Stamp */}
          <div className="text-center pt-2">
            <p className="text-[10px] font-black text-zinc-350">Daro Premium Premium v2.5.0</p>
            <p className="text-[9px] font-semibold text-zinc-400 mt-0.5">تحت التشريعات المحلية المنظمة بالجزائر</p>
          </div>
        </motion.div>
      )}

      {/* CORE FRAME CONTAINER WRAPPER */}
      <div className={`relative flex flex-col items-center justify-center transition-all duration-550 ${
        viewMode === 'full' 
          ? 'w-full max-w-7xl' 
          : 'w-full max-w-md md:max-w-none md:w-[420px] shrink-0'
      }`}>
        
        {/* Floating Viewmode control for full screen desktop mode, positioned neatly on top-left */}
        {viewMode === 'full' && (
          <div className="hidden md:flex fixed top-6 left-6 z-50 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-2xl px-4 py-2.5 shadow-md items-center gap-3 animate-fade-in" dir="rtl">
            <span className="text-xs font-black text-zinc-900">أنت في وضع الشاشة الكاملة</span>
            <button
              onClick={() => setViewMode('phone')}
              className="bg-[#ff385c] hover:bg-[#e61e4d] text-white px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold transition active:scale-95 cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>العودة لوضع الهاتف</span>
            </button>
          </div>
        )}

        {/* PHYSICAL HARDWARE SIDE BUTTONS (DESKTOP MODE AT PHONE SHELL) */}
        {viewMode === 'phone' && (
          <>
            {/* Power/Lock Hardware Button (Right side) */}
            <button 
              onClick={() => setIsLocked(!isLocked)}
              className="hidden md:block absolute -right-[15px] top-40 w-[4px] h-[75px] bg-zinc-800 rounded-r-lg ring-1 ring-zinc-950 focus:outline-none cursor-pointer active:scale-y-95 transition-transform"
              title="زر تشغيل وقفل الشاشة"
            />
            {/* Volume Up Hardware Button (Left side) */}
            <button 
              onClick={() => setBrightness(prev => Math.min(100, prev + 10))}
              className="hidden md:block absolute -left-[15px] top-32 w-[4px] h-[50px] bg-zinc-800 rounded-l-lg ring-1 ring-zinc-950 focus:outline-none cursor-pointer active:scale-y-95 transition-transform"
              title="رفع الصوت / زيادة السطوع"
            />
            {/* Volume Down Hardware Button (Left side) */}
            <button 
              onClick={() => setBrightness(prev => Math.max(15, prev - 10))}
              className="hidden md:block absolute -left-[15px] top-[195px] w-[4px] h-[50px] bg-zinc-800 rounded-l-lg ring-1 ring-zinc-950 focus:outline-none cursor-pointer active:scale-y-95 transition-transform"
              title="خفض الصوت / تقليل السطوع"
            />
          </>
        )}

        {/* MAIN DISPLAY SCREEN (BEZEL) ENCLOSURE */}
        <div 
          className={`relative transition-all duration-550 flex flex-col overflow-hidden bg-white ${
            viewMode === 'phone'
              ? 'w-full h-screen sm:h-[840px] rounded-none sm:rounded-[48px] border-0 sm:border-[11px] sm:border-zinc-950 shadow-none sm:shadow-[0_25px_60px_rgba(0,0,0,0.15)] ring-1 ring-zinc-850/50'
              : 'w-full h-screen h-[100dvh] rounded-none border-0 shadow-none ring-0'
          }`}
          style={{ 
            fontSize: viewMode === 'phone' ? '14px' : '16px',
            filter: `brightness(${brightness}%)`
          }}
        >
          
          {/* SIMULATED STATUS BAR DISPLAY (HEADER) ON PHONE BEZEL */}
          {viewMode === 'phone' && (
            <div 
              className="sticky top-0 z-50 h-11 bg-white/95 backdrop-blur-md px-6 flex justify-between items-center select-none pointer-events-none text-zinc-950 text-xs font-black select-none border-b border-transparent"
              style={{ paddingBottom: '2px' }}
            >
              
              {/* Left Side: Signal indicators & WiFi Icons */}
              <div className="flex items-center gap-1.5" dir="ltr">
                <span className="text-[10px] tracking-wide font-black text-zinc-900 mt-0.5">{signalType === 'WiFi' ? 'WiFi' : (signalType === 'NoSignal' ? '' : signalType)}</span>
                {signalType === 'WiFi' ? (
                  <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : signalType === 'NoSignal' ? (
                  <div className="flex gap-0.5 items-end h-2.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-0.5 bg-zinc-300 h-full border border-transparent rounded-xs" />
                    ))}
                  </div>
                ) : (
                  <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
              </div>

              {/* Center Element: High-Fidelity Apple Style Dynamic Island / Camera Notch */}
              <div className="absolute left-1/2 -translate-x-1/2 w-28 h-[25px] bg-zinc-950 rounded-full mt-1.5 flex items-center justify-between px-3.5 no-swipe-back">
                {/* Simulated Green Camera Lens Dot and status dot indicator */}
                <div className="w-[4.5px] h-[4.5px] rounded-full bg-slate-900/80 shadow-inner" />
                <div className="w-[3px] h-[3px] rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100" />
              </div>

              {/* Right Side: Clock Time & Battery Percentage */}
              <div className="flex items-center gap-1.5" dir="ltr">
                <span className="text-[10px] tracking-wide font-black translate-y-[0.5px]">{batteryLevel}%</span>
                <div className="relative w-5.5 h-3 border border-zinc-900 rounded-[4px] p-[1.5px] flex items-center">
                  <div 
                    className={`h-full rounded-[1px] transition-all duration-300 ${
                      batteryLevel <= 20 ? 'bg-red-500' : 'bg-zinc-900'
                    }`} 
                    style={{ width: `${batteryLevel}%` }} 
                  />
                  {/* Battery positive tip */}
                  <div className="absolute -right-[2.5px] top-1/2 -translate-y-1/2 w-[1.5px] h-[3.5px] bg-zinc-900 rounded-r-[1px]" />
                </div>
                <span className="text-[10.5px] tracking-wide font-extrabold font-mono text-zinc-900 ml-1 translate-y-[0.5px]">
                  {currentTime}
                </span>
              </div>

            </div>
          )}

          {/* SIMULATED PHONE VISUAL WAVE RIPPLE MOCK HAPTIC COORDS GRAPHIC */}
          <AnimatePresence>
            {showHapticRipple && (
              <motion.div
                initial={{ transform: 'translate(-50%, -50%) scale(0)', opacity: 0.6 }}
                animate={{ transform: 'translate(-50%, -50%) scale(4)', opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: rippleCoords.y,
                  left: rippleCoords.x,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid #ff385c',
                  background: 'rgba(255, 56, 92, 0.08)',
                  pointerEvents: 'none',
                  zIndex: 99990
                }}
              />
            )}
          </AnimatePresence>

          {/* SCREEN CONTENT INNER AREA (SCROLLABLE CLIPPING BOX) */}
          <div 
            onClick={viewMode === 'phone' ? simulateHapticTouch : undefined}
            className={`flex-1 relative overflow-hidden phone-screen flex flex-col ${
              viewMode === 'phone' ? 'h-full bg-white select-none' : 'h-full w-full bg-white'
            }`}
          >
            {/* SIMULATED LOCK SCREEN COVER (IF PHONE PRESET IS LOCKED) */}
            <AnimatePresence>
              {isLocked && viewMode === 'phone' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-zinc-950/98 backdrop-blur-md z-[99999] flex flex-col justify-between items-center py-20 px-8 text-white select-none"
                  dir="rtl"
                >
                  <div className="text-center space-y-3 mt-10">
                    <Smartphone className="w-12 h-12 text-[#ff385c] mx-auto animate-bounce duration-1000" />
                    <h2 className="text-xl font-black tracking-tight mt-4">Daro Premium Mobile</h2>
                    <p className="text-xs font-bold text-zinc-400">التطبيق مغلق ومحمي بموجب قوانين الحماية الفردية</p>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-2xl font-extrabold tracking-widest text-[#ff385c]/95">{currentTime}</p>
                    <p className="text-[10px] font-black text-zinc-500 mt-1">الجزائر العاصمة، الجمهورية الجزائرية</p>
                  </div>

                  <button
                    onClick={() => setIsLocked(false)}
                    className="px-10 py-3.5 bg-[#ff385c] hover:bg-[#e61e4d] text-white rounded-full text-xs font-black shadow-lg transition duration-200 active:scale-95 cursor-pointer max-w-xs w-full"
                  >
                    فتح قفل الهاتف
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTUAL REACT CHILDREN CONTENT VIEWPORT */}
            <div className="flex-1 flex flex-col justify-between relative min-h-0 bg-white">
              {children}
            </div>

            {/* SIMULATED iOS / ANDROID THIN BOTOM INDICATOR PILL */}
            {viewMode === 'phone' && (
              <div className="sticky bottom-1 z-50 w-full flex justify-center py-2 pointer-events-none no-swipe-back">
                <div className="w-32 h-1 bg-zinc-900/80 hover:bg-zinc-950 rounded-full transition-all" />
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
