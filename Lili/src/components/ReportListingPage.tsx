import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Flag, CheckCircle2, ChevronLeft, AlertTriangle } from 'lucide-react';

interface ReportListingPageProps {
  onClose: () => void;
  listingTitle: string;
}

const REPORT_REASONS = [
  { id: 'misleading', text: 'إعلان مضلل أو صور وموقع غير دقيقين' },
  { id: 'fraud', text: 'هذا الإعلان مزيف أو احتيالي أو غير موجود' },
  { id: 'off_platform', text: 'المضيف يطلب دفع مبالغ مالية خارج المنصة' },
  { id: 'inappropriate', text: 'محتوى غير لائق أو صور تخدش الحياء' },
  { id: 'safety', text: 'مخاوف تتعلق بالسلامة والأمان أو حوادث خطيرة' },
  { id: 'spam', text: 'محتوى غير مرغوب فيه (سبام) أو إعلان مكرر' },
  { id: 'other', text: 'سبب آخر' }
];

export const ReportListingPage: React.FC<ReportListingPageProps> = ({ onClose, listingTitle }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;
    setIsSubmitting(true);
    
    // Simulate API request submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', damping: 28, stiffness: 240 }}
      className="absolute inset-0 bg-white z-50 overflow-y-auto pb-24 flex flex-col text-right scrollbar-none rounded-t-[36px] sm:rounded-[36px]"
      dir="rtl"
    >
      {/* Header matching design guidelines */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 border-b border-zinc-100/90 px-6 py-4 flex items-center justify-between select-none">
        <button 
          onClick={onClose}
          type="button"
          className="text-zinc-900 bg-zinc-50 hover:bg-zinc-100 p-2.5 rounded-full transition-all cursor-pointer active:scale-95 flex items-center justify-center border border-zinc-100 shadow-xs"
        >
          <ArrowRight className="w-5.5 h-5.5 stroke-[2.2]" />
        </button>
        <span className="font-extrabold text-[#111] text-base">تقديم بلاغ</span>
        <div className="w-10"></div> {/* Spacer for perfect center */}
      </div>

      <div className="px-6 py-6 max-w-xl mx-auto w-full flex-1 flex flex-col select-none">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="report-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 flex-1 flex flex-col"
            >
              {/* Alert Warning Box */}
              <div className="bg-amber-50/70 border border-amber-150 rounded-2xl p-4 flex items-start gap-3.5 text-right">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-right">
                  <h4 className="font-black text-amber-900 text-xs">ملاحظة أمنية هامة</h4>
                  <p className="text-amber-800 text-[11px] font-bold leading-normal mt-1">
                    إذا كان هذا البلاغ عبارة عن حالة طوارئ أو خطر فوري على سلامتك، يرجى الاتصال بالسلطات الأمنية والطبية المحلية فوراً قبل تقديم طلبك.
                  </p>
                </div>
              </div>

              {/* Main Title Description */}
              <div className="space-y-1 text-right">
                <h2 className="text-xl font-black text-zinc-950">هل تريد الإبلاغ عن هذا الإعلان؟</h2>
                <p className="text-zinc-500 text-xs font-bold leading-relaxed">
                  مساعدتنا في الحفاظ على أمان مجتمعنا. يرجى اختيار سبب الإبلاغ عن الإعلان: <span className="text-zinc-800 font-extrabold">"{listingTitle}"</span>
                </p>
              </div>

              {/* Reasons Selection List */}
              <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  {REPORT_REASONS.map((reason) => {
                    const isSelected = selectedReason === reason.id;
                    return (
                      <button
                        key={reason.id}
                        type="button"
                        onClick={() => setSelectedReason(reason.id)}
                        className={`w-full flex items-center justify-between text-right p-4 rounded-2xl border transition-all cursor-pointer text-sm font-black active:scale-[0.99] ${
                          isSelected
                            ? 'bg-[#ff385c]/5 border-[#ff385c] text-[#ff385c] shadow-sm'
                            : 'bg-zinc-50 border-zinc-200/80 hover:bg-zinc-100/60 text-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? 'border-[#ff385c] bg-[#ff385c]' : 'border-zinc-300 bg-white'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <span className="text-right flex-1 pr-3">{reason.text}</span>
                      </button>
                    )
                  })}

                  {/* Detail text input for explanation */}
                  {selectedReason && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2 pt-2"
                    >
                      <label className="block text-xs font-black text-zinc-700 text-right pr-0.5">
                        تفاصيل إضافية (اختياري)
                      </label>
                      <textarea
                        value={reportDetails}
                        onChange={(e) => setReportDetails(e.target.value)}
                        placeholder="يرجى كتابة تفاصيل لمساعدتنا في فهم المشكلة (مثال: الأسعار تختلف عن الوصف، المضيف طلب دفع نقدًا، إلخ)..."
                        rows={4}
                        className="w-full text-xs p-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]/20 outline-none text-zinc-800 text-right font-medium resize-none leading-relaxed"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Submit button wrapper */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={!selectedReason || isSubmitting}
                    className={`w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all ${
                      !selectedReason 
                        ? 'bg-zinc-200 cursor-not-allowed shadow-none'
                        : isSubmitting
                          ? 'bg-zinc-800'
                          : 'bg-[#ff385c] hover:bg-rose-600 shadow-md shadow-rose-500/10 cursor-pointer active:scale-95'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        جاري إرسال البلاغ...
                      </span>
                    ) : (
                      <>
                        <Flag className="w-4 h-4" />
                        <span>إرسال البلاغ</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="report-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 25 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-12"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              
              <div className="space-y-2.5 max-w-sm">
                <h2 className="text-xl font-black text-zinc-950">تم إرسال بلاغك بنجاح!</h2>
                <p className="text-zinc-550 text-xs font-bold leading-relaxed px-2">
                  نشكرك على مساهمتك في الحفاظ على سلامة وموثوقية مجتمعنا. سيقوم فريق مراجعة الإعلانات بفحص هذا الإعلان واتخاذ الإجراء المناسب في أقرب وقت.
                </p>
              </div>

              <div className="w-full max-w-sm pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs rounded-2xl transition-all cursor-pointer active:scale-95"
                >
                  إغلاق وباقي المتصفح
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
