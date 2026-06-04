import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoSrc from '../assets/images/asirem_logo_1780199814542.png';

interface SplashScreenProps {
  onFinished: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [phase, setPhase] = useState<'logo' | 'tagline' | 'exit'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tagline'), 900);
    const t2 = setTimeout(() => setPhase('exit'), 2600);
    const t3 = setTimeout(() => onFinished(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinished]);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 z-[999999] flex flex-col items-center justify-center bg-white select-none overflow-hidden"
          dir="rtl"
        >
          {/* Animated background blobs */}
          <motion.div
            className="absolute top-0 right-0 w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,56,92,0.12) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,56,92,0.08) 0%, transparent 70%)' }}
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Logo container */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{ background: 'radial-gradient(circle, rgba(255,56,92,0.18) 0%, transparent 65%)' }}
              animate={{ scale: [0.95, 1.1, 0.95] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Logo image */}
            <motion.img
              src={logoSrc}
              alt="La Casa Logo"
              className="w-48 h-auto object-contain relative z-10"
              style={{ mixBlendMode: 'multiply' }}
              initial={{ filter: 'blur(8px)' }}
              animate={{ filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
          </motion.div>

          {/* Tagline */}
          <AnimatePresence>
            {phase === 'tagline' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mt-6 text-center px-8"
              >
                <p className="text-[13px] font-bold text-zinc-400 tracking-wide">
                  استكشف الجزائر من بيت إلى بيت
                </p>
                <motion.div
                  className="mt-4 flex items-center justify-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#ff385c]"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom brand */}
          <motion.p
            className="absolute bottom-8 text-[10px] font-bold text-zinc-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Daro Premium · الجزائر
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
