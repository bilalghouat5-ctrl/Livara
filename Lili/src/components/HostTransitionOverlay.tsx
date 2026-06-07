import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import isometricHouse from '../assets/images/isometric_house_1780483641047.png';
import isometricIsland from '../assets/images/isometric_island_1780483654095.png';

interface HostTransitionOverlayProps {
  isVisible: boolean;
  targetMode: 'host' | 'guest';
}

export const HostTransitionOverlay: React.FC<HostTransitionOverlayProps> = ({ isVisible, targetMode }) => {
  const isEnteringHost = targetMode === 'host';

  const exitingImage = isEnteringHost ? isometricIsland : isometricHouse;
  const enteringImage = isEnteringHost ? isometricHouse : isometricIsland;

  // Clean blending styles to eliminate any subtle off-white borders and blend perfectly with the pure white screen
  const imageBlendStyle: React.CSSProperties = {
    mixBlendMode: 'multiply',
    filter: 'contrast(1.15) brightness(1.08)',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white flex flex-col justify-center items-center select-none overflow-hidden"
          dir="rtl"
        >
          {/* Stunning 3D Viewport with generous perspective and absolutely no container backgrounds */}
          <div 
            style={{ perspective: 1400, transformStyle: 'preserve-3d' }}
            className="relative w-80 h-80 flex items-center justify-center"
          >
            {/* 1. EXITING SHAPE - slides up and tilts backward away in 3D perspective */}
            <motion.div
              key={`${targetMode}-exiting`}
              initial={{ y: 0, opacity: 1, rotateX: 0, scale: 1, z: 0 }}
              animate={{ 
                y: -280, 
                opacity: 0, 
                rotateX: -60, 
                scale: 0.72, 
                z: -180 
              }}
              transition={{ 
                duration: 1.1, 
                ease: [0.4, 0, 0.2, 1] 
              }}
              className="absolute w-72 h-72 flex items-center justify-center pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                src={exitingImage}
                alt="Exiting transition"
                className="w-full h-full object-contain selection:bg-transparent pointer-events-none"
                style={imageBlendStyle}
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* 2. ENTERING SHAPE - starts from below, tilted forward, and slides up elegantly to center */}
            <motion.div
              key={`${targetMode}-entering`}
              initial={{ y: 280, opacity: 0, rotateX: 60, scale: 0.72, z: -180 }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                rotateX: 0, 
                scale: 1, 
                z: 0 
              }}
              transition={{ 
                delay: 0.12,
                duration: 1.3, 
                ease: [0.16, 1, 0.3, 1] //Snappy fluid ease-out 
              }}
              className="absolute w-72 h-72 flex items-center justify-center pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                src={enteringImage}
                alt="Entering transition"
                className="w-full h-full object-contain selection:bg-transparent pointer-events-none"
                style={imageBlendStyle}
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
