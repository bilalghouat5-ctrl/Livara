import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ArrowRight, Search, Star, MessageSquare, ChevronDown, CheckCircle2, 
  Sparkles, Filter, ShieldCheck, HelpCircle, Award
} from 'lucide-react';
import { playHapticSound } from './InteractionShowcase';
import { Listing, Review } from '../types';

interface AllReviewsPageProps {
  listing: Listing;
  onClose: () => void;
  language: 'ar' | 'fr' | 'en' | 'kab';
}

const getlaurelsSVG = () => (
  <svg className="w-12 h-12 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 3a1 1 0 0 1 .117 1.993L6 5c-.173 0-.341.018-.501.052A3.5 3.5 0 0 0 3.1 7.21a4.464 4.464 0 0 0-.094 1.408c0 .265.02.527.058.784a1 1 0 1 1-1.972.296A6.47 6.47 0 0 1 1 8.618c0-.66.096-1.303.279-1.916a5.5 5.5 0 0 1 4.22-3.649C5.66 3.018 5.83 3 6 3zm12 0c.17 0 .34.018.501.053a5.5 5.5 0 0 1 4.22 3.65c.183.612.279 1.255.279 1.915a6.47 6.47 0 0 1-.086 1.082 1 1 0 1 1-1.972-.296c.038-.257.058-.52.058-.784a4.464 4.464 0 0 0-.094-1.409 3.5 3.5 0 0 0-2.399-2.157c-.16-.034-.328-.052-.501-.052a1 1 0 0 1-.117-1.993L18 3zM6 9a1 1 0 0 1 .117 1.993L6 11c-.173 0-.341.018-.501.052a3.5 3.5 0 0 0-2.399 2.158 4.464 4.464 0 0 0-.094 1.408c0 .265.02.527.058.784a1 1 0 0 1-1.972.296A6.47 6.47 0 0 1 1 14.618c0-.66.096-1.303.279-1.916a5.5 5.5 0 0 1 4.22-3.65c.16-.034.328-.052.501-.052zm12 0c.17 0 .34.018.501.053a5.5 5.5 0 0 1 4.22 3.65c.183.612.279 1.255.279 1.915a6.47 6.47 0 0 1-.086 1.082 1 1 0 1 1-1.972-.296a4.464 4.464 0 0 0 .058-.784c0-.49-.033-.96-.094-1.409a3.5 3.5 0 0 0-2.399-2.157c-.16-.034-.328-.052-.501-.052a1 1 0 0 1-.117-1.993L18 9zM6 15a1 1 0 0 1 .117 1.993L6 17c-.173 0-.341.018-.501.052a3.5 3.5 0 0 0-2.399 2.158c-.04.162-.072.33-.094.502a1 1 0 0 1-1.983-.243 5.485 5.485 0 0 1 .279-1.347 5.5 5.5 0 0 1 4.22-3.65c.16-.034.328-.052.501-.052zm12 0c.17 0 .34.018.501.053a5.5 5.5 0 0 1 4.22 3.65c.08.267.143.542.185.823a1 1 0 0 1-1.98.267 3.5 3.5 0 0 0-.098-.584 3.5 3.5 0 0 0-2.399-2.157c-.16-.034-.328-.052-.501-.052a1 1 0 0 1-.117-1.993L18 15zm-6 2a1 1 0 0 1 .993.883L13 18v2a1 1 0 0 1-1.993.117L11 20v-2a1 1 0 0 1 1-1z"/>
  </svg>
);

