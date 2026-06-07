import React from 'react';
import { useApp } from './AppContext';
import { LottieEmptyState } from './LottieEmptyState';

interface TripsTabProps {
  onNavigateToExplore: () => void;
  onLoginRequested?: () => void;
}

export const TripsTab: React.FC<TripsTabProps> = ({ onNavigateToExplore, onLoginRequested }) => {
  const { isRegistered } = useApp();

  if (!isRegistered) {
    return (
      <div className="max-w-md mx-auto px-6 pt-16 pb-12 space-y-7 bg-white min-h-[85vh] text-right font-sans flex flex-col justify-start animate-fade-in" id="trips-tab-unregistered" dir="rtl">
        {/* Title */}
        <div className="pt-4">
          <h1 className="text-[32px] font-black text-zinc-950 tracking-tight leading-tight">
            رحلات
          </h1>
        </div>

        {/* Info Text */}
        <div className="space-y-2 pt-4">
          <h2 className="text-[17px] font-extrabold text-zinc-900 leading-snug">
            لا رحلات حتى الآن
          </h2>
          <p className="text-zinc-500 font-bold text-xs leading-relaxed max-w-[325px]">
            نحن هنا لمساعدتك عندما تكون مستعدًا للتخطيط لرحلتك القادمة.
          </p>
        </div>

        {/* Pink Brand Action Button */}
        <div className="pt-6">
          <button
            type="button"
            onClick={() => {
              if (onLoginRequested) onLoginRequested();
            }}
            className="px-8 py-3.5 bg-[#ff385c] hover:bg-[#e61e4d] text-white font-extrabold text-xs rounded-xl active:scale-95 transition-all shadow-md cursor-pointer text-center leading-none"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-10 pb-6 space-y-5 bg-white text-zinc-900" id="trips-tab-container" dir="rtl">
      
      {/* 1. Large Bold Title aligned strictly to the right */}
      <div className="w-full text-right pt-2 pb-1">
        <h1 className="text-[26px] sm:text-[30px] font-black text-zinc-900 tracking-tight">
          الرحلات
        </h1>
      </div>

      <div className="pt-2">
        <LottieEmptyState
          animationUrl="https://assets2.lottiefiles.com/packages/lf20_at68vnyv.json" // High-fidelity suitcase/travel looping lottie
          title="خطّط لرحلتك المثالية القادمة"
          subtitle="استكشف البيوت وتجارب السفر والخدمات المحلية الفريدة المتاحة في الجزائر. ستظهر حجوزاتك هنا فور قيامك بالحجز."
          actionText="ابدأ الاستكشاف الآن"
          onActionClick={onNavigateToExplore}
          height={200}
        />
      </div>
    </div>
  );
};
