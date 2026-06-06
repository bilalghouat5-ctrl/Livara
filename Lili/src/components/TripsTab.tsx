import React from 'react';
import { LottieEmptyState } from './LottieEmptyState';

interface TripsTabProps {
  onNavigateToExplore: () => void;
}

export const TripsTab: React.FC<TripsTabProps> = ({ onNavigateToExplore }) => {
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