const getlaurelsLeftSVG = () => (
  <svg className="w-12 h-12 text-amber-500 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 3a1 1 0 0 1 .117 1.993L6 5c-.173 0-.341.018-.501.052A3.5 3.5 0 0 0 3.1 7.21a4.464 4.464 0 0 0-.094 1.408c0 .265.02.527.058.784a1 1 0 1 1-1.972.296A6.47 6.47 0 0 1 1 8.618c0-.66.096-1.303.279-1.916a5.5 5.5 0 0 1 4.22-3.649C5.66 3.018 5.83 3 6 3zm12 0c.17 0 .34.018.501.053a5.5 5.5 0 0 1 4.22 3.65c.183.612.279 1.255.279 1.915a6.47 6.47 0 0 1-.086 1.082 1 1 0 1 1-1.972-.296c.038-.257.058-.52.058-.784a4.464 4.464 0 0 0-.094-1.409 3.5 3.5 0 0 0-2.399-2.157c-.16-.034-.328-.052-.501-.052a1 1 0 0 1-.117-1.993L18 3zM6 9a1 1 0 0 1 .117 1.993L6 11c-.173 0-.341.018-.501.052a3.5 3.5 0 0 0-2.399 2.158 4.464 4.464 0 0 0-.094 1.408c0 .265.02.527.058.784a1 1 0 0 1-1.972.296A6.47 6.47 0 0 1 1 14.618c0-.66.096-1.303.279-1.916a5.5 5.5 0 0 1 4.22-3.65c.16-.034.328-.052.501-.052zm12 0c.17 0 .34.018.501.053a5.5 5.5 0 0 1 4.22 3.65c.183.612.279 1.255.279 1.915a6.47 6.47 0 0 1-.086 1.082 1 1 0 1 1-1.972-.296a4.464 4.464 0 0 0 .058-.784c0-.49-.033-.96-.094-1.409a3.5 3.5 0 0 0-2.399-2.157c-.16-.034-.328-.052-.501-.052a1 1 0 0 1-.117-1.993L18 9zM6 15a1 1 0 0 1 .117 1.993L6 17c-.173 0-.341.018-.501.052a3.5 3.5 0 0 0-2.399 2.158c-.04.162-.072.33-.094.502a1 1 0 0 1-1.983-.243 5.485 5.485 0 0 1 .279-1.347 5.5 5.5 0 0 1 4.22-3.65c.16-.034.328-.052.501-.052zm12 0c.17 0 .34.018.501.053a5.5 5.5 0 0 1 4.22 3.65c.08.267.143.542.185.823a1 1 0 0 1-1.98.267 3.5 3.5 0 0 0-.098-.584 3.5 3.5 0 0 0-2.399-2.157c-.16-.034-.328-.052-.501-.052a1 1 0 0 1-.117-1.993L18 15zm-6 2a1 1 0 0 1 .993.883L13 18v2a1 1 0 0 1-1.993.117L11 20v-2a1 1 0 0 1 1-1z"/>
  </svg>
);

// Dynamic reviews lists to match the desired count beautifully if fewer are provided
const ARABIC_MOCK_NAMES = [
  'مهدي بومدين', 'أمينة كواشي', 'رياض محرز', 'سارة بن عودة', 'يوسف بوزيد', 
  'صوفيا بلحاج', 'خالد ميسوم', 'كمال بن يحيى', 'ليلى حداد', 'إلياس غربي',
  'أنيس بوشارب', 'نادية قادري', 'مروان زروقي', 'أسماء بن جيلالي', 'عمر بلعيد'
];

const ARABIC_MOCK_BADGES = [
  '8 سنوات على Airbnb', '5 سنوات على Airbnb', 'سنتان على Airbnb', 
  '3 سنوات على Airbnb', 'سنة واحدة على Airbnb', 'مستكشف نشط بـ 15 حجزًا'
];

const ARABIC_MOCK_COMMENTS = [
  'إقامة مسلية ومريحة للغاية، المضيف في قمة الكرم والترحاب وتواصله سريع جداً. أنصح به بشدة لكل عائلة تبحث عن الهدوء والراحة في الجزائر.',
  'الفيلا رائعة جداً ونظيفة ومجهزة بدقة متناهية، المسبح خاص ومعقم تماماً والأثاث فاخر ومريح للنوم وسهرة الشواء كانت مذهلة.',
  'تجربة فريدة من نوعها! الشاليه رائع والتدفئة المركزية ممتازة وسط الثلوج وموقد الحطب التقليدي يضيف لمسة دافئة للمكان والكل مسرور.',
  'الموقع في قمة الأمان والهدوء، الإطلالة الصباحية على البحر لا تقدر بثمن والقهوة في الشرفة كانت رائعة. سنكرر الزيارة بالتأكيد.',
  'كل شيء كان مثالياً ونظيفاً جداً، حسن الضيافة الجزائرية الأصيلة تجلى في كل التفاصيل من ترحيب إلى تقديم التمر والحليب الطبيعي عند الوصول.',
  'مكان ممتاز وموقعه استراتيجي للغاية وقريب من كل المرافق والخدمات. الشقة واسعة ومجهزة بإنترنت سريع جداً ومواقف سيارات آمنة.',
  'لا يسعني أن أشكر المضيف بما فيه الكفاية على كرم ضيافته وحسن معاملته الفاخرة. شقته جميلة ومجهزة بالكامل والخصوصية مضمونة.',
  'من أفضل أماكن الإقامة التي زرتها في الجزائر، نظافة لا تضاهى وتجاوب فوري مع أي استفسار وتصميم الشاليه مميز وجذاب ومريح.',
  'الشقة مريحة ونظيفة للغاية، السرير مريح جداً ونظام التكييف ممتاز والمطبخ مجهز بجميع المستلزمات والأطباق التقليدية الرائعة.',
  'مكان هادئ وجميل جداً ومناسب للاسترخاء والابتعاد عن صخب المدينة، والتعامل مع المضيف كان ممتاز وسلس للغاية.'
];

