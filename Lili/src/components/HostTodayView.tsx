import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Inbox } from 'lucide-react';

export const HostTodayView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'today' | 'upcoming'>('today');

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-10 pb-6 flex flex-col justify-between items-center text-right select-none md:pb-28" dir="rtl">
      
      {/* Top Filter Segmented Control */}
      <div className="flex bg-zinc-100 p-1 rounded-full items-center justify-center gap-1 w-full max-w-[280px]">
        <button
          onClick={() => setActiveFilter('today')}
          type="button"
          className={`relative px-6 py-2.5 rounded-full text-[12.5px] font-black tracking-wide transition-all duration-300 w-1/2 flex items-center justify-center cursor-pointer ${
            activeFilter === 'today'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-650 hover:text-zinc-900 bg-transparent'
          }`}
        >
          <span>اليوم</span>
        </button>
        <button
          onClick={() => setActiveFilter('upcoming')}
          type="button"
          className={`relative px-6 py-2.5 rounded-full text-[12.5px] font-black tracking-wide transition-all duration-300 w-1/2 flex items-center justify-center cursor-pointer ${
            activeFilter === 'upcoming'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-650 hover:text-zinc-900 bg-transparent'
          }`}
        >
          <span>القادمة</span>
        </button>
      </div>

      {/* Main Illustration Area */}
      <div className="flex flex-col items-center justify-center py-20 w-full space-y-7">
        
        {/* Exquisite Vectored 3D styled Open Planner/Notebook with Pink Bookmark/Ribbon */}
        <div className="relative w-72 h-56 flex items-center justify-center">
          <svg
            className="w-full h-full drop-shadow-xl"
            viewBox="0 0 320 250"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft Shadow ground */}
            <ellipse cx="160" cy="210" rx="90" ry="12" fill="black" fillOpacity="0.06" filter="blur(8px)" />

            {/* Notebook Back Cover thickness/depth */}
            <path
              d="M100 198 L220 205 C230 206, 235 204, 238 198 L240 102 C238 98, 230 96, 220 95 L100 88 H90 L100 198 Z"
              fill="#D4B67F"
            />
            {/* Notebook Cover left back */}
            <path
              d="M75 190 L160 216 L170 214 L85 188 C78 185, 72 188, 75 190 Z"
              fill="#855B32"
            />
            {/* Main Open Planner Cover (Wood / Premium Leather style) */}
            <path
              d="M80 186 L158 214 C162 215, 166 215, 170 212 L242 180 C247 178, 250 173, 248 168 L222 92 C221 88, 217 85, 212 86 L156 102 L92 88 C88 87, 84 90, 83 94 L76 174 C75 179, 77 184, 80 186 Z"
              fill="#E2C9A1"
            />

            {/* Left Page (Thickness & base white sheet) */}
            <path
              d="M93 96 L156 110 L154 198 L90 181 C88 180.5, 87 179, 87 177 L93 96 Z"
              fill="#EFEBE4"
            />
            {/* Left Page Ruled Sheets */}
            <path
              d="M96 95 L158 109 L156 195 L92 178 M95 99 L157 113 L155 199 L91 182"
              stroke="#D6CEBE"
              strokeWidth="2"
            />
            {/* Left Page surface white */}
            <path
              d="M98 94 L159 108 L157 192 L95 175 C93 174.5, 92 173, 92 171 L98 94 Z"
              fill="#FCFBF9"
            />

            {/* Left Page Horizontal Grid Lines */}
            <line x1="102" y1="112" x2="148" y2="124" stroke="#E9E2D2" strokeWidth="1.8" />
            <line x1="101" y1="128" x2="146" y2="140" stroke="#E9E2D2" strokeWidth="1.8" />
            <line x1="100" y1="144" x2="144" y2="156" stroke="#E9E2D2" strokeWidth="1.8" />
            <line x1="99" y1="160" x2="142" y2="172" stroke="#E9E2D2" strokeWidth="1.8" />

            {/* Right Page (Thickness & base white sheet) */}
            <path
              d="M165 110 L228 92 C230 91.5, 232 92.5, 232 94.5 L242 168 C242.5 170, 241 172.5, 239 173 L163 194 L165 110 Z"
              fill="#EFEBE4"
            />
            {/* Right Page ruled sheets */}
            <path
              d="M162 109 L225 91 L234 167 L160 193 M164 113 L227 95 L236 171 L162 197"
              stroke="#D6CEBE"
              strokeWidth="2"
            />
            {/* Right Page surface white */}
            <path
              d="M163 107 L224 89 C226 88.5, 227 89.5, 228 91 L237 165 C237.5 167, 236 169, 234 169.5 L161 190.5 M163 107 L161 190.5"
              fill="#FCFBF9"
            />

            {/* Right Page Grid Lines (Vertical columns and planner block) */}
            <line x1="174" y1="110" x2="171" y2="185" stroke="#E9E2D2" strokeWidth="1.8" />
            <line x1="192" y1="105" x2="189" y2="180" stroke="#E9E2D2" strokeWidth="1.8" />
            <line x1="210" y1="100" x2="207" y2="175" stroke="#E9E2D2" strokeWidth="1.8" />
            {/* Horizontal dividers on right */}
            <line x1="174" y1="125" x2="225" y2="111" stroke="#E9E2D2" strokeWidth="1.6" />
            <line x1="172" y1="150" x2="221" y2="136" stroke="#E9E2D2" strokeWidth="1.6" />

            {/* Binder Metal Rings (Connecting left and right pages) */}
            <path d="M156 122 C160 119, 163 119, 164 122 M156 123 L164 121" stroke="#CDCDCD" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M155 142 C159 139, 162 139, 163 142 M155 143 L163 141" stroke="#CDCDCD" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M154 162 C158 159, 161 159, 162 162 M154 163 L162 161" stroke="#CDCDCD" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M153 182 C157 179, 160 179, 161 182 M153 183 L161 181" stroke="#CDCDCD" strokeWidth="3.2" strokeLinecap="round" />

            {/* Glowing Pink/Rose Ribbon/Bookmark dangling out from the bottom fold */}
            <path
              d="M153 162 L132 208 C129 214, 118 214, 115 208 L104 186"
              fill="#E61E4D"
              fillOpacity="0.15"
              className="blur-[4px]"
            />
            {/* Actual ribbon path */}
            <path
              d="M156 160 Q152 175, 142 191 L110 216 L124 212 L138 219 L149 193 Q156 175, 158 160 Z"
              fill="#FF385C"
            />
            <path
              d="M156 160 Q152 175, 142 191 L110 216 L124 212 Z"
              fill="#DD2245"
            />
          </svg>
        </div>

        {/* Text matches Image 1 precisely */}
        <div className="text-center space-y-1.5 px-4">
          <h3 className="text-lg font-black text-zinc-950 tracking-wide text-center">
            {activeFilter === 'today' ? 'ليس لديك أي حجوزات' : 'لا توجد حجوزات قادمة'}
          </h3>
          <p className="text-[12px] font-bold text-zinc-400 text-center max-w-xs mx-auto leading-relaxed">
            {activeFilter === 'today' 
              ? 'مستندات وتواريخ اليوم خالية تماماً. بمجرد قيام الضيف بالحجز الفوري، ستظهر كافة المعطيات هنا.'
              : 'ليست هناك حجوزات مجدولة للتأكيد حالياً. تابع حالة إعلانك بانتظام.'}
          </p>
        </div>

      </div>
    </div>
  );
};
