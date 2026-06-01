import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ListFilter, Search, X, CheckSquare, PlusCircle, HelpCircle } from 'lucide-react';

export const HostListingsView: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newWilaya, setNewWilaya] = useState('الجزائر العاصمة');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setShowCreateModal(false);
      setNewTitle('');
      setNewPrice('');
    }, 2500);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-10 pb-6 space-y-6 text-right select-none md:pb-28" dir="rtl">
      
      {/* Top Header Row with Buttons on Left, Title on Right exactly matching Image 2 */}
      <div className="flex items-center justify-between font-black">
        {/* Top left round action buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-10 h-10 bg-zinc-100 hover:bg-zinc-200/80 rounded-full flex items-center justify-center transition-all cursor-pointer haptic-tap text-zinc-900 border border-zinc-200/20 shadow-2xs"
            title="إنشاء إعلان جديد"
          >
            <Plus className="w-5.5 h-5.5 stroke-[2.3]" />
          </button>
          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 border border-zinc-200/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>
          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 border border-zinc-200/20">
            <Search className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* Big styled Title "إعلانك" */}
        <h1 className="text-[28px] font-black tracking-tight text-zinc-950 leading-none">
          إعلانك
        </h1>
      </div>

      {/* Main Container mirroring Image 2 */}
      <div className="flex flex-col items-center justify-center py-10 w-full space-y-8">
        
        {/* Slanted stack of 3 illustrations: Little lodge house, Hot air balloon, Reception Desk Bell */}
        <div className="relative w-80 h-44 flex items-center justify-center">
          
          {/* Card 1 (Left, slanted): Little lodge under greenery */}
          <motion.div
            initial={{ rotate: -15, x: -50, y: 10, opacity: 0 }}
            animate={{ rotate: -12, x: -55, y: 5, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute w-28 h-28 bg-white rounded-2xl flex flex-col items-center justify-center border border-zinc-200/85 shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            <div className="bg-emerald-50/50 w-full flex-1 flex items-center justify-center p-3 relative">
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                {/* House Base */}
                <rect x="32" y="48" width="36" height="32" rx="4" fill="#C5A85A" />
                {/* Red Door */}
                <rect x="45" y="58" width="10" height="22" rx="1.5" fill="#FF385C" />
                <circle cx="53" cy="69" r="1.2" fill="white" />
                {/* Roof */}
                <path d="M26 48 L50 25 L74 48 Z" fill="#3A3A3C" />
                {/* Little garden green */}
                <ellipse cx="25" cy="80" rx="18" ry="8" fill="#10B981" fillOpacity="0.2" />
                <ellipse cx="75" cy="80" rx="18" ry="8" fill="#10B981" fillOpacity="0.2" />
              </svg>
            </div>
          </motion.div>

          {/* Card 2 (Center, front/raised): Hot air balloon */}
          <motion.div
            initial={{ scale: 0.9, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: -10, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="absolute w-30 h-30 bg-white rounded-3xl flex flex-col items-center justify-center border border-zinc-300 shadow-[0_10px_25px_rgba(0,0,0,0.08)] z-10 overflow-hidden"
          >
            <div className="bg-amber-50/60 w-full flex-1 flex items-center justify-center p-3">
              <svg viewBox="0 0 100 100" className="w-20 h-20">
                {/* Balloon basket */}
                <rect x="44" y="74" width="12" height="10" rx="1.5" fill="#8B4513" />
                {/* Rope lines */}
                <line x1="46" y1="62" x2="46" y2="74" stroke="#8B4513" strokeWidth="1.5" />
                <line x1="54" y1="62" x2="54" y2="74" stroke="#8B4513" strokeWidth="1.5" />
                {/* Hot air balloon body glowing orange */}
                <circle cx="50" cy="42" r="26" fill="#EA580C" />
                <path d="M30 31 C25 45, 50 67, 50 67 C 50 67, 75 45, 70 31 Z" fill="#EA580C" />
                {/* Decorative stripe */}
                <path d="M50 16 C38 16, 38 64, 50 67 C 62 64, 62 16, 50 16 Z" fill="#FACC15" />
                <circle cx="50" cy="42" r="8" fill="#FFFFFF" fillOpacity="0.4" />
              </svg>
            </div>
          </motion.div>

          {/* Card 3 (Right, slanted): Desk Service Bell */}
          <motion.div
            initial={{ rotate: 15, x: 50, y: 10, opacity: 0 }}
            animate={{ rotate: 12, x: 55, y: 5, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute w-28 h-28 bg-white rounded-2xl flex flex-col items-center justify-center border border-zinc-200/85 shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            <div className="bg-zinc-50 w-full flex-1 flex items-center justify-center p-3">
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                {/* Bell base black */}
                <rect x="25" y="72" width="50" height="8" rx="2" fill="#1C1C1E" />
                {/* Silver bell body */}
                <path d="M30 72 C30 45, 70 45, 70 72 Z" fill="#A1A1A6" />
                <ellipse cx="50" cy="54" rx="20" ry="18" fill="#D1D1D6" />
                {/* Little click button */}
                <rect x="47" y="38" width="6" height="8" fill="#636366" />
                <ellipse cx="50" cy="38" rx="5" ry="2.2" fill="#1C1C1E" />
              </svg>
            </div>
          </motion.div>

        </div>

        {/* Text descriptions mirroring exactly Image 2 */}
        <div className="text-center space-y-5 px-4">
          <p className="text-sm font-black text-zinc-900 leading-relaxed max-w-sm mx-auto text-center font-sans">
            قم بإنشاء إعلان من خلال Daro Setup وابدأ في تلقي الحجوزات.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setShowCreateModal(true)}
              type="button"
              className="bg-zinc-100 hover:bg-zinc-200 transition-all text-zinc-900 text-xs font-black py-3 px-8 rounded-xl cursor-pointer haptic-tap"
            >
              البدء
            </button>
          </div>
        </div>

      </div>

      {/* CREATE LISTING OVERLAY DIALOG */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6.5 text-right space-y-5 shadow-xl border border-zinc-200"
            >
              <div className="flex justify-between items-center pb-2 border-b">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-base font-black text-[#111111]">إنشاء إعلان جديد</h3>
              </div>

              {successMsg ? (
                <div className="py-8 text-center space-y-2">
                  <span className="text-3xl">🎉</span>
                  <h4 className="text-sm font-black text-emerald-600">تم إنشاء الإعلان وبدء البث بنجاح!</h4>
                  <p className="text-[11px] text-zinc-450 font-bold">باقة إعلانات Daro Setup ستتوجه نحو الحجز الفوري قريباً.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateListing} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-zinc-400">العنوان بالعربية</label>
                    <input
                      type="text"
                      placeholder="مثال: شاليه خشبي دافئ في أعالي بجاية"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      className="w-full text-xs font-bold bg-zinc-50 text-zinc-800 p-3 rounded-lg border border-zinc-200 outline-none focus:border-[#ff385c]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-zinc-400">سعر الليلة (دج)</label>
                      <input
                        type="number"
                        placeholder="16000"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        required
                        className="w-full text-xs font-bold bg-zinc-50 text-zinc-800 p-3 rounded-lg border border-zinc-200 outline-none focus:border-[#ff385c]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-zinc-400">الولاية السياحية</label>
                      <select
                        value={newWilaya}
                        onChange={(e) => setNewWilaya(e.target.value)}
                        className="w-full text-xs font-bold bg-zinc-50 text-zinc-800 p-3 rounded-lg border border-zinc-200 outline-none"
                      >
                        <option value="الجزائر العاصمة">الجزائر العاصمة</option>
                        <option value="بجاية">بجاية</option>
                        <option value="تيكجدا">تيكجدا</option>
                        <option value="جيجل">جيجل</option>
                        <option value="وهران">وهران</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#ff385c] hover:bg-rose-600 text-white font-black text-xs py-3.5 rounded-xl transition-all haptic-tap flex items-center justify-center gap-2"
                  >
                    <span>تأكيد المراجعة ونشر الإعلان</span>
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