const ARABIC_MOCK_DATES = [
  'اليوم', 'أمس', 'قبل يومين', 'الأسبوع الماضي', 'مايو 2026', 'أبريل 2026', 'مارس 2026', 'فبراير 2026'
];

export const AllReviewsPage: React.FC<AllReviewsPageProps> = ({ 
  listing, 
  onClose,
  language 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevant' | 'newest'>('relevant');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // Generate complete list of reviews matching exact listing.reviewsCount
  const allReviews = useMemo(() => {
    const list = [...listing.reviews];
    
    // Add realistic placeholder reviews if needed to reach target reviewsCount
    const targetCount = Math.max(listing.reviewsCount, list.length);
    let idCounter = list.length + 1;

    while (list.length < targetCount && list.length < 50) {
      const seed = list.length;
      const rating = 5 - (seed % 2 === 0 ? 0 : (seed % 5 === 0 ? 1 : 0));
      
      const newReview: Review = {
        id: `gen_rev_${listing.id}_${idCounter++}`,
        userName: ARABIC_MOCK_NAMES[seed % ARABIC_MOCK_NAMES.length],
        userAvatar: `https://images.unsplash.com/photo-${1500000000000 + (seed * 850000)}?auto=format&fit=crop&w=100&h=100&q=85`,
        rating,
        date: ARABIC_MOCK_DATES[seed % ARABIC_MOCK_DATES.length],
        comment: {
          ar: ARABIC_MOCK_COMMENTS[seed % ARABIC_MOCK_COMMENTS.length],
          en: `Exceptional luxurious experience. Highly clean, quiet location with pristine modern tools and a great host! Will definitely book again.`,
          fr: `Séjour absolument merveilleux et très reposant. Logement propre, sécuritaire et un accueil très chaleureux. Recommandé fortement !`,
          kab: `Abrid amezwaru d ameqran! Kullu d ayen ilhan, tagnit teṣfa d tajmict n ufrag d tasebḥit tacebḥant.`
        }
      };
      list.push(newReview);
    }
    return list;
  }, [listing]);

  // Handle Search and Filter logic
  const filteredAndSortedReviews = useMemo(() => {
    let result = allReviews.filter((rev) => {
      const commentText = (rev.comment[language] || rev.comment['ar'] || '').toLowerCase();
      const userName = rev.userName.toLowerCase();
      return commentText.includes(searchQuery.toLowerCase()) || userName.includes(searchQuery.toLowerCase());
    });

    if (sortBy === 'newest') {
      // Prioritize "اليوم" and "أمس" first in dynamic items
      result = [...result].sort((a, b) => {
        const priority = (dateStr: string) => {
          if (dateStr === 'اليوم') return 3;
          if (dateStr === 'أمس') return 2;
          if (dateStr.includes('يوم')) return 1;
          return 0;
        };
        return priority(b.date) - priority(a.date);
      });
    }

    return result;
  }, [allReviews, searchQuery, sortBy, language]);

  const toggleExpandComment = (id: string) => {
    playHapticSound('tap');
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const roundedGlobalRating = Number(listing.rating || 5.0).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col text-zinc-900 overflow-hidden" dir="rtl">
      
      {/* 2.4.1. UPPER STICKY NAVIGATION CONTROLS */}
      <div className="bg-white border-b border-zinc-100 px-5 pt-8 pb-4 flex items-center justify-between shrink-0 select-none">
        
        {/* Back Arrow button styled exactly like Screenshot 1 & 2 */}
        <button
          onClick={() => {
            playHapticSound('tap');
            onClose();
          }}
          className="w-10 h-10 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center transition-all cursor-pointer active:scale-95 text-zinc-900"
          type="button"
        >
          <ArrowRight className="w-5 h-5 stroke-[2.3] text-zinc-950" />
        </button>

        <h1 className="text-base font-black text-zinc-950">تقييمات الضيوف</h1>

        {/* Dummy placeholder matching upper right balance spacing alignment */}
        <div className="w-10 h-10" />
      </div>

      {/* 2.4.2. SCROLLABLE REVIEW PANEL CONTENT */}
      <div className="flex-1 overflow-y-auto pb-24 px-5 sm:px-6">
        
        {/* LAURELS & OVERALL GUEST FAVORITE BADGE CONTAINER - MATCHES SCREENSHOT 2 EXACTLY */}
        <div className="py-8 flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
          
          {/* Large laurel rating cluster */}
          <div className="flex items-center justify-center gap-1.5 select-none">
            {getlaurelsLeftSVG()}
            <span className="text-6.5xl font-sans font-black tracking-tighter text-zinc-950 antialiased leading-none">
              {roundedGlobalRating}
            </span>
            {getlaurelsSVG()}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-zinc-950">مفضّل لدى الضيوف</h2>
            
            <p className="text-xs text-zinc-500 font-bold max-w-xs leading-relaxed">
              هذا المسكن من أفضل 10% من المساكن المؤهلة، استنادًا إلى التقييمات والمراجعات وبيانات الموثوقية
            </p>
          </div>

          <button 
            type="button"
            onClick={() => playHapticSound('success')}
            className="text-[11px] font-black text-zinc-950 underline hover:text-zinc-700 decoration-zinc-950/40"
          >
            آلية عمل التقييمات
          </button>

          {/* METRICS RATING STATS GRID - MATCHES SCREENSHOT 2 */}
          <div className="w-full grid grid-cols-3 gap-1 border-t border-b border-zinc-100 py-6 mt-4 select-none">
            
            {/* Column 1: General Rating */}
            <div className="flex flex-col items-center justify-between text-center px-1 border-l border-zinc-100 h-28">
              <span className="text-[10px] font-bold text-zinc-500">التقييم العام</span>
              <div className="w-full flex flex-col items-center space-y-1.5 py-1">
                <span className="text-base font-black text-zinc-950">5.0</span>
                {/* Visual bar mini chart */}
                <div className="w-11 space-y-0.5">
                  <div className="h-0.5 w-full bg-zinc-950 rounded-full" />
                  <div className="h-0.5 w-2/3 bg-zinc-200 rounded-full" />
                  <div className="h-0.5 w-1/3 bg-zinc-200 rounded-full" />
                  <div className="h-0.5 w-0 bg-zinc-200 rounded-full" />
                  <div className="h-0.5 w-0 bg-zinc-200 rounded-full" />
                </div>
              </div>
              <span className="text-[9px] font-bold text-zinc-400">1 لـ 5 نجوم</span>
            </div>

            {/* Column 2: Cleanliness */}
            <div className="flex flex-col items-center justify-between text-center px-1 border-l border-zinc-100 h-28">
              <span className="text-[10px] font-bold text-zinc-500">النظافة</span>
              <div className="flex flex-col items-center space-y-1 py-1">
                <span className="text-base font-black text-zinc-950">5.0</span>
                <Sparkles className="w-4.5 h-4.5 text-zinc-950 stroke-[2.3]" />
              </div>
              <span className="text-[9px] font-bold text-zinc-400">مثالية وعالية</span>
            </div>

            {/* Column 3: Accuracy */}
            <div className="flex flex-col items-center justify-between text-center px-1 h-28">
              <span className="text-[10px] font-bold text-zinc-500">الدقة</span>
              <div className="flex flex-col items-center space-y-1 py-1">
                <span className="text-base font-black text-zinc-950">5.0</span>
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-650 stroke-[2.3]" />
              </div>
              <span className="text-[9px] font-bold text-zinc-400">متطابقة وموثوقة</span>
            </div>

          </div>

        </div>

        {/* 2.4.3. REVIEWS INTERFACE CONTROLS & SEARCH ROWS */}
        <div className="max-w-xl mx-auto space-y-5 mt-1">
          
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-sm font-black text-zinc-950">
              تقييمات الضيوف ({listing.reviewsCount} تقييمًا)
            </h3>
            
            <button
              onClick={() => {
                playHapticSound('tap');
                setSortBy(prev => prev === 'relevant' ? 'newest' : 'relevant');
              }}
              className="flex items-center gap-1.5 text-xs font-black text-zinc-950 border border-zinc-200/80 px-3 py-1.5 rounded-full hover:bg-zinc-50 transition active:scale-95"
              type="button"
            >
              <span>{sortBy === 'relevant' ? 'الأكثر صلة' : 'الأحدث'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search box row with elegant absolute magnifying glass */}
          <div className="relative">
            <Search className="w-4.5 h-4.5 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في آراء وتعليقات النزلاء السابقين..."
              className="w-full pl-4 pr-11 py-3 text-xs bg-zinc-50 hover:bg-zinc-100/60 focus:bg-white text-zinc-900 border border-zinc-200/50 focus:border-zinc-350 focus:ring-1 focus:ring-zinc-250 rounded-2xl outline-none transition font-semibold text-right"
              dir="rtl"
            />
          </div>

          {/* Summary status text of currently filtered results */}
          <div className="flex justify-between items-center text-[10.5px] font-bold text-zinc-400">
            <span>عرض {filteredAndSortedReviews.length} من أصل {allReviews.length}</span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-rose-500 underline"
              >
                مسح البحث الحالي
              </button>
            )}
          </div>

          {/* Empty state if nothing matches query */}
          {filteredAndSortedReviews.length === 0 && (
            <div className="text-center py-10 bg-zinc-50 rounded-2.5xl border border-dashed border-zinc-200 space-y-2 select-none">
              <MessageSquare className="w-8 h-8 text-zinc-350 mx-auto" />
              <p className="text-zinc-500 font-extrabold text-xs">لا توجد نتائج مطابقة لبحثك</p>
              <p className="text-[10px] text-zinc-400">جرب كتابة كلمات بديلة مثل "نظيف"، "مريح"، "مسبح"</p>
            </div>
          )}

          {/* 2.4.4. REVIEWS GRID OR SCROLLABLE STACK FRAME */}
          <div className="space-y-6 pt-2">
            {filteredAndSortedReviews.map((review, idx) => {
              const isExpanded = expandedComments[review.id];
              const commentText = review.comment[language] || review.comment['ar'] || '';
              const shouldTruncate = commentText.length > 140;

              return (
                <div 
                  key={review.id}
                  className="bg-white border-b border-zinc-100 pb-6 text-right space-y-3.5 transition-all w-full"
                >
                  {/* Reviewer Details Row with Custom active badge "8 سنوات على Airbnb" */}
                  <div className="flex items-center gap-3 justify-start" dir="rtl">
                    <img 
                      src={review.userAvatar} 
                      alt={review.userName}
                      className="w-11 h-11 rounded-full object-cover border border-zinc-200 ring-2 ring-zinc-50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-right">
                      <h4 className="font-extrabold text-zinc-950 text-sm">
                        {review.userName}
                      </h4>
                      <p className="text-zinc-500 text-[10.5px] font-bold">
                        {ARABIC_MOCK_BADGES[idx % ARABIC_MOCK_BADGES.length]}
                      </p>
                    </div>
                  </div>

                  {/* Stars list + Relative Time indicator row */}
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-0.5 text-zinc-900">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star 
                          key={starIdx} 
                          className={`w-3.5 h-3.5 ${starIdx < review.rating ? 'fill-zinc-950 text-zinc-950' : 'text-zinc-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10.5px] font-black text-zinc-550">
                      • {review.date}
                    </span>
                  </div>

                  {/* Review comment node */}
                  <div className="text-zinc-800 text-[12.5px] font-bold leading-relaxed pr-1 font-sans">
                    <p>
                      {isExpanded || !shouldTruncate 
                        ? commentText 
                        : `${commentText.substring(0, 137)}...`}
                    </p>

                    {shouldTruncate && (
                      <button
                        type="button"
                        onClick={() => toggleExpandComment(review.id)}
                        className="text-xs font-black text-zinc-950 underline mt-2 block hover:text-zinc-700 decoration-zinc-950/30 cursor-pointer"
                      >
                        {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
