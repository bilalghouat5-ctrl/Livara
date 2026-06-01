import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HostTransitionOverlayProps {
  isVisible: boolean;
  targetMode: 'host' | 'guest';
}

export const HostTransitionOverlay: React.FC<HostTransitionOverlayProps> = ({ isVisible, targetMode }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'enter' | 'main' | 'exit'>('enter');

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setPhase('enter');
      return;
    }

    setPhase('enter');
    const enterTimer = setTimeout(() => setPhase('main'), 400);

    // Smooth eased progress via requestAnimationFrame at 60fps
    let start: number | null = null;
    const duration = 2600; // ms
    let rafId: number;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      // Ease-out cubic
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(enterTimer);
    };
  }, [isVisible]);

  const isHost = targetMode === 'host';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9000] bg-white flex flex-col items-center justify-between select-none gpu"
          style={{ paddingTop: 'env(safe-area-inset-top, 16px)', paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
          dir="rtl"
        >
          {/* ── Top badge ── */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pt-14 flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-[11px] font-black tracking-wide"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-zinc-600">شبكة Daro الجزائرية</span>
          </motion.div>

          {/* ── Center ── */}
          <div className="flex flex-col items-center gap-6 px-8 text-center">

            {/* Animated logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.92, 1.04, 0.97, 1], opacity: 1 }}
              transition={{
                opacity: { duration: 0.4, delay: 0.1 },
                scale: { duration: 0.8, delay: 0.1, times: [0, 0.5, 0.75, 1] },
              }}
            >
              <div className="w-[88px] h-[88px] bg-zinc-950 rounded-[1.8rem] flex items-center justify-center shadow-xl shadow-zinc-900/25 border border-zinc-800/60">
                <svg className="w-[50px] h-[50px] text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 22,46 L 50,19 L 78,46" />
                  <path d="M 68,23 V 33" strokeWidth="5.5" />
                  <path d="M 32,46 V 69 H 54 C 65,69 71,62 71,53 V 46" />
                  <path d="M 50,46 C 46,46 43,49 43,53 C 43,58 50,64 50,64 C 50,64 57,58 57,53 C 57,49 54,46 50,46 Z" fill="#ff385c" stroke="none" />
                  <circle cx="50" cy="53" r="2.5" fill="white" stroke="none" />
                </svg>
              </div>
            </motion.div>

            {/* Mode badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className={`text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase ${
                isHost ? 'bg-zinc-900 text-white' : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}
            >
              {isHost ? '🏠 نمط المستضيف' : '✈️ نمط السفر'}
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-2"
            >
              <h2 className="text-[22px] font-black text-zinc-950 leading-tight tracking-tight">
                {isHost ? 'الانتقال إلى واجهة المستضيف' : 'الانتقال إلى واجهة الضيف'}
              </h2>
              <p className="text-[12px] font-bold text-zinc-400 leading-relaxed max-w-[260px] mx-auto">
                {isHost
                  ? 'يتم الآن تهيئة أدوات الاستضافة وتحديث لوحة الإعلانات.'
                  : 'جاري مواءمة محرك البحث وتفضيلاتك وتواريخ حجوزاتك.'}
              </p>
            </motion.div>
          </div>

          {/* ── Bottom Progress ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="w-full max-w-[280px] pb-12 space-y-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 px-0.5">
                <span className="font-black text-rose-500 tabular-nums">{progress}%</span>
                <span>جاري التحميل...</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-rose-500 rounded-full gpu"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.05, ease: 'linear' }}
                />
              </div>
            </div>
            <p className="text-center text-[10px] text-zinc-400 font-bold">
              © 2026 Daro — Asirem CORP. جميع الحقوق محفوظة
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
