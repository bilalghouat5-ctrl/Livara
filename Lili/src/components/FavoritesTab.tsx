import React, { useState } from 'react';
import { useApp } from './AppContext';
import { useLanguage } from './LanguageContext';
import { Heart, Star, Sparkles, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { motion } from 'motion/react';
import { LottieEmptyState } from './LottieEmptyState';

interface FavoritesTabProps {
  onNavigateToExplore: () => void;
  onLoginRequested?: () => void;
}

const getGroupTitle = (date: Date) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const target = new Date(date);
  target.setHours(0,0,0,0);
  
  const diffTime = today.getTime() - target.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) {
    return 'اليوم';
  } else if (diffDays === 1) {
    return 'البارحة';
  } else {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = [
      'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
      'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const dayName = days[target.getDay()];
    const dayNum = target.getDate();
    const monthName = months[target.getMonth()];
    return `${dayName}، ${dayNum} ${monthName}`;
  }
};

export const FavoritesTab: React.FC<FavoritesTabProps> = ({ onNavigateToExplore, onLoginRequested }) => {
  const { listings, favorites, toggleFavorite, setSelectedListing, recentlyViewed, removeRecentViewed, isRegistered } = useApp();
  const { t, language } = useLanguage();
  const [activeFolder, setActiveFolder] = useState<'recent' | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  if (!isRegistered) {
    return (
      <div className="max-w-md mx-auto px-6 pt-16 pb-12 space-y-7 bg-white min-h-[85vh] text-right font-sans flex flex-col justify-start animate-fade-in" id="favorites-tab-unregistered" dir="rtl">
        {/* Title */}
        <div className="pt-4 animate-fade-in">
          <h1 className="text-[32px] font-black text-zinc-950 tracking-tight leading-tight">
            المختارات
          </h1>
        </div>

        {/* Info Text */}
        <div className="space-y-2 pt-4">
          <h2 className="text-[17px] font-extrabold text-zinc-900 leading-snug">
            تسجيل الدخول لعرض قوائم مختاراتك
          </h2>
          <p className="text-zinc-500 font-bold text-xs leading-relaxed max-w-[325px]">
            يمكنك إنشاء قوائم مختاراتك أو عرضها أو تعديلها بمجرد تسجيل الدخول.
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

  const favoriteListings = listings.filter((item) => favorites.includes(item.id));

  // Collage image references matching the mockup:
  // 1. Bed (modern room)
  // 2. Single bedroom shelf
  // 3. Experience/Group of friends
  // 4. Pool lounge/spa style
  const defaultCollageImages = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80'
  ];

  // Dynamic collage images: Prefer user favorites, fallback to defaults
  const getCollageImages = () => {
    const images: string[] = [];
    // Gather up to 4 images from user favorites
    favoriteListings.slice(0, 4).forEach((lst) => {
      if (lst.images && lst.images[0]) {
        images.push(lst.images[0]);
      }
    });
    // Fallback if we have fewer than 4 favorited images
    while (images.length < 4) {
      images.push(defaultCollageImages[images.length]);
    }
    return images;
  };

  const collageImages = getCollageImages();

  if (activeFolder === 'recent') {
    const viewedItems = recentlyViewed
      .map((val) => {
        const listing = listings.find((l) => l.id === val.id);
        return listing ? { listing, viewedAt: new Date(val.viewedAt) } : null;
      })
      .filter((item): item is { listing: typeof listings[0]; viewedAt: Date } => item !== null);

    const groups: { [title: string]: typeof viewedItems } = {};
    viewedItems.forEach((item) => {
      const title = getGroupTitle(item.viewedAt);
      if (!groups[title]) {
        groups[title] = [];
      }
      groups[title].push(item);
    });

    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 pt-10 pb-6 bg-white text-zinc-900" id="favorites-details-container" dir="rtl">
        
        {/* Top bar header */}
        <div className="flex items-center justify-between pb-4">
          {/* Top-Right Circular Back Button pointing to the RIGHT exactly like the mockup */}
          <button
            onClick={() => {
              setActiveFolder(null);
              setIsEditing(false);
            }}
            className="w-10 h-10 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5 text-zinc-800" />
          </button>

          {/* Top-Left Edit Button pill */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`font-extrabold px-4 py-1.5 rounded-full text-[12px] transition-all cursor-pointer active:scale-95 ${
              isEditing 
                ? 'bg-[#111111] text-white shadow-sm' 
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
            }`}
          >
            {isEditing ? 'تمّ' : 'تعديل'}
          </button>
        </div>

        {/* Big Header aligned strictly to the right: "تمّ عرضه مؤخّرًا" */}
        <div className="w-full text-right pb-1">
          <h1 className="text-[28px] sm:text-[32px] font-black text-[#111111] tracking-tight leading-tight">
            تمّ عرضه مؤخّرًا
          </h1>
        </div>

        {viewedItems.length === 0 ? (
          <div className="w-full pt-4">
            <LottieEmptyState
              animationUrl="https://assets3.lottiefiles.com/packages/lf20_jz2se6pg.json" // Beautiful star / bookmark favorites empty state
              title="لم تقم بعرض أي عقار بعد"
              subtitle="ستظهر هنا البيوت والخدمات التي اطلعت على إعلاناتها خلال آخر 30 يومًا للعودة إليها بسهولة."
              actionText="بدء الاستكشاف"
              onActionClick={onNavigateToExplore}
              height={180}
            />
          </div>
        ) : (
          /* Render groups dynamically: Today, Yesterday, Historic */
          <div className="space-y-6 pt-2">
            {Object.entries(groups).map(([groupTitle, items]) => (
              <div key={groupTitle} className="space-y-3">
                {/* Date Group Header Text */}
                <h3 className="text-[15px] sm:text-[16px] font-black text-zinc-900 text-right w-full pr-0.5 pt-1">
                  {groupTitle}
                </h3>

                {/* Grid exactly structured like mockup screenshot */}
                <div className="grid grid-cols-2 gap-3.5">
                  {items.map(({ listing }) => {
                    const isFav = favorites.includes(listing.id);
                    const isHotel = listing.location[language] === 'فندق' || listing.id.includes('hotel');
                    
                    // Style exactly matching mockup: "سرير 1 • ★ 4.94" or "فندق • ★ 4.82"
                    const itemSubtitle = isHotel 
                      ? `فندق • ★ ${listing.rating}` 
                      : `سرير ${listing.beds} • ★ ${listing.rating}`;

                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={isEditing ? {} : { y: -3 }}
                        transition={{ duration: 0.18 }}
                        key={listing.id}
                        onClick={() => {
                          if (isEditing) {
                            removeRecentViewed(listing.id);
                          } else {
                            setSelectedListing(listing);
                          }
                        }}
                        className={`group bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between relative transition-all duration-300 ${
                          isEditing ? 'opacity-95' : ''
                        }`}
                      >
                        {/* Image Container */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100/65 shadow-xs">
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title[language]}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
                          
                          {/* Heart Button Overlay (Only visual or functional when not editing) */}
                          {!isEditing && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(listing.id);
                              }}
                              className="absolute top-2 left-2 z-10 bg-transparent text-white hover:scale-110 active:scale-95 transition-all outline-none"
                            >
                              <Heart className={`w-4.5 h-4.5 drop-shadow-[0_1.5px_3.5px_rgba(0,0,0,0.65)] ${
                                isFav ? 'fill-[#ff385c] text-[#ff385c] stroke-none' : 'text-white stroke-white'
                              }`} strokeWidth={2.5} />
                            </button>
                          )}

                          {/* Beautiful white circle 'X' overlay in edit mode */}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRecentViewed(listing.id);
                              }}
                              className="absolute top-2 right-2 z-35 bg-white border border-zinc-200 shadow-md text-zinc-900 rounded-full w-7 h-7 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                              title="حذف من السجل"
                            >
                              <X className="w-3.5 h-3.5 text-black stroke-[3.5px]" />
                            </button>
                          )}
                        </div>

                        {/* Text labels below the card image matching mockup */}
                        <div className="pt-2 px-0.5 text-right flex flex-col justify-between">
                          <h4 className="font-extrabold text-[#111111] text-[11px] leading-tight truncate">
                            {listing.title[language]}
                          </h4>
                          <p className="text-zinc-500 text-[9.5px] font-bold mt-1">
                            {itemSubtitle}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // default view matching the exact folder-collage from the mockup screenshot:
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-10 pb-6 space-y-5 bg-white text-zinc-900" id="favorites-tab-container" dir="rtl">
      
      {/* 1. Precise Clean Right-Aligned Bold Header */}
      <div className="w-full text-right pt-2 pb-1">
        <h1 className="text-[26px] sm:text-[30px] font-black text-zinc-900 tracking-tight">
          المختارات
        </h1>
      </div>

      {/* 2. Stunning folder collage layout exactly as shown in the screenshot */}
      <div className="flex justify-start pt-1">
        <motion.div 
          onClick={() => setActiveFolder('recent')}
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ duration: 0.22 }}
          className="group w-[150px] sm:w-[180px] cursor-pointer flex flex-col items-start text-right transition-all outline-none"
          id="favorites-folder-recent-view"
        >
          {/* Collage wrapper - 2x2 grid representing folder contents with heavy rounded borders and shadow */}
          <div className="relative w-full aspect-square rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden bg-zinc-100 border border-zinc-200/40 shadow-[0_4px_15px_rgba(0,0,0,0.045)] group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)] gap-[1px] grid grid-cols-2 grid-rows-2">
            
            {/* Cell 1: Top-Left */}
            <div className="relative w-full h-full bg-zinc-100/30 overflow-hidden border-b border-l border-white/60">
              <img src={collageImages[0]} alt="bedroom preview" className="w-full h-full object-cover" />
            </div>

            {/* Cell 2: Top-Right */}
            <div className="relative w-full h-full bg-zinc-100/30 overflow-hidden border-b border-white/60">
              <img src={collageImages[1]} alt="bedroom 2 preview" className="w-full h-full object-cover" />
            </div>

            {/* Cell 3: Bottom-Left */}
            <div className="relative w-full h-full bg-zinc-100/30 overflow-hidden border-l border-white/60">
              <img src={collageImages[2]} alt="experience preview" className="w-full h-full object-cover" />
            </div>

            {/* Cell 4: Bottom-Right */}
            <div className="relative w-full h-full bg-zinc-100/30 overflow-hidden">
              <img src={collageImages[3]} alt="pool/spa preview" className="w-full h-full object-cover" />
            </div>

            {/* Quick favorites count floating badge */}
            {favoriteListings.length > 0 && (
              <span className="absolute bottom-2.5 right-2.5 bg-zinc-900/95 text-white font-black text-[8px] px-1.5 py-0.5 rounded-md shadow-sm">
                {favoriteListings.length} عناصر
              </span>
            )}
          </div>

          {/* Folder Labels perfectly styled below grid */}
          <div className="pt-2 w-full text-right pr-0.5">
            <h3 className="text-[14px] sm:text-[15px] font-[800] text-[#111111] leading-tight">
              تمّ عرضه مؤخّرًا
            </h3>
            <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 mt-0.5">
              اليوم
            </p>
          </div>

        </motion.div>
      </div>

    </div>
  );
};
