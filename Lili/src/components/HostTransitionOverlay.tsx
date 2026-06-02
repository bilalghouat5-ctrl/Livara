import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

// Custom High-Fidelity Isometric House Scene (البيوت - الاستضافة)
const IsometricHouseScene: React.FC = () => (
  <svg viewBox="0 0 300 300" className="w-64 h-64 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grassGrad" x1="50" y1="120" x2="250" y2="250" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
      <linearGradient id="roofGradIso" x1="100" y1="90" x2="210" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4b5563" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="wallFrontGrad" x1="100" y1="160" x2="160" y2="220" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="wallSideGrad" x1="160" y1="160" x2="220" y2="220" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient id="deckGrad" x1="70" y1="180" x2="150" y2="240" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
    </defs>
    
    {/* Oval base shadow */}
    <ellipse cx="150" cy="245" rx="110" ry="25" fill="#e2e8f0" opacity="0.95" />
    <ellipse cx="150" cy="242" rx="90" ry="15" fill="#cbd5e1" opacity="0.7" />

    {/* Isometric base grass block */}
    <path d="M 150 140 L 250 190 L 150 240 L 50 190 Z" fill="url(#grassGrad)" stroke="#166534" strokeWidth="2.5" />
    {/* 3D Grass Edge block */}
    <path d="M 50 190 L 150 240 L 150 248 L 50 198 Z" fill="#166534" />
    <path d="M 150 240 L 250 190 L 250 198 L 150 248 Z" fill="#14532d" />

    {/* Elegant Miniature Decking (Wooden patio) */}
    <path d="M 80 185 L 145 218 L 115 233 L 55 200 Z" fill="url(#deckGrad)" stroke="#451a03" strokeWidth="1" />
    <line x1="88" y1="189" x2="63" y2="204" stroke="#451a03" strokeWidth="1" />
    <line x1="96" y1="193" x2="71" y2="208" stroke="#451a03" strokeWidth="1" />
    <line x1="104" y1="197" x2="79" y2="212" stroke="#451a03" strokeWidth="1" />
    <line x1="112" y1="201" x2="87" y2="216" stroke="#451a03" strokeWidth="1" />

    {/* Miniature Tree next to house */}
    <path d="M 95 110 L 95 160" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="95" cy="110" r="22" fill="#16a34a" opacity="0.9" stroke="#14532d" strokeWidth="1.5" />
    <circle cx="85" cy="100" r="14" fill="#22c55e" opacity="0.8" />
    <circle cx="108" cy="112" r="16" fill="#15803d" opacity="0.9" />

    {/* The House - Left Front Wall */}
    <path d="M 115 155 L 165 180 L 165 215 L 115 190 Z" fill="url(#wallFrontGrad)" stroke="#1e293b" strokeWidth="2" />
    {/* The House - Right Side Wall */}
    <path d="M 165 180 L 215 155 L 215 190 L 165 215 Z" fill="url(#wallSideGrad)" stroke="#1e293b" strokeWidth="2" />
    
    {/* Pitch Roof Front */}
    <path d="M 115 155 L 165 125 L 165 180 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
    {/* Pitch Roof Side Slope (Main Roof) */}
    <path d="M 165 125 L 218 153 L 215 182 L 165 180 Z" fill="url(#roofGradIso)" stroke="#1e293b" strokeWidth="2" />
    <line x1="175" y1="130" x2="216" y2="153" stroke="#374151" strokeWidth="1.5" />
    <line x1="185" y1="135" x2="216" y2="162" stroke="#374151" strokeWidth="1.5" />
    <line x1="195" y1="140" x2="216" y2="171" stroke="#374151" strokeWidth="1.5" />

    {/* Red Cottage Door */}
    <path d="M 132 175 L 147 182 L 147 203 L 132 195 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
    <circle cx="143" cy="190" r="1" fill="#fbbf24" />

    {/* Lighted Windows */}
    <path d="M 120 165 L 128 169 L 128 180 L 120 176 Z" fill="#fef08a" stroke="#1e293b" strokeWidth="1" />
    <path d="M 175 170 L 188 163 L 188 175 L 175 182 Z" fill="#fef08a" stroke="#1e293b" strokeWidth="1" />
    <path d="M 194 161 L 207 154 L 207 166 L 194 173 Z" fill="#fef08a" stroke="#1e293b" strokeWidth="1" />

    {/* Stone Chimney */}
    <path d="M 198 128 L 206 132 L 206 155 L 198 151 Z" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
    <circle cx="202" cy="118" r="4" fill="#cbd5e1" opacity="0.6" />
    <circle cx="205" cy="111" r="6" fill="#cbd5e1" opacity="0.4" />

    {/* Decorative miniature people on deck */}
    <ellipse cx="98" cy="214" rx="3" ry="5" fill="#f43f5e" />
    <circle cx="98" cy="206" r="2.5" fill="#fed7aa" />
    
    <rect x="151" y="180" width="3" height="15" rx="1" fill="#3b82f6" />
    <circle cx="152.5" cy="176.5" r="2" fill="#fed7aa" />

    {/* Dog */}
    <rect x="85" y="222" width="5" height="3" rx="1" fill="#b45309" />
    <circle cx="91" cy="221" r="1.5" fill="#b45309" />
  </svg>
);

