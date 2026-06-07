import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, PanInfo } from 'motion/react';
import { 
  Sparkles, RefreshCw, Smartphone, MapPin, Map, 
  Trash2, Bell, Check, Hand, ArrowUpDown, ChevronUp,
  X, Compass, Heart, Award, Star
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useApp } from './AppContext';

// 1. HIGH-FIDELITY WEB HARWARE AUDIO SYNTHESIS FOR IMMERSIVE HAPTIC FEEDBACK - DISABLED BY USER REQUEST
export const playHapticSound = (type: 'tap' | 'heavy' | 'sucess' | 'success' | 'select' | 'pull') => {
  // Silent return - all sounds disabled
  return;
};

// 2. MULTI-LAYERED SPRING-LOADED SHIMMER TEXT & CARD SKELETON LOADERS
export const ElegantShimmerLoader: React.FC<{ cardsCount?: number }> = ({ cardsCount = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full animate-fade-in py-3">
      {Array.from({ length: cardsCount }).map((_, i) => (
        <div key={i} className="bg-white border border-zinc-150 rounded-2.5xl p-3 flex flex-col justify-between space-y-3 relative overflow-hidden shadow-xs">
          {/* Shimmering highlights overlay */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

          {/* Aspect Square Image skeleton */}
          <div className="bg-zinc-100 rounded-2xl aspect-square w-full relative overflow-hidden flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>

          {/* Detailed text skeletons with multi-tiered widths */}
          <div className="space-y-2 mt-1">
            <div className="h-3.5 bg-zinc-150 rounded-full w-4/5" />
            <div className="h-3 bg-zinc-100 rounded-full w-full" />
            <div className="flex justify-between items-center pt-2 border-t border-zinc-50">
              <div className="h-4 bg-zinc-150 rounded-full w-14" />
              <div className="h-4 bg-zinc-100 rounded-full w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 3. SPRING BOTTOM SHEET WITH GESTURE THROWS, VELOCITY RUNS, AND MULTIPLE ANCHORS
interface ElegantBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ElegantBottomSheet: React.FC<ElegantBottomSheetProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children 
}) => {
  const handleDragEnd = (_event: any, info: PanInfo) => {
    // If dragged down past threshold or high velocity downward, dismiss it
    if (info.offset.y > 150 || info.velocity.y > 500) {
      playHapticSound('heavy');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          
          {/* Animated glass blur backdrop with smooth entering opacity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />

          {/* Core bottom sheet canvas */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.8 }}
            onDragEnd={handleDragEnd}
            className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] shadow-2xl border-t border-zinc-200/80 z-25 max-h-[85vh] flex flex-col justify-between overflow-hidden"
            dir="rtl"
          >
            {/* Grab handlebar for swipe visual cues */}
            <div className="w-full flex justify-center py-3.5 cursor-grab active:cursor-grabbing">
              <div className="w-13 h-1.5 rounded-full bg-zinc-200" />
            </div>

            {/* Header section styled elegantly */}
            <div className="px-6 pb-2.5 flex items-center justify-between border-b border-zinc-100">
              <div className="text-right">
                <h3 className="text-lg font-black text-zinc-950 leading-tight">{title}</h3>
                {subtitle && <p className="text-[11px] font-bold text-zinc-400 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 border border-zinc-150 transition active:scale-90"
              >
                <X className="w-4 h-4 stroke-[2.2px]" />
              </button>
            </div>

            {/* Scrollable sheet body content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 4. TOW-REFRESH CAPTURING SPRING FRAME FOR LIQUID FEED UPDATES
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefreshContainer: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const maxPull = 120;
  const triggerThreshold = 85;

  const handleTouchStart = (e: React.TouchEvent) => {
    // Capture only when we scroll at the extremely top of scroll zone
    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop <= 5 && !isRefreshing) {
      touchStartY.current = e.targetTouches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || isRefreshing) return;
    const currentY = e.targetTouches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    if (deltaY > 0) {
      // Natural logarithmic slide ease pull back tension
      const tensionPull = Math.pow(deltaY, 0.88);
      const boundedY = Math.min(maxPull, tensionPull);
      setPullY(boundedY);

      if (boundedY > triggerThreshold && pullY <= triggerThreshold) {
        playHapticSound('pull');
      }

      // Stop native bounce
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (touchStartY.current === null) return;
    if (pullY >= triggerThreshold) {
      setIsRefreshing(true);
      playHapticSound('heavy');
      try {
        await onRefresh();
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullY(0);
          playHapticSound('sucess');
        }, 300);
      }
    } else {
      setPullY(0);
    }
    touchStartY.current = null;
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative flex flex-col flex-1 w-full h-full overflow-y-auto no-scrollbar"
    >
      {/* Visual slide pulldown progress tracker dial */}
      <div 
        className="absolute left-0 right-0 z-20 flex justify-center items-center pointer-events-none transition-all duration-150"
        style={{ 
          top: isRefreshing ? '16px' : `${-50 + pullY * 0.75}px`,
          opacity: pullY > 15 || isRefreshing ? 1 : 0
        }}
      >
        <div className="bg-white/95 backdrop-blur-md border border-zinc-150 rounded-full p-2.5 shadow-lg flex items-center gap-2">
          <RefreshCw 
            className={`w-4 h-4 text-[#ff385c] ${isRefreshing ? 'animate-spin' : ''}`}
            style={{ transform: `rotate(${pullY * 4.5}deg)` }}
          />
          {pullY >= triggerThreshold && !isRefreshing && (
            <span className="text-[10px] font-black text-zinc-800 animate-pulse px-1">اترك للتحديث</span>
          )}
        </div>
      </div>

      <motion.div 
        style={{ y: isRefreshing ? 55 : pullY * 0.55 }}
        className="w-full h-full flex flex-col flex-1"
      >
        {children}
      </motion.div>
    </div>
  );
};

// 5. TOAST & ALERTS ENGINE TRIGGERED WITH AMBIENT GLASSMORPHISM BLURS
interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warn';
}

export const GlassNotificationBanner: React.FC<{
  toasts: ToastNotification[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-14 left-4 right-4 z-50 flex flex-col items-center pointer-events-none space-y-2.5 max-w-sm mx-auto">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -45, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -25 }}
            transition={{ type: 'spring', damping: 16, stiffness: 220 }}
            className="w-full bg-white/78 backdrop-blur-lg border border-white/30 rounded-2.5xl p-4 shadow-xl flex items-start gap-3.5 pointer-events-auto cursor-pointer text-right relative overflow-hidden"
            dir="rtl"
            onClick={() => removeToast(toast.id)}
          >
            {/* Color Accent bar overlay */}
            <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#ff385c]" />
            
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#ff385c] shrink-0 mt-0.5">
              {toast.type === 'success' ? <Check className="w-4 h-4 stroke-[3px]" /> : <Bell className="w-4 h-4 stroke-[2.2px]" />}
            </div>

            <div className="flex-1 space-y-0.5">
              <h4 className="text-xs font-black text-zinc-950">{toast.title}</h4>
              <p className="text-[10.5px] font-bold text-zinc-500 leading-normal">{toast.message}</p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
              className="text-zinc-400 hover:text-zinc-600 transition p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// 6. HIGH IMPRESSIVE INTERACTIVE SVG MOCKUP MAPS CONTAINER WITH PULSES & GESTURES
export const InteractiveMockMap: React.FC<{
  onClose: () => void;
  listings: any[];
  onSelectListing: (listing: any) => void;
}> = ({ onClose, listings, onSelectListing }) => {
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  
  // Choose beautiful mock coordinates over Algerian coastal geometry
  const mockPins = listings.filter(l => l.rating >= 4.5).slice(0, 5).map((l, idx) => ({
    ...l,
    x: [25, 45, 68, 55, 32][idx] || 40,
    y: [35, 25, 48, 62, 70][idx] || 50,
  }));

  const activeListing = mockPins.find(p => p.id === selectedPinId);

  return (
    <div className="fixed inset-0 z-48 bg-slate-900 flex flex-col text-white overflow-hidden" dir="rtl">
      
      {/* Top Floating bar */}
      <div className="fixed top-14 left-4 right-4 z-49 flex justify-between items-center bg-slate-950/80 backdrop-blur-md rounded-2.5xl p-3 border border-slate-800/60 shadow-xl">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700/50 transition active:scale-90 text-white"
        >
          <X className="w-5 h-5 stroke-[2.2px]" />
        </button>
        <div className="text-right">
          <p className="text-[10px] text-zinc-400 font-bold leading-none">معاينة الخريطة التفاعلية</p>
          <h4 className="text-sm font-black text-rose-450 mt-1">خرائط دار الجزائرية 🇩🇿</h4>
        </div>
      </div>

      {/* SVG Canvas Body */}
      <div className="flex-1 w-full h-full relative flex items-center justify-center bg-slate-900/90">
        
        {/* Absolute Background Stylized Algeria Outline Silhouette SVG Map */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full max-w-sm aspect-square text-slate-800 opacity-30 stroke-slate-700 fill-slate-850"
          strokeWidth="0.5"
        >
          {/* North Coast bay lines and deep coordinates */}
          <path d="M 12 18 Q 28 8 46 16 T 82 12 L 88 50 Q 80 65 60 85 Q 40 98 25 80 Z" />
          {/* Internal Sand Dunes waves */}
          <path d="M 20 50 Q 32 45 45 60 T 70 55" strokeDasharray="2 4" strokeWidth="0.3" opacity="0.5" />
          <path d="M 15 65 Q 28 62 48 72 T 80 65" strokeDasharray="3 3" strokeWidth="0.2" opacity="0.3" />
        </svg>

        {/* Pulse indicators pins */}
        {mockPins.map((pin) => {
          const isSelected = selectedPinId === pin.id;
          return (
            <div
              key={pin.id}
              className="absolute transition-transform duration-300"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              <button
                onClick={() => {
                  playHapticSound('tap');
                  setSelectedPinId(pin.id);
                }}
                className="relative flex items-center justify-center cursor-pointer group"
              >
                {/* Ping expanding halo wave */}
                <div className={`absolute w-9 h-9 rounded-full bg-rose-500/25 animate-ping ${isSelected ? 'scale-150 duration-700' : 'duration-1000'}`} />
                
                {/* Inner marker label card */}
                <div className={`rounded-full px-3 py-1 font-black text-[9px] shadow-lg border transition-all duration-200 flex items-center gap-1.5 transform hover:scale-108 ${
                  isSelected 
                    ? 'bg-rose-500 text-white border-rose-400 scale-110 z-20' 
                    : 'bg-slate-950 text-rose-400 border-slate-700'
                }`}>
                  <MapPin className="w-3 h-3 fill-white" />
                  <span>DZD {pin.pricePerNight.toLocaleString()}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Slideup Floating Showcase Listing card */}
      <AnimatePresence>
        {activeListing && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-49 bg-slate-950/95 border border-slate-800/80 rounded-3.5xl p-4 flex gap-4 shadow-2xl backdrop-blur-md"
            dir="rtl"
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-800">
              <img 
                src={activeListing.images[0]} 
                alt={activeListing.title['ar']} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-between py-0.5 text-right">
              <div>
                <div className="flex items-center gap-1 justify-end text-amber-400 font-extrabold text-[10px]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{activeListing.rating}</span>
                </div>
                <h4 className="text-xs font-black text-white leading-snug mt-1 truncate max-w-[190px]">
                  {activeListing.title['ar']}
                </h4>
                <p className="text-[10px] text-zinc-400 font-bold truncate mt-0.5">
                  {activeListing.location['ar']} • {activeListing.wilaya}
                </p>
              </div>

              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-900">
                <button
                  onClick={() => {
                    playHapticSound('sucess');
                    onClose();
                    onSelectListing(activeListing);
                  }}
                  className="bg-rose-650 hover:bg-rose-600 text-white text-[10px] font-black py-1.5 px-4 rounded-full transition active:scale-95 cursor-pointer shadow-md"
                >
                  تفاصيل السكن
                </button>
                <p className="text-xs font-extrabold text-white">
                  {activeListing.pricePerNight.toLocaleString()} DZD <span className="text-[9px] text-zinc-400 font-normal">/ ليلة</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 7. DRAGGABLE AND BOUNCY TAGS FOR DIRECT INTERESTS ORDERING / SELECTION
export const DraggableInterestBubbles: React.FC<{
  items: string[];
  onChange: (items: string[]) => void;
}> = ({ items, onChange }) => {
  const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);

  const handleDelete = (indexToDelete: number) => {
    playHapticSound('heavy');
    onChange(items.filter((_, idx) => idx !== indexToDelete));
  };

  return (
    <div className="flex flex-wrap gap-2.5 justify-center py-2.5 w-full">
      <AnimatePresence>
        {items.map((item, idx) => (
          <motion.div
            key={item}
            layout
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.4}
            onDragStart={() => {
              playHapticSound('tap');
              setActiveDragIndex(idx);
            }}
            onDragEnd={() => setActiveDragIndex(null)}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border rounded-full text-xs font-black cursor-grab active:cursor-grabbing transition-shadow ${
              activeDragIndex === idx 
                ? 'shadow-lg border-rose-350 bg-rose-50/20 text-[#ff385c]' 
                : 'border-zinc-200 text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            <Hand className="w-3.5 h-3.5 text-zinc-450 stroke-[2.2px]" />
            <span>{item}</span>
            <button 
              type="button" 
              onClick={() => handleDelete(idx)}
              className="text-zinc-400 hover:text-rose-600 transition p-0.5 rounded-full"
            >
              <X className="w-3 h-3 stroke-[2.5px]" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
