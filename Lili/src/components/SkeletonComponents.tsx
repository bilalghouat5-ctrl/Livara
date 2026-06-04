import React from 'react';

// ── Base shimmer pulse ─────────────────────────────────────────────
export const Shimmer: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <div className={`skeleton-shimmer rounded-xl ${className}`} style={style} />
);

// ── Listing card skeleton (horizontal shelf) ───────────────────────
export const ListingCardSkeleton: React.FC = () => (
  <div className="w-52 shrink-0 space-y-2.5">
    <Shimmer className="w-full aspect-[4/3] rounded-2xl" />
    <div className="space-y-1.5 px-0.5">
      <div className="flex justify-between items-center">
        <Shimmer className="h-3 w-16 rounded-lg" />
        <Shimmer className="h-3 w-8 rounded-lg" />
      </div>
      <Shimmer className="h-4 w-40 rounded-lg" />
      <Shimmer className="h-3 w-28 rounded-lg" />
      <Shimmer className="h-3 w-20 rounded-lg" />
    </div>
  </div>
);

// ── Full-width listing row skeleton (trips / bookings) ─────────────
export const ListingRowSkeleton: React.FC = () => (
  <div className="flex gap-3 items-center p-3 border border-zinc-100 rounded-2xl">
    <Shimmer className="w-20 h-20 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Shimmer className="h-3.5 w-4/5 rounded-lg" />
      <Shimmer className="h-3 w-1/2 rounded-lg" />
      <Shimmer className="h-3 w-1/3 rounded-lg" />
    </div>
  </div>
);

// ── Category pill row skeleton ─────────────────────────────────────
export const CategoryPillsSkeleton: React.FC = () => (
  <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
    {[80, 70, 90, 65, 75, 60].map((w, i) => (
      <Shimmer key={i} className={`h-9 rounded-full shrink-0`} style={{ width: `${w}px` }} />
    ))}
  </div>
);

// ── Hero / header section skeleton ────────────────────────────────
export const HeroSkeleton: React.FC = () => (
  <div className="px-4 space-y-3">
    <Shimmer className="h-5 w-32 rounded-xl" />
    <Shimmer className="h-12 w-full rounded-2xl" />
  </div>
);

// ── Message row skeleton ───────────────────────────────────────────
export const MessageRowSkeleton: React.FC = () => (
  <div className="flex gap-3 items-center px-4 py-3">
    <Shimmer className="w-12 h-12 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex justify-between">
        <Shimmer className="h-3.5 w-28 rounded-lg" />
        <Shimmer className="h-3 w-10 rounded-lg" />
      </div>
      <Shimmer className="h-3 w-52 rounded-lg" />
    </div>
  </div>
);

// ── Profile section skeleton ───────────────────────────────────────
export const ProfileSkeleton: React.FC = () => (
  <div className="px-4 space-y-5">
    <div className="flex flex-col items-center gap-3 pt-4">
      <Shimmer className="w-24 h-24 rounded-full" />
      <Shimmer className="h-5 w-32 rounded-xl" />
      <Shimmer className="h-3.5 w-48 rounded-lg" />
    </div>
    <div className="space-y-3 pt-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3 p-3 border border-zinc-100 rounded-2xl">
          <Shimmer className="w-8 h-8 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Shimmer className="h-3.5 w-24 rounded-lg" />
            <Shimmer className="h-3 w-40 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Host dashboard skeleton ────────────────────────────────────────
export const HostDashboardSkeleton: React.FC = () => (
  <div className="px-4 space-y-4">
    <Shimmer className="h-8 w-40 rounded-xl" />
    <div className="grid grid-cols-2 gap-3">
      {[1,2,3,4].map(i => (
        <div key={i} className="p-4 border border-zinc-100 rounded-2xl space-y-2">
          <Shimmer className="h-3 w-16 rounded-lg" />
          <Shimmer className="h-7 w-20 rounded-xl" />
        </div>
      ))}
    </div>
    <Shimmer className="h-40 w-full rounded-2xl" />
    <div className="space-y-2">
      {[1,2,3].map(i => (
        <ListingRowSkeleton key={i} />
      ))}
    </div>
  </div>
);

// ── Full page skeleton loader (used for tab switching) ─────────────
interface FullPageSkeletonProps {
  type?: 'explore' | 'messages' | 'profile' | 'host';
}

export const FullPageSkeleton: React.FC<FullPageSkeletonProps> = ({ type = 'explore' }) => {
  if (type === 'messages') return (
    <div className="pt-2 space-y-1">
      <div className="px-4 pb-3"><Shimmer className="h-10 w-full rounded-2xl" /></div>
      {[1,2,3,4,5].map(i => <MessageRowSkeleton key={i} />)}
    </div>
  );

  if (type === 'profile') return <ProfileSkeleton />;
  if (type === 'host') return <HostDashboardSkeleton />;

  return (
    <div className="space-y-5 pt-2">
      <HeroSkeleton />
      <CategoryPillsSkeleton />
      <div className="px-4 space-y-5">
        {[1, 2].map(section => (
          <div key={section} className="space-y-3">
            <Shimmer className="h-4 w-32 rounded-lg" />
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {[1, 2, 3].map(i => <ListingCardSkeleton key={i} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
