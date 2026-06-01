import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Search, MessageSquareCode } from 'lucide-react';

export const HostMessagesView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'hosting' | 'travel' | 'support'>('all');

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-10 pb-6 space-y-6 text-right select-none md:pb-28" dir="rtl">
      
      {/* Top Header Row with Buttons on Left, Title on Right exactly matching Image 3 */}
      <div className="flex items-center justify-between font-black">
        {/* Top left round action buttons */}
        <div className="flex gap-2.5">
          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 border border-zinc-200/20">
            <Settings className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 border border-zinc-200/20">
            <Search className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* Big styled Title "الرسائل" */}
        <h1 className="text-[28px] font-black tracking-tight text-zinc-950 leading-none">
          الرسائل
        </h1>
      </div>

      {/* Segmented Capsule filters exactly matching Image 3 (الكل، الاستضافة، السفر، الدعم) */}
      <div className="flex overflow-x-auto gap-2 py-1 scrollbar-none scroll-smooth">
        <button
          onClick={() => setActiveFilter('all')}
          type="button"
          className={`px-5 py-2.5 rounded-full text-[12px] font-black tracking-wide shrink-0 transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#111111] text-white shadow-sm'
              : 'bg-zinc-100 hover:bg-zinc-150 text-zinc-700'
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => setActiveFilter('hosting')}
          type="button"
          className={`px-5 py-2.5 rounded-full text-[12px] font-black tracking-wide shrink-0 transition-all cursor-pointer ${
            activeFilter === 'hosting'
              ? 'bg-[#111111] text-white shadow-sm'
              : 'bg-zinc-100 hover:bg-zinc-150 text-zinc-700'
          }`}
        >
          الاستضافة
        </button>
        <button
          onClick={() => setActiveFilter('travel')}
          type="button"
          className={`px-5 py-2.5 rounded-full text-[12px] font-black tracking-wide shrink-0 transition-all cursor-pointer ${
            activeFilter === 'travel'
              ? 'bg-[#111111] text-white shadow-sm'
              : 'bg-zinc-100 hover:bg-zinc-150 text-zinc-700'
          }`}
        >
          السفر
        </button>
        <button
          onClick={() => setActiveFilter('support')}
          type="button"
          className={`px-5 py-2.5 rounded-full text-[12px] font-black tracking-wide shrink-0 transition-all cursor-pointer ${
            activeFilter === 'support'
              ? 'bg-[#111111] text-white shadow-sm'
              : 'bg-zinc-100 hover:bg-zinc-150 text-zinc-700'
          }`}
        >
          الدعم
        </button>
      </div>

      {/* Main Empty Content exactly matching Image 3 */}
      <div className="flex flex-col items-center justify-center py-24 w-full space-y-7">
        
        {/* Sleek outline message bubble icon */}
        <div className="w-16 h-16 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-900 bg-zinc-50/10">
          <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-current text-zinc-900 fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="8" y1="9" x2="16" y2="9" />
            <line x1="8" y1="13" x2="14" y2="13" />
          </svg>
        </div>

        {/* Text descriptions exactly matching Image 3 */}
        <div className="text-center space-y-1.5 px-4 font-sans">
          <h3 className="text-lg font-black text-zinc-950 text-center">
            ليس لديك أي رسائل
          </h3>
          <p className="text-[12px] font-bold text-zinc-400 text-center max-w-xs mx-auto leading-relaxed">
            ستظهر هنا أي رسائل جديدة تتلقاها.
          </p>
        </div>

      </div>

    </div>
  );
};
