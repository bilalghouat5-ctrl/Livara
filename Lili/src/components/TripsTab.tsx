import React from 'react';

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

      {/* Empty State exactly matching the mockup screenshot, scaled down and stylized natively */}
      <div className="flex flex-col items-center justify-center space-y-6 pt-4">
        
        {/* Timeline and Card Stack */}
        <div className="relative w-full flex justify-center py-2 px-4" dir="ltr">
          {/* The single timeline connection line */}
          <div className="absolute left-[54px] sm:left-[64px] top-6 bottom-6 w-[1px] bg-zinc-200 pointer-events-none" />

          {/* Rows stack */}
          <div className="w-full max-w-[210px] sm:max-w-[230px] flex flex-col gap-3">
            
            {/* Row 1 */}
            <div className="flex items-center gap-3">
              {/* Dot 1 */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#ebebeb] border-[2px] border-white ring-1 ring-zinc-300/30 shrink-0 z-10" />
              
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-1.5 flex-1 border border-zinc-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=120&q=80" 
                  alt="bedroom preview" 
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="h-2.5 bg-zinc-100 rounded-full w-[70px] sm:w-[80px]" />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-3">
              {/* Dot 2 */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#717171] border-[2px] border-white ring-1 ring-[#717171]/20 shrink-0 z-10" />
              
              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-1.5 flex-1 border border-zinc-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" 
                  alt="experience preview" 
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="h-2.5 bg-zinc-100 rounded-full w-[70px] sm:w-[80px]" />
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex items-center gap-3">
              {/* Dot 3 */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#ebebeb] border-[2px] border-white ring-1 ring-zinc-300/30 shrink-0 z-10" />
              
              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-1.5 flex-1 border border-zinc-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=120&q=80" 
                  alt="dining preview" 
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="h-2.5 bg-zinc-100 rounded-full w-[70px] sm:w-[80px]" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Centered Text Prompt */}
        <div className="text-center space-y-2 mt-4 max-w-sm px-6">
          <h2 className="text-[19px] sm:text-[21px] font-black text-zinc-900 leading-tight">
            خطّط لرحلتك المثالية القادمة
          </h2>
          <div className="text-[12px] sm:text-[13px] font-medium text-zinc-500 space-y-1.5 leading-relaxed">
            <p>استكشف البيوت وتجارب السفر والخدمات.</p>
            <p>ستظهر حجوزاتك هنا عند قيامك بالحجز.</p>
          </div>
        </div>

        {/* Rose/Pink CTA Button */}
        <div className="pt-2">
          <button
            onClick={onNavigateToExplore}
            className="bg-[#df1e5a] hover:bg-rose-600 text-white font-black text-[14px] py-3 px-8 rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            ابدأ الآن
          </button>
        </div>

      </div>
    </div>
  );
};

