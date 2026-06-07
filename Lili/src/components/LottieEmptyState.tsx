import React from 'react';

interface LottieEmptyStateProps {
  animationUrl: string;
  title: string;
  subtitle: string;
  actionText?: string;
  onActionClick?: () => void;
  height?: number | string;
}

export const LottieEmptyState: React.FC<LottieEmptyStateProps> = ({
  animationUrl,
  title,
  subtitle,
  actionText,
  onActionClick,
  height = 180
}) => {
  const LottiePlayer = 'lottie-player' as any;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-sm mx-auto" dir="rtl">
      {/* Lottie Animation Player Frame */}
      <div 
        className="relative flex items-center justify-center w-full transition-all duration-300"
        style={{ height }}
      >
        <LottiePlayer
          src={animationUrl}
          background="transparent"
          speed="1"
          style={{ width: '100%', height: '100%', maxWidth: '280px' }}
          loop
          autoplay
        />
      </div>

      {/* Styled text & info matching high-fidelity Arabic localization */}
      <div className="space-y-2 px-2">
        <h3 className="text-[18px] font-black text-zinc-900 leading-tight">
          {title}
        </h3>
        <p className="text-[12.5px] font-semibold text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Conditional CTA Button styled to match active action states */}
      {actionText && onActionClick && (
        <div className="pt-2">
          <button
            onClick={onActionClick}
            className="bg-zinc-900 hover:bg-black text-white font-extrabold text-[13px] py-3 px-8 rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};
