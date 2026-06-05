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
  const { isHosting, isHostRegistered, triggerModeTransition, isTransitioning, setSelectedListing } = useApp();

  // On real mobile (touch device / narrow screen) always use full mode
  const isTouchDevice = typeof window !== 'undefined' && (
    'ontouchstart' in window || window.navigator.maxTouchPoints > 0
  );
  const isNarrow = typeof window !== 'undefined' && window.innerWidth < 768;

  const [viewMode, setViewMode] = useState<'phone' | 'full'>(() => {
    // On real mobile: always full, ignore localStorage
    if (typeof window !== 'undefined' && (window.innerWidth < 768 || isTouchDevice)) {
      return 'full';
    }
    const saved = localStorage.getItem('lacasa_view_mode');
    if (saved === 'phone' || saved === 'full') return saved;
    return window.innerWidth > 768 ? 'phone' : 'full';
  });

  const [batteryLevel, setBatteryLevel]   = useState<number>(98);
  const [signalType, setSignalType]       = useState<'5G' | 'LTE' | 'WiFi' | 'NoSignal'>('WiFi');
  const [currentTime, setCurrentTime]     = useState<string>('12:00');
  const [isLocked, setIsLocked]           = useState<boolean>(false);
  const [brightness, setBrightness]       = useState<number>(100);
  const [showHapticRipple, setShowHapticRipple] = useState<boolean>(false);
  const [rippleCoords, setRippleCoords]   = useState({ x: 0, y: 0 });

  // On real mobile always stay in full mode — phone frame is desktop-only
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('full');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('lacasa_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  const simulateHapticTouch = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRippleCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setShowHapticRipple(true);
    setTimeout(() => setShowHapticRipple(false), 850);
    if (window.navigator?.vibrate) {
      try { window.navigator.vibrate(15); } catch {}
    }
  };

  return (
    <div className={`bg-slate-50 text-zinc-900 transition-all duration-500 flex flex-col md:flex-row justify-center items-center overflow-x-hidden select-none ${viewMode === "full" ? "w-full h-full p-0" : "min-h-screen md:p-6 lg:p-8 p-0"}`}>
      
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-30">
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-[#ff385c]/10 blur-3xl" />
      </div>

      {/* Desktop Control Panel — only in phone mode on md+ */}
      {viewMode === 'phone' && (
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col w-68 lg:w-72 h-[820px] bg-white border border-zinc-200/80 rounded-[35px] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.03)] mr-6 justify-between shrink-0"
          dir="rtl"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              {/* LaCasa brand icon */}
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-[#e01845] flex items-center justify-center shadow-sm">
                <img src="/icon-192.png" alt="LaCasa" className="w-full h-full object-cover" />
              </div>
              <div className="text-right">
                <h2 className="text-sm font-black text-zinc-950">لوحة التحكم</h2>
                <p className="text-[10px] font-bold text-zinc-400 leading-none">LaCasa محاكي تفاعلي</p>
              </div>
            </div>
            <div className="border-b border-zinc-100" />
          </div>

          <div className="space-y-5 flex-1 py-4 overflow-y-auto scrollbar-none">
            {/* View mode */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400">طريقة العرض</label>
              <div className="grid grid-cols-2 gap-1.5 bg-zinc-100 p-1 rounded-xl">
                {(['phone','full'] as const).map((mode) => (
                  <button key={mode} onClick={() => { setViewMode(mode); if(mode==='full') setSelectedListing(null); }}
                    className={`py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition ${viewMode===mode ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'}`}>
                    {mode === 'phone' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                    <span>{mode === 'phone' ? 'هاتف' : 'شاشة كاملة'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400">اللغة</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[{code:'ar',label:'العربية 🇩🇿'},{code:'kab',label:'Amazigh ⵣ'},{code:'fr',label:'Français 🇫🇷'},{code:'en',label:'English 🇺🇸'}].map((l) => (
                  <button key={l.code} onClick={() => setLanguage(l.code as any)}
                    className={`p-2.5 rounded-xl border text-[11px] font-black text-right flex items-center justify-between cursor-pointer transition active:scale-95 ${language===l.code ? 'bg-rose-50 border-rose-200 text-[#ff385c]' : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'}`}>
                    <span>{l.label}</span>
                    {language===l.code && <Check className="w-3 h-3 text-[#ff385c]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-zinc-400">حالة الحساب</label>
                {isTransitioning && <span className="text-[8px] font-extrabold text-[#ff385c] animate-pulse">جاري التحويل...</span>}
              </div>
              {isHostRegistered ? (
                <button onClick={() => triggerModeTransition(isHosting ? 'guest' : 'host')} disabled={isTransitioning}
                  className={`w-full py-2.5 rounded-xl text-xs font-black text-center cursor-pointer transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 ${isHosting ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-[#ff385c] text-white hover:bg-[#e61e4d]'}`}>
                  <RefreshCw className={`w-3.5 h-3.5 ${isTransitioning ? 'animate-spin' : ''}`} />
                  <span>التحويل إلى {isHosting ? 'مسافر' : 'مضيف'}</span>
                </button>
              ) : (
                <div className="w-full p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl text-right text-zinc-500 text-[10px] font-bold leading-normal">
                  🔒 يرجى تفعيل الاستضافة من تبويب الملف الشخصي.
                </div>
              )}
            </div>

            {/* Battery */}
            <div className="space-y-2 bg-zinc-50 border border-zinc-100 p-3 rounded-2xl">
              <div className="flex justify-between text-[10px] font-black">
                <span className="text-zinc-700">البطارية</span>
                <span className={batteryLevel > 20 ? 'text-green-600' : 'text-red-500'}>{batteryLevel}%</span>
              </div>
              <input type="range" min="5" max="100" value={batteryLevel} onChange={(e) => setBatteryLevel(+e.target.value)}
                className="w-full accent-[#ff385c] cursor-ew-resize h-1 bg-zinc-200 rounded-full" />
            </div>

            {/* Signal */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400">الشبكة</label>
              <div className="grid grid-cols-4 gap-1 p-0.5 bg-zinc-100 rounded-xl">
                {(['WiFi','5G','LTE','NoSignal'] as const).map((sig) => (
                  <button key={sig} onClick={() => setSignalType(sig)}
                    className={`py-1.5 text-[9px] font-black rounded-lg cursor-pointer transition ${signalType===sig ? 'bg-white shadow-xs text-[#ff385c]' : 'text-zinc-500'}`}>
                    {sig === 'NoSignal' ? 'إيقاف' : sig}
                  </button>
                ))}
              </div>
            </div>

            {/* Brightness + lock */}
            <div className="space-y-2.5 pt-1.5">
              <div className="flex justify-between text-[11px] font-black text-zinc-400">
                <span>الإضاءة</span><span>{brightness}%</span>
              </div>
              <input type="range" min="15" max="100" value={brightness} onChange={(e) => setBrightness(+e.target.value)}
                className="w-full accent-zinc-800 cursor-ew-resize h-1 bg-zinc-200 rounded-full" />
              <button onClick={() => setIsLocked(!isLocked)}
                className={`w-full py-2 border rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition ${isLocked ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'}`}>
                {isLocked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isLocked ? 'إلغاء القفل' : 'قفل الشاشة'}</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-[10px] font-black text-zinc-350">LaCasa v2.5.0</p>
            <p className="text-[9px] font-semibold text-zinc-400 mt-0.5">الجزائر — جميع الحقوق محفوظة</p>
          </div>
        </motion.div>
      )}

      {/* Main frame */}
      <div className={`relative flex flex-col items-center justify-center transition-all duration-500 ${
        viewMode === 'full'
          ? 'w-full h-full flex-1'
          : 'w-full max-w-[430px] sm:max-w-none sm:w-[420px] shrink-0'
      }`}>

        {/* Full-screen indicator bar */}
        {viewMode === 'full' && (
          <div className="hidden md:flex fixed top-4 left-4 z-50 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-2xl px-4 py-2.5 shadow-md items-center gap-3" dir="rtl">
            <img src="/icon-192.png" alt="LaCasa" className="w-6 h-6 rounded-lg object-cover" />
            <span className="text-xs font-black text-zinc-900">وضع الشاشة الكاملة</span>
            <button onClick={() => setViewMode('phone')}
              className="bg-[#e01845] hover:bg-[#c5123a] text-white px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold transition active:scale-95 cursor-pointer flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>وضع الهاتف</span>
            </button>
          </div>
        )}

        {/* Side hardware buttons */}
        {viewMode === 'phone' && (
          <>
            <button onClick={() => setIsLocked(!isLocked)}
              className="hidden sm:block absolute -right-[14px] top-40 w-[4px] h-[72px] bg-zinc-800 rounded-r-lg ring-1 ring-zinc-950 cursor-pointer active:scale-y-95 transition-transform" />
            <button onClick={() => setBrightness(p => Math.min(100, p + 10))}
              className="hidden sm:block absolute -left-[14px] top-32 w-[4px] h-[50px] bg-zinc-800 rounded-l-lg ring-1 ring-zinc-950 cursor-pointer active:scale-y-95 transition-transform" />
            <button onClick={() => setBrightness(p => Math.max(15, p - 10))}
              className="hidden sm:block absolute -left-[14px] top-[194px] w-[4px] h-[50px] bg-zinc-800 rounded-l-lg ring-1 ring-zinc-950 cursor-pointer active:scale-y-95 transition-transform" />
          </>
        )}

        {/* Screen bezel */}
        <div
          className={`relative transition-all duration-500 flex flex-col overflow-hidden bg-white ${
            viewMode === 'phone'
              ? 'w-full h-[840px] rounded-[48px] border-[11px] border-zinc-950 shadow-[0_25px_60px_rgba(0,0,0,0.18)] ring-1 ring-zinc-800/40'
              : 'w-full rounded-none border-0'
          }`}
          style={{
            fontSize: viewMode === 'phone' ? '14px' : '16px',
            filter: `brightness(${brightness}%)`,
            height: viewMode === 'full' ? '100dvh' : undefined,
          }}
        >
          {/* Status bar */}
          {viewMode === 'phone' && (
            <div className="sticky top-0 z-50 h-11 bg-white/95 backdrop-blur-md px-5 flex justify-between items-center pointer-events-none text-zinc-950 border-b border-transparent">
              <div className="flex items-center gap-1.5" dir="ltr">
                <span className="text-[10px] tracking-wide font-black">
                  {signalType === 'WiFi' ? 'WiFi' : signalType === 'NoSignal' ? '' : signalType}
                </span>
                {signalType === 'WiFi' ? (
                  <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : signalType === 'NoSignal' ? (
                  <div className="flex gap-0.5 items-end h-2.5">
                    {[1,2,3,4].map(i => <div key={i} className="w-0.5 bg-zinc-300 rounded-sm" style={{height: `${i*25}%`}} />)}
                  </div>
                ) : (
                  <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
              </div>

              {/* Dynamic island */}
              <div className="absolute left-1/2 -translate-x-1/2 w-28 h-[25px] bg-zinc-950 rounded-full mt-1" />

              <div className="flex items-center gap-1.5" dir="ltr">
                <span className="text-[10px] font-black">{batteryLevel}%</span>
                <div className="relative w-5 h-2.5 border border-zinc-900 rounded-[3px] p-[1.5px] flex items-center">
                  <div className={`h-full rounded-[1px] transition-all ${batteryLevel <= 20 ? 'bg-red-500' : 'bg-zinc-900'}`}
                    style={{ width: `${batteryLevel}%` }} />
                  <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1.5px] h-[3px] bg-zinc-900 rounded-r" />
                </div>
                <span className="text-[10.5px] font-extrabold font-mono ml-1">{currentTime}</span>
              </div>
            </div>
          )}

          {/* Haptic ripple */}
          <AnimatePresence>
            {showHapticRipple && (
              <motion.div
                initial={{ transform: 'translate(-50%,-50%) scale(0)', opacity: 0.6 }}
                animate={{ transform: 'translate(-50%,-50%) scale(4)', opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: rippleCoords.y,
                  left: rippleCoords.x,
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  border: '2px solid #e01845',
                  background: 'rgba(224,24,69,0.07)',
                  pointerEvents: 'none',
                  zIndex: 99990
                }}
              />
            )}
          </AnimatePresence>

          {/* App content */}
          <div
            onClick={viewMode === 'phone' ? simulateHapticTouch : undefined}
            className="flex-1 relative overflow-hidden phone-screen flex flex-col h-full bg-white"
          >
            {/* Lock screen */}
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
                    <img src="/icon-192.png" alt="LaCasa" className="w-16 h-16 rounded-2xl mx-auto object-cover shadow-lg" />
                    <h2 className="text-xl font-black tracking-tight mt-4">LaCasa</h2>
                    <p className="text-xs font-bold text-zinc-400">دارك هنا — الجزائر</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-extrabold tracking-widest text-[#e01845]">{currentTime}</p>
                    <p className="text-[10px] font-black text-zinc-500 mt-1">الجزائر العاصمة</p>
                  </div>
                  <button onClick={() => setIsLocked(false)}
                    className="px-10 py-3.5 bg-[#e01845] hover:bg-[#c5123a] text-white rounded-full text-xs font-black shadow-lg transition active:scale-95 cursor-pointer w-full max-w-xs">
                    فتح القفل
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col justify-between relative min-h-0 bg-white">
              {children}
            </div>

            {/* Home indicator */}
            {viewMode === 'phone' && (
              <div className="sticky bottom-1 z-50 w-full flex justify-center py-1.5 pointer-events-none">
                <div className="w-28 h-1 bg-zinc-900/70 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