// Custom High-Fidelity Isometric Beach Scene (شاطئ رملي - السفر)
const IsometricBeachScene: React.FC = () => (
  <svg viewBox="0 0 300 300" className="w-64 h-64 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sandGrad" x1="50" y1="120" x2="250" y2="250" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
      <linearGradient id="seaGrad" x1="50" y1="180" x2="250" y2="240" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>

    {/* Oval base shadow */}
    <ellipse cx="150" cy="245" rx="110" ry="25" fill="#cbd5e1" opacity="0.95" />
    <ellipse cx="150" cy="242" rx="95" ry="16" fill="#94a3b8" opacity="0.5" />

    {/* Ocean base */}
    <path d="M 150 145 L 255 195 L 150 245 L 45 195 Z" fill="url(#seaGrad)" stroke="#0e7490" strokeWidth="2.5" />
    
    {/* Sandy Island circle */}
    <path d="M 150 160 C 205 160, 240 180, 240 195 C 240 210, 195 230, 150 230 C 105 230, 60 210, 60 195 C 60 180, 95 160, 150 160 Z" fill="url(#sandGrad)" stroke="#ca8a04" strokeWidth="1.5" />

    {/* Curved Palm Tree */}
    <path d="M 135 195 Q 125 150 148 105" stroke="#a16207" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    <path d="M 135 195 Q 125 150 148 105" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="3 4" fill="none" />

    {/* Coconuts */}
    <circle cx="142" cy="106" r="3.5" fill="#451a03" />
    <circle cx="150" cy="108" r="3" fill="#451a03" />

    {/* Palm Leaves */}
    <path d="M 148 105 Q 165 95 185 102" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M 148 105 Q 135 90 120 92" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M 148 105 Q 155 80 145 65" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M 148 105 Q 170 115 165 130" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M 148 105 Q 130 115 115 120" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" fill="none" />

    {/* Straw parasol */}
    <line x1="185" y1="185" x2="185" y2="135" stroke="#78350f" strokeWidth="3" />
    <path d="M 160 135 L 185 115 L 210 135 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M 185 115 L 185 135" stroke="#78350f" strokeWidth="1" />
    <path d="M 185 115 L 172 135" stroke="#78350f" strokeWidth="1" />
    <path d="M 185 115 L 198 135" stroke="#78350f" strokeWidth="1" />

    {/* Twin Beach Chairs */}
    <path d="M 142 205 L 155 198 L 165 203 L 152 210 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
    <path d="M 142 205 L 138 195" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    <rect x="144" y="201" width="10" height="4" fill="#38bdf8" opacity="0.8" />

    <path d="M 158 213 L 171 206 L 181 211 L 168 218 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
    <path d="M 158 213 L 154 203" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    <rect x="160" y="209" width="10" height="4" fill="#ff7a91" opacity="0.8" />
    
    {/* Footprints */}
    <circle cx="120" cy="205" r="1" fill="#ca8a04" />
    <circle cx="123" cy="207" r="1.2" fill="#ca8a04" />
    <circle cx="127" cy="209" r="1" fill="#ca8a04" />
    <circle cx="130" cy="211" r="1.2" fill="#ca8a04" />
  </svg>
);

interface HostTransitionOverlayProps {
  isVisible: boolean;
  targetMode: 'host' | 'guest';
}

export const HostTransitionOverlay: React.FC<HostTransitionOverlayProps> = ({ isVisible, targetMode }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 bg-white flex flex-col justify-center items-center text-zinc-900 select-none"
          dir="rtl"
        >
          {/* Centered Transforming 3D Coin/Plate Flip Visual Content */}
          <div className="flex flex-col items-center justify-center space-y-10 max-w-sm text-center">
            
            {/* The 3D flip card context */}
            <div style={{ perspective: 1200 }} className="relative w-80 h-80 flex items-center justify-center">
              <motion.div
                style={{ transformStyle: "preserve-3d" }}
                animate={{ 
                  rotateY: targetMode === 'host' ? [180, 540, 360] : [360, -180, 180],
                  scale: [0.93, 1.15, 0.98, 1.02, 1],
                  y: [0, -18, 4, -2, 0]
                }}
                transition={{ 
                  duration: 2.2, 
                  ease: "easeInOut"
                }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* FRONT FACE: Miniature House Scene - البيوت / الاستضافة */}
                <div 
                  style={{ backfaceVisibility: "hidden" }} 
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <IsometricHouseScene />
                </div>

                {/* BACK FACE: Miniature Beach Island Scene - تجارب السفر */}
                <div 
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)" 
                  }} 
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <IsometricBeachScene />
                </div>
              </motion.div>
            </div>

            {/* Glowing Text Caption removed precisely to respect user's request */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
