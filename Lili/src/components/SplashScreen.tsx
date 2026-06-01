import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC = () => {
  const [hiding, setHiding] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setHiding(true), 2000);
    const timer2 = setTimeout(() => setHidden(true), 2600);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center gap-5 no-select"
      style={{
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        opacity: hiding ? 0 : 1,
        pointerEvents: hiding ? 'none' : 'all',
      }}
    >
      {/* Logo box */}
      <div
        className="gpu"
        style={{
          animation: 'splashLogoIn 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both',
        }}
      >
        <div className="w-24 h-24 bg-zinc-950 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-zinc-900/30 border border-zinc-800/50">
          <svg className="w-13 h-13 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 22,46 L 50,19 L 78,46" />
            <path d="M 68,23 V 33" strokeWidth="5.5" />
            <path d="M 32,46 V 69 H 54 C 65,69 71,62 71,53 V 46" />
            <path d="M 50,46 C 46,46 43,49 43,53 C 43,58 50,64 50,64 C 50,64 57,58 57,53 C 57,49 54,46 50,46 Z" fill="#ff385c" stroke="none" />
            <circle cx="50" cy="53" r="2.5" fill="white" stroke="none" />
          </svg>
        </div>
      </div>

      {/* App name */}
      <div
        style={{ animation: 'splashTextIn 0.45s ease-out 0.55s both' }}
      >
        <span className="text-zinc-900 font-sans text-3xl font-black tracking-tight">Daro</span>
        <p className="text-zinc-400 text-[11px] font-bold text-center mt-0.5 tracking-wide">دارك هنا</p>
      </div>

      {/* Loading dots */}
      <div
        className="flex gap-1.5"
        style={{ animation: 'splashTextIn 0.4s ease-out 0.9s both' }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-rose-500"
            style={{
              animation: `splashDotPulse 0.7s ease-in-out ${0.9 + i * 0.15}s infinite alternate`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
