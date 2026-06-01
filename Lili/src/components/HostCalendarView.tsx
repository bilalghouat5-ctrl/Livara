import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, ChevronLeft, Lock, Unlock, HelpCircle } from 'lucide-react';

export const HostCalendarView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [blockedDates, setBlockedDates] = useState<number[]>([1, 2, 7, 8, 22, 23]);
  const [bookedDates, setBookedDates] = useState<number[]>([15, 16, 17]);

  // June 2026 starts on Monday (Monday = 1 in June 2026). In RTL we display Sunday to Saturday.
  const weekDays = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
  
  // June has 30 days. Monday is the 1st day. Since we order ح (Sun) to س (Sat), Monday is index 1.
  // So we need 1 blank cell for Sunday.
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const blanks = [null]; // 1 blank for Sunday.

  const handleDayClick = (day: number) => {
    setSelectedDate(day);
  };

  const toggleBlockDate = (day: number) => {
    if (bookedDates.includes(day)) return; // Can't block booked days

    setBlockedDates((prev) => 
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const getStatusText = (day: number) => {
    if (bookedDates.includes(day)) return 'محجوز (حجز مؤكد)';
    if (blockedDates.includes(day)) return 'مغلق (غير متاح)';
    return 'متاح للضيوف';
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-10 pb-6 space-y-6 text-right select-none md:pb-28" dir="rtl">
      
      {/* Header with Title and Settings Icon */}
      <div className="flex justify-between items-center pr-1.5">
        <h1 className="text-2xl font-black text-zinc-950">التقويم</h1>
        <div className="flex gap-2">
          <button className="w-9 h-9 bg-zinc-100 hover:bg-zinc-200/75 rounded-full flex items-center justify-center transition-all cursor-pointer haptic-tap text-zinc-800">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Month Navigation Control Header */}
      <div className="bg-white border border-zinc-200/80 p-5 rounded-[24px] shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-black text-zinc-900">جوان 2026</h2>
          <div className="flex gap-1.5">
            <button className="w-8 h-8 rounded-full border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center text-zinc-700 cursor-pointer">
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
            <button className="w-8 h-8 rounded-full border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center text-zinc-700 cursor-pointer">
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Days of Week Row */}
        <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] font-black text-zinc-440">
          {weekDays.map((wd, i) => (
            <div key={i} className="py-1">{wd}</div>
          ))}
        </div>

        {/* Calendar Grid (Days) */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs">
          {/* Render Blank Space */}
          {blanks.map((_, i) => (
            <div key={`b-${i}`} className="aspect-square" />
          ))}

          {/* Render actual days */}
          {days.map((day) => {
            const isSelected = selectedDate === day;
            const isBooked = bookedDates.includes(day);
            const isBlocked = blockedDates.includes(day);

            return (
              <button
                type="button"
                key={day}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative cursor-pointer active:scale-90 transition-all border ${
                  isBooked
                    ? 'bg-rose-50 border-rose-200 text-[#ff385c]'
                    : isBlocked
                    ? 'bg-zinc-100 border-zinc-200 text-zinc-400 line-through'
                    : isSelected
                    ? 'bg-zinc-950 border-zinc-950 text-white'
                    : 'bg-white border-zinc-150 text-zinc-800 hover:bg-zinc-50'
                }`}
              >
                <span>{day}</span>
                
                {/* Visual little dot indicator */}
                {isBooked && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff385c] absolute bottom-1.5" />
                )}
                {isBlocked && (
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 absolute bottom-1.5" />
                )}
                {!isBooked && !isBlocked && !isSelected && (
                  <div className="w-1 h-1 rounded-full bg-emerald-400 absolute bottom-1.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Calendar Status Legends */}
        <div className="flex justify-center items-center gap-5 pt-3.5 border-t border-zinc-100 text-[10px] font-black text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>متاح للحجز</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>محجوز بالفعل</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <span>مغلق يدوياً</span>
          </div>
        </div>
      </div>

      {/* Selected Day Controller Card */}
      {selectedDate !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-50 border border-zinc-200/90 rounded-[24px] p-5.5 space-y-4"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black text-zinc-400 leading-none mb-1">تفاصيل تاريخ</h3>
              <h4 className="text-[15px] font-black text-zinc-900 leading-none">
                {selectedDate} جوان 2026
              </h4>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white border border-zinc-250/70 text-[10px] font-black text-zinc-805 shadow-2xs">
              {getStatusText(selectedDate)}
            </div>
          </div>

          <div className="border-t border-zinc-200/50 pt-3.5 flex sm:flex-row flex-col gap-2">
            {!bookedDates.includes(selectedDate) ? (
              <button
                type="button"
                onClick={() => toggleBlockDate(selectedDate)}
                className={`py-3.5 px-5 rounded-xl font-black text-xs cursor-pointer select-none haptic-tap transition-all w-full flex items-center justify-center gap-2 ${
                  blockedDates.includes(selectedDate)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-900 text-white hover:bg-black'
                }`}
              >
                {blockedDates.includes(selectedDate) ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>فتح هذا التاريخ للضيوف</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>إغلاق وحظر هذا التاريخ</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100/50 text-right w-full">
                <p className="text-[10px] font-black text-zinc-500 leading-relaxed">
                  هذا التاريخ محجوز من طرف ضيف مؤكد. لا يمكنك إغلاق أو تعديل حالة التقويم في الفترات المحجوزة مسبقاً.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

    </div>
  );
};
