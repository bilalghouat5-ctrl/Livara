import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Gem, Languages, Star, ChevronRight } from 'lucide-react';
import { Listing } from '../types';

interface BookingReviewPageProps {
  onClose: () => void;
  listing: Listing;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  total: number;
  getArabicDateRange: () => string;
  onConfirm: () => void;
}

export const BookingReviewPage: React.FC<BookingReviewPageProps> = ({
  onClose,
  listing,
  checkIn,
  checkOut,
  guestCount,
  total,
  getArabicDateRange,
  onConfirm,
}) => {
  const [paymentChoice, setPaymentChoice] = useState<'now' | 'later'>('now');

  // Helper to calculate cancellation date (3 days before check-in)
  const getArabicCancellationDate = () => {
    try {
      const monthsAr = [
        'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 
        'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      const start = new Date(checkIn);
      if (isNaN(start.getTime())) {
        return '12 جوان';
      }
      start.setDate(start.getDate() - 3);
      const day = start.getDate();
      const monthIndex = start.getMonth();
      return `${day} ${monthsAr[monthIndex]}`;
    } catch (e) {
      return '12 جوان';
    }
  };

  // Helper to calculate payment date (8 days before check-in or fixed representative date)
  const getArabicPaymentDate = () => {
    try {
      const monthsAr = [
        'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 
        'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      const start = new Date(checkIn);
      if (isNaN(start.getTime())) {
        return '22 سبتمبر';
      }
      start.setDate(start.getDate() - 8);
      const day = start.getDate();
      const monthIndex = start.getMonth();
      return `${day} ${monthsAr[monthIndex]}`;
    } catch (e) {
      return '22 سبتمبر';
    }
  };

  // Convert price to approx USD for accurate mockup representation as shown in screenshot
  const usdPrice = (total / 185).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute inset-0 bg-white z-50 overflow-y-auto pb-32 flex flex-col text-right scrollbar-none rounded-none"
      dir="rtl"
    >
      {/* Sticky Header with 'X' button on the left to match image 1 perfectly */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 border-b border-zinc-100 px-6 py-4 flex items-center justify-between select-none">
        <button 
          onClick={onClose}
          type="button"
          className="text-zinc-950 hover:bg-zinc-50 p-2 rounded-full transition-all cursor-pointer active:scale-95 flex items-center justify-center"
          id="review-close-btn"
        >
          <X className="w-5.5 h-5.5 stroke-[2.2]" />
        </button>
        <span className="text-[13.5px] font-black text-zinc-900 absolute left-1/2 -translate-x-1/2 sm:opacity-100 opacity-0 transition-opacity">
          المراجعة والمتابعة
        </span>
        <div className="w-8"></div> {/* Spacer for balancing centered text */}
      </div>

      {/* Main Container */}
      <div className="px-6 py-5 max-w-xl mx-auto w-full space-y-6 select-none" dir="rtl">
        
        {/* Page Large Heading */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 pr-0.5 leading-tight tracking-tight">
            المراجعة والمتابعة
          </h1>
        </div>

        {/* Listing Summary Card with Rounded corners, image on right and info on left */}
        <div className="flex items-center justify-between gap-4 p-1.5 rounded-2xl bg-white">
          {/* Info Details (Left side in RTL) */}
          <div className="flex-1 space-y-1.5 text-right">
            <div className="flex items-start gap-1 justify-start">
              <Languages className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
              <h3 className="text-[13.5px] sm:text-[14.5px] font-extrabold text-zinc-905 leading-snug">
                {listing.title.ar}
              </h3>
            </div>
            
            {/* Rating and guest favorite text */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-600 mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{listing.rating.toFixed(2)}</span>
              <span>({listing.reviewsCount})</span>
              <span className="text-zinc-300 mx-0.5">·</span>
              <span className="text-zinc-650">مفضّل لدى الضيوف</span>
            </div>
          </div>

          {/* Clean Property Thumbnail Image (Right side in RTL) */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden shadow-xs border border-zinc-100">
            <img 
              src={listing.images[0]} 
              alt={listing.title.ar}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Bordered box containing Reservation options matching Image 1 */}
        <div className="border border-zinc-200/90 rounded-[24px] p-5.5 space-y-5 bg-white shadow-xs">
          
          {/* Row 1: التواريخ */}
          <div className="flex items-start justify-between pb-4.5 border-b border-zinc-100">
            <div className="space-y-1 text-right">
              <h4 className="text-[13.5px] font-black text-zinc-900">
                التواريخ
              </h4>
              <p className="text-[12px] text-zinc-600 font-bold">
                {getArabicDateRange()}
              </p>
              
              {/* Rare gem notification banner as displayed in screenshot */}
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#e61e4d] mt-2.5">
                <Gem className="w-4 h-4 text-[#ff385c]" />
                <span>فرصة نادرة</span>
              </div>
            </div>
            <button 
              type="button"
              className="text-[12px] font-black text-zinc-900 underline underline-offset-3 hover:text-rose-600 cursor-pointer active:scale-95 transition-all"
            >
              تغيير
            </button>
          </div>

          {/* Row 2: الضيوف */}
          <div className="flex items-start justify-between py-4.5 border-b border-zinc-100">
            <div className="space-y-0.5 text-right">
              <h4 className="text-[13.5px] font-black text-zinc-900">
                الضيوف
              </h4>
              <p className="text-[12px] text-zinc-600 font-bold">
                {guestCount} شخص بالغ
              </p>
            </div>
            <button 
              type="button"
              className="text-[12px] font-black text-zinc-900 underline underline-offset-3 hover:text-rose-600 cursor-pointer active:scale-95 transition-all"
            >
              تغيير
            </button>
          </div>

          {/* Row 3: السعر الإجمالي */}
          <div className="flex items-start justify-between py-4.5 border-b border-zinc-100">
            <div className="space-y-0.5 text-right">
              <h4 className="text-[13.5px] font-black text-zinc-900">
                السعر الإجمالي
              </h4>
              <p className="text-[12.5px] text-zinc-900 font-black tracking-wide">
                USD ${usdPrice}
                <span className="text-[10px] text-zinc-400 font-bold pr-1.5 underline underline-offset-2">
                  USD
                </span>
              </p>
              <p className="text-[10px] font-bold text-zinc-400">
                (يعادل تقريباً {total.toLocaleString()} دج)
              </p>
            </div>
            <button 
              type="button"
              className="text-[12.2px] font-black text-zinc-900 underline underline-offset-3 hover:text-rose-600 cursor-pointer active:scale-95 transition-all"
            >
              التفاصيل
            </button>
          </div>

          {/* Row 4: إلغاء مجاني */}
          <div className="pt-2 text-right space-y-1">
            <h4 className="text-[13.5px] font-black text-zinc-900">
              إلغاء مجاني
            </h4>
            <p className="text-[11.5px] leading-relaxed text-zinc-500 font-bold">
              يمكنك إلغاء الحجز قبل <span className="font-extrabold text-zinc-600">{getArabicCancellationDate()}</span> لاسترداد المبلغ المدفوع بالكامل. <span className="underline text-zinc-900 font-black cursor-pointer hover:text-rose-600">السياسة الكاملة</span>
            </p>
          </div>

        </div>

        {/* Section: اختيار وقت الدفع */}
        <div className="space-y-3 pt-2">
          <h2 className="text-lg font-black text-zinc-950 pr-0.5">
            اختيار وقت الدفع
          </h2>
          
          {/* Bordered Selectable Options Container */}
          <div className="border border-zinc-200/90 rounded-[24px] overflow-hidden bg-white shadow-xs">
            
            {/* Row 1: ادفع الآن */}
            <div 
              onClick={() => setPaymentChoice('now')}
              className={`p-5 flex items-start justify-between cursor-pointer transition-all border-b border-zinc-150/90 active:bg-zinc-50/50 ${
                paymentChoice === 'now' ? 'bg-zinc-50/20' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Visual iOS styled Radio Circle */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center p-0.5 transition-all ${
                  paymentChoice === 'now' ? 'border-zinc-950 bg-white' : 'border-zinc-300 bg-white'
                }`}>
                  {paymentChoice === 'now' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-950" />
                  )}
                </div>
                <span className="text-[13.5px] font-extrabold text-zinc-950">
                  ادفع USD ${usdPrice} الآن
                </span>
              </div>
            </div>

            {/* Row 2: ادفع لاحقاً */}
            <div 
              onClick={() => setPaymentChoice('later')}
              className={`p-5 flex flex-col cursor-pointer transition-all active:bg-zinc-50/50 ${
                paymentChoice === 'later' ? 'bg-zinc-50/20' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Visual iOS styled Radio Circle */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center p-0.5 transition-all ${
                  paymentChoice === 'later' ? 'border-zinc-950 bg-white' : 'border-zinc-300 bg-white'
                }`}>
                  {paymentChoice === 'later' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-950" />
                  )}
                </div>
                <span className="text-[13.5px] font-extrabold text-zinc-950">
                  ادفع USD $0 الآن
                </span>
              </div>
              
              <div className="pr-8 mt-2 space-y-1">
                <p className="text-[11.2px] leading-relaxed text-zinc-500 font-bold">
                  سيتم تحصيل رسوم منك بقيمة <span className="font-extrabold text-zinc-650">USD ${usdPrice}</span> في <span className="font-extrabold text-zinc-600">{getArabicPaymentDate()}</span>. ولا توجد رسوم إضافية. <span className="underline text-zinc-900 font-black cursor-pointer hover:text-rose-600">المزيد من المعلومات</span>
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Sticky Bottom Row matching the screenshots completely */}
      <div className="fixed sm:absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-100 py-4 px-6 flex flex-col items-center shadow-md rounded-none">
        <button
          type="button"
          onClick={onConfirm}
          className="w-full py-4 bg-zinc-950 hover:bg-zinc-900 text-white font-black text-[13.5px] tracking-wide rounded-2xl cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-950/5"
          id="review-next-action-btn"
        >
          <span>التالي</span>
        </button>
        {/* Soft bottom margin spacer visually acting as safe area bar */}
        <div className="w-32 h-1 bg-zinc-200 rounded-full mt-2 sm:hidden"></div>
      </div>
    </motion.div>
  );
};
