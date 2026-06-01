import React, { useState, useRef } from 'react';
import { useApp } from './AppContext';
import { useLanguage } from './LanguageContext';
import { Listing } from '../types';
import { 
  Search, SlidersHorizontal, Star, Heart, 
  ChevronLeft, ChevronRight, Waves, Home, TreePine, 
  Award, Flame, Sparkles, Building, Trees, MapPin,
  Warehouse, Store, Map, Car, Factory, Tent,
  Camera, ChefHat, Dumbbell, Scissors, Bath, Thermometer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Unified categories
const categoryMap: Record<string, { tKey: string; icon: React.ReactNode }> = {
  trending: { tKey: 'trending', icon: <Flame className="w-5 h-5 text-rose-500" /> },
  recently_listed: { tKey: 'recently_listed', icon: <Sparkles className="w-5 h-5 text-rose-500" /> },
  algiers_hotels: { tKey: 'algiers_hotels', icon: <Building className="w-5 h-5 text-rose-500" /> },
  summer_houses: { tKey: 'summer_houses', icon: <Home className="w-5 h-5 text-rose-500" /> },
  chalets: { tKey: 'chalets', icon: <TreePine className="w-5 h-5 text-rose-500" /> },
  pools: { tKey: 'pools', icon: <Waves className="w-5 h-5 text-rose-500" /> },
  wedding_halls: { tKey: 'wedding_halls', icon: <Award className="w-5 h-5 text-rose-500" /> },
  farms: { tKey: 'farms', icon: <Trees className="w-5 h-5 text-rose-500" /> },
  warehouses: { tKey: 'warehouses', icon: <Warehouse className="w-5 h-5 text-rose-500" /> },
  shops: { tKey: 'shops', icon: <Store className="w-5 h-5 text-rose-500" /> },
  lands: { tKey: 'lands', icon: <Map className="w-5 h-5 text-rose-500" /> },
  parking: { tKey: 'parking', icon: <Car className="w-5 h-5 text-rose-500" /> },
  factories: { tKey: 'factories', icon: <Factory className="w-5 h-5 text-rose-500" /> },
  sahara: { tKey: 'sahara', icon: <Tent className="w-5 h-5 text-rose-500" /> },
  photography: { tKey: 'photography', icon: <Camera className="w-5 h-5 text-rose-500" /> },
  private_chef: { tKey: 'private_chef', icon: <ChefHat className="w-5 h-5 text-rose-500" /> },
  gym: { tKey: 'gym', icon: <Dumbbell className="w-5 h-5 text-rose-500" /> },
  womens_hair: { tKey: 'womens_hair', icon: <Scissors className="w-5 h-5 text-rose-500" /> },
  traditional_hammam: { tKey: 'traditional_hammam', icon: <Bath className="w-5 h-5 text-rose-500" /> },
  sauna: { tKey: 'sauna', icon: <Thermometer className="w-5 h-5 text-rose-500" /> },
};

const ALGERIAN_WILAYAS = [
  { id: 'All', ar: 'كل الولايات', fr: 'Toutes les Wilayas', en: 'All Provinces' },
  { id: 'Alger', ar: 'الجزائر العاصمة', fr: 'Alger', en: 'Algiers' },
  { id: 'Oran', ar: 'وهران', fr: 'Oran', en: 'Oran' },
  { id: 'Jijel', ar: 'جيجل', fr: 'Jijel', en: 'Jijel' },
  { id: 'Ghardaia', ar: 'غرداية', fr: 'Ghardaïa', en: 'Ghardaia' },
  { id: 'Tipaza', ar: 'تيبازة', fr: 'Tipaza', en: 'Tipaza' },
  { id: 'Blida', ar: 'البليدة', fr: 'Blida', en: 'Blida' },
  { id: 'Bouira', ar: 'البويرة', fr: 'Bouira', en: 'Bouira' },
];

export const ExploreTab: React.FC = () => {
  const { listings, favorites, toggleFavorite, setSelectedListing, searchTerm, setSearchTerm, selectedWilaya, setSelectedWilaya } = useApp();
  const { t, language } = useLanguage();

  const [inputSearch, setInputSearch] = useState('');
  const [guestCountFilter, setGuestCountFilter] = useState<number | 'Any'>('Any');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(60000);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'homes' | 'experiences' | 'services'>('homes');
  const [isLoading, setIsLoading] = useState(false);

  // Randomly select 3 services from the services categories
  const randomServices = React.useMemo(() => {
    const serviceCategories = ['photography', 'private_chef', 'gym', 'womens_hair', 'traditional_hammam', 'sauna'];
    let filtered = listings.filter(item => serviceCategories.includes(item.category));
    
    // Mix or shuffle them randomly
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [listings]);

  // References to slider items for smooth manual clicking controls
  const sliderRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const triggerSkeletonRefresh = (action: () => void) => {
    setIsLoading(true);
    action();
    setTimeout(() => {
      setIsLoading(false);
    }, 550);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSkeletonRefresh(() => {
      setSearchTerm(inputSearch);
      setIsSearchExpanded(false);
    });
  };

  const handleWilayaChange = (wilId: string) => {
    triggerSkeletonRefresh(() => setSelectedWilaya(wilId));
  };

  const handleGuestsChange = (val: string) => {
    triggerSkeletonRefresh(() => {
      setGuestCountFilter(val === 'Any' ? 'Any' : parseInt(val));
    });
  };

  const handlePriceChange = (val: number) => {
    triggerSkeletonRefresh(() => {
      setMaxPriceFilter(val);
    });
  };

  // Scroll individual row ref
  const scrollRow = (catId: string, direction: 'left' | 'right') => {
    const slider = sliderRefs.current[catId];
    if (slider) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getFilteredListings = (categoryName: string) => {
    return listings.filter((item) => {
      if (item.category !== categoryName) return false;
      if (selectedWilaya !== 'All' && item.wilaya !== selectedWilaya) return false;
      if (searchTerm) {
        const text = searchTerm.toLowerCase();
        const titleMatch = item.title[language]?.toLowerCase().includes(text);
        const locMatch = item.location[language]?.toLowerCase().includes(text);
        const wilMatch = item.wilaya.toLowerCase().includes(text);
        if (!titleMatch && !locMatch && !wilMatch) return false;
      }
      if (guestCountFilter !== 'Any' && item.guests < guestCountFilter) return false;
      if (item.pricePerNight > maxPriceFilter) return false;
      return true;
    });
  };

  // Categories partition based on Top Navigation tabs
  const getCategoriesForMainTab = () => {
    switch (activeMainTab) {
      case 'homes':
        return [
          'recently_listed',
          'trending',
          'algiers_hotels',
          'summer_houses',
          'chalets',
          'pools',
          'wedding_halls',
          'find_services_mid',
          'farms',
          'warehouses',
          'shops',
          'lands',
          'parking',
          'factories',
          'sahara'
        ];
      case 'experiences':
        return ['pools', 'farms', 'sahara'];
      case 'services':
        return [
          'photography',
          'private_chef',
          'gym',
          'womens_hair',
          'traditional_hammam',
          'sauna'
        ];
      default:
        return [
          'recently_listed',
          'trending',
          'algiers_hotels',
          'summer_houses',
          'chalets',
          'pools',
          'wedding_halls',
          'find_services_mid',
          'farms',
          'warehouses',
          'shops',
          'lands',
          'parking',
          'factories',
          'sahara'
        ];
    }
  };

  // Header texts based on tab
  const getSubTitleForCategory = (catId: string) => {
    if (catId === 'find_services_mid') {
      return 'تصفح باقة مختارة من أرقى الخدمات المحلية المتاحة للحجز الآن';
    }
    if (catId === 'algiers_hotels') {
      return 'مجموعة من الفنادق المستقلة والمختارة بعناية';
    }
    if (catId === 'trending') {
      return 'العقارات المفضلة والأعلى تقييماً في الجزائر خلال هذا الأسبوع';
    }
    if (catId === 'photography') {
      return 'مصورون محليون ومحترفون لتغطية حفلاتكم ومناسباتكم الخاصة';
    }
    if (catId === 'private_chef') {
      return 'طهاة محترفون لتجربة طعام فاخرة في بيوتكم أو مناسباتكم';
    }
    if (catId === 'gym') {
      return 'حصص تدريبية وصالات مجهزة بأحدث آلات اللياقة البدنية';
    }
    if (catId === 'womens_hair') {
      return 'صالونات حلاقة وتزيين نسائية خبيرة لتألقك في كل الأوقات';
    }
    if (catId === 'traditional_hammam') {
      return 'استمتع بحمام بخار تقليدي جزائري للاسترخاء وإزالة السموم';
    }
    if (catId === 'sauna') {
      return 'جلسات سونا استرخائية وغرف بخار لتجديد الطاقة والنشاط';
    }
    return '';
  };

  const SkeletonShelfLoader = () => (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none">
      {[1, 2, 3].map((index) => (
        <div 
          key={index}
          className="min-w-[200px] max-w-[210px] bg-white rounded-3xl p-3 border border-zinc-100 space-y-3 shadow-xs"
        >
          <div className="aspect-[4/3] rounded-2xl skeleton-shimmer w-full" />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 w-1/3 rounded-lg skeleton-shimmer" />
              <div className="h-3 w-10 rounded-lg skeleton-shimmer" />
            </div>
            <div className="h-4.5 w-5/6 rounded-lg skeleton-shimmer" />
            <div className="h-3 w-1/2 rounded-lg skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );

  const categoriesToShow = getCategoriesForMainTab();

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-6 space-y-5 bg-white text-zinc-900 animate-page-in" id="explore-tab-container" dir="rtl">
      
      {/* 1. SEAMLESS CLEAN WHITE TOP NAVBAR WITH EMBEDDED SEARCH PILL */}
      <div className="bg-white pt-2 pb-1 border-b border-zinc-100/60">
        <div className="space-y-4">
          
          {/* Precise Mockup Search Pill Box */}
          <div className="relative cursor-text">
            <div className="relative w-full bg-[#f4f4f4] hover:bg-[#eaeaea] focus-within:bg-zinc-50 border border-transparent focus-within:border-zinc-200/50 focus-within:shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all rounded-full h-11 flex items-center justify-center gap-2 px-4">
              <Search className="w-4 h-4 text-zinc-800 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بدء البحث"
                className="bg-transparent text-[12.5px] font-[800] text-zinc-900 placeholder-zinc-805 text-right outline-none w-32 focus:w-44 transition-all"
                id="simple-search-input"
                dir="rtl"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute left-4 text-[10px] font-black text-zinc-400 hover:text-zinc-650 transition"
                  title="مسح"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Top category/tab filter: "البيوت" - "تجارب السفر" - "الخدمات" matching mockup style with thick black bottom line */}
          <div className="flex justify-center items-center gap-6 pt-1 pb-0 max-w-xs mx-auto">
            <button
              onClick={() => setActiveMainTab('homes')}
              className={`pb-2.5 text-[11px] font-[800] relative transition-colors cursor-pointer ${
                activeMainTab === 'homes' 
                  ? 'text-zinc-900 font-extrabold' 
                  : 'text-zinc-400 hover:text-zinc-650'
              }`}
              id="top-tab-homes"
            >
              <span>البيوت</span>
              {activeMainTab === 'homes' && (
                <motion.div 
                  layoutId="mainTabIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-950 rounded-full" 
                />
              )}
            </button>
            <button
              onClick={() => setActiveMainTab('experiences')}
              className={`pb-2.5 text-[11px] font-[800] relative transition-colors cursor-pointer ${
                activeMainTab === 'experiences' 
                  ? 'text-zinc-900 font-extrabold' 
                  : 'text-zinc-400 hover:text-zinc-650'
              }`}
              id="top-tab-experiences"
            >
              <span>تجارب السفر</span>
              {activeMainTab === 'experiences' && (
                <motion.div 
                  layoutId="mainTabIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-950 rounded-full" 
                />
              )}
            </button>
            <button
              onClick={() => setActiveMainTab('services')}
              className={`pb-2.5 text-[11px] font-[800] relative transition-colors cursor-pointer ${
                activeMainTab === 'services' 
                  ? 'text-zinc-900 font-extrabold' 
                  : 'text-zinc-400 hover:text-zinc-650'
              }`}
              id="top-tab-services"
            >
              <span>الخدمات</span>
              {activeMainTab === 'services' && (
                <motion.div 
                  layoutId="mainTabIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-950 rounded-full" 
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC SLIDING SEGMENTS WITH PRECISE REAL ARROW NAVIGATION */}
      <div className="space-y-8 mt-3">
        {categoriesToShow.map((catId) => {
          const categoryListings = catId === 'find_services_mid' ? randomServices : getFilteredListings(catId);
          const hasSubtitle = getSubTitleForCategory(catId);

          return (
            <div key={catId} className="space-y-4" id={`explore-category-${catId}`}>
              
              {/* Category Segment Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                
                {/* Text titles with clean subtitles */}
                <div className="space-y-0.5 overflow-hidden pr-2 text-right flex-1">
                  <h2 className="text-base font-black text-zinc-900 leading-tight">
                    {catId === 'find_services_mid' 
                      ? 'العثور على خدمات متاحة' 
                      : t(catId === 'algiers_hotels' ? 'algiers_hotels' : (catId === 'trending' ? 'trending' : categoryMap[catId].tKey))}
                  </h2>
                  {hasSubtitle && (
                    <p className="text-[10px] font-bold text-zinc-400 truncate leading-relaxed">
                      {hasSubtitle}
                    </p>
                  )}
                </div>

                {/* Left single Arrow button matching mockup */}
                <div className="flex items-center gap-1.5 shrink-0 pl-1">
                  <button
                    onClick={() => scrollRow(catId, 'left')}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 p-1.5 rounded-full transition-all active:scale-95 cursor-pointer flex items-center justify-center w-7 h-7"
                    title="السابق"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-zinc-800" />
                  </button>
                </div>
              </div>

              {/* Loader or Content */}
              {isLoading ? (
                <SkeletonShelfLoader />
              ) : categoryListings.length === 0 ? (
                <div className="bg-zinc-50 rounded-[2rem] py-14 text-center text-zinc-400 border border-dashed border-zinc-200 text-xs font-bold">
                  لا توجد عقارات متطابقة حالياً. جرب توسيع معايير فلاتر السعر أو الولاية.
                </div>
              ) : (catId === 'find_services_mid' || catId === 'recently_listed') ? (
                <div 
                  ref={(el) => { sliderRefs.current[catId] = el; }}
                  className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar scroll-smooth"
                >
                  {categoryListings.map((listing) => {
                    const isFav = favorites.includes(listing.id);

                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        key={listing.id}
                        onClick={() => setSelectedListing(listing)}
                        className="group w-[112px] min-w-[112px] sm:w-[124px] sm:min-w-[124px] bg-white snap-start shrink-0 overflow-hidden cursor-pointer flex flex-col justify-between haptic-tap"
                        id={`listing-card-mini-${listing.id}`}
                      >
                        
                        {/* Smaller card, square image */}
                        <div className="relative aspect-square rounded-[1.2rem] overflow-hidden bg-zinc-50 border border-zinc-100/60 shadow-xs">
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title[language]}
                            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
                          
                          {/* Mini wish heart */}
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(listing.id);
                            }}
                            className="absolute top-1.5 left-1.5 z-10 bg-transparent text-white hover:scale-110 active:scale-95 transition-all outline-none"
                          >
                            <Heart className={`w-3.5 h-3.5 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.55)] ${isFav ? 'fill-[#ff385c] text-[#ff385c] stroke-white' : 'text-white stroke-white'}`} strokeWidth={2.5} />
                          </button>

                          {/* Mini rating to fit beautifully */}
                          <div className="absolute top-1.5 right-1.5 z-10 bg-white/95 text-zinc-900 font-extrabold text-[7.5px] py-0.5 px-1.5 rounded-full shadow-xs border border-zinc-100 flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <span>{listing.rating}</span>
                          </div>
                        </div>

                        {/* Text descriptions below the image with direct clear name */}
                        <div className="pt-1.5 px-0.5 text-right">
                          <h3 className="font-extrabold text-[#111111] text-[10.5px] leading-tight truncate">
                            {listing.title[language]}
                          </h3>
                          <p className="text-zinc-550 text-[9px] font-bold mt-0.5">
                            <span className="text-zinc-900 font-extrabold text-[11px]">
                              {listing.pricePerNight.toLocaleString()} دج
                            </span>
                          </p>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div 
                  ref={(el) => { sliderRefs.current[catId] = el; }}
                  className="flex gap-3.5 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar scroll-smooth"
                >
                  {categoryListings.map((listing) => {
                    const isFav = favorites.includes(listing.id);

                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.2 }}
                        key={listing.id}
                        onClick={() => setSelectedListing(listing)}
                        className="group w-[210px] min-w-[210px] bg-white snap-start shrink-0 overflow-hidden cursor-pointer flex flex-col justify-between haptic-tap"
                        id={`listing-card-${listing.id}`}
                      >
                        
                        {/* Image Container with precise rounded borders matching the screenshot */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100/60 shadow-xs">
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title[language]}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                          
                          {/* Wishlist Heart on Top-Left corner exactly as shown in the mockup */}
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(listing.id);
                            }}
                            className="absolute top-2 left-2 z-10 bg-transparent text-white hover:scale-110 active:scale-95 transition-all outline-none"
                          >
                            <Heart className={`w-4 h-4 drop-shadow-[0_2px_4.5px_rgba(0,0,0,0.55)] ${isFav ? 'fill-[#ff385c] text-[#ff385c] stroke-white' : 'text-white stroke-white'}`} strokeWidth={2.5} />
                          </button>

                          {/* "مفضّل لدى الضيوف" badge overlay - precisely replicated on Top-Right corner */}
                          {listing.rating >= 4.75 && (
                            <div className="absolute top-2 right-2 z-10 bg-white text-zinc-900 font-extrabold text-[8.5px] py-0.5 px-2.5 rounded-full shadow-md border border-zinc-100">
                              مفضّل لدى الضيوف
                            </div>
                          )}
                        </div>

                        {/* Text descriptions below the image exactly as shown in the picture */}
                        <div className="pt-1.5 px-0.5 space-y-0.5 flex-grow flex flex-col justify-between text-right">
                          <div className="space-y-0.5">
                            
                            {/* Line 1: Type / Stay Detail with bold black/charcoal text */}
                            <h3 className="font-extrabold text-[#111111] text-[12px] leading-tight truncate">
                              مكان للإقامة في {listing.location[language]}
                            </h3>

                            {/* Line 2: Price and rating info formatted perfectly on one line with nice bullets */}
                            <p className="text-zinc-550 text-[10.5px] font-bold flex items-center justify-start gap-1 flex-wrap">
                              <span className="text-zinc-900 font-extrabold text-[12px]">
                                {listing.pricePerNight.toLocaleString()} دج
                              </span>
                              <span>مقابل ليلة</span>
                              <span className="text-zinc-305 px-0.5">•</span>
                              <span className="flex items-center gap-0.5 font-extrabold text-[#111111]">
                                <span>{listing.rating}</span>
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                              </span>
                            </p>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
