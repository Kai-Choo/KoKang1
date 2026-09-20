import React from 'react';
import { motion } from 'motion/react';

export type MascotMood = 'idle' | 'happy' | 'shocked' | 'cheer' | 'thinking' | 'harvest';

interface GogangMascotProps {
  mood?: MascotMood;
  size?: number;
  message?: React.ReactNode;
  className?: string;
}

export const GogangMascot: React.FC<GogangMascotProps> = ({
  mood = 'idle',
  size = 120,
  message,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech bubble if message provided */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="mb-2 px-3 py-1.5 bg-amber-100/95 border-2 border-amber-800/30 rounded-2xl shadow-sm text-stone-800 text-xs sm:text-sm font-jua text-center relative max-w-[200px] leading-snug tracking-tight"
        >
          {message}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-amber-100" />
        </motion.div>
      )}

      {/* Mascot Animated Vector Body */}
      <motion.div
        animate={
          mood === 'shocked'
            ? { x: [-4, 4, -4, 4, 0], y: [-2, 2, -2, 2, 0], scale: [1, 1.08, 0.95, 1] }
            : mood === 'cheer' || mood === 'happy'
            ? { y: [0, -10, 0], rotate: [0, -3, 3, 0] }
            : { y: [0, -3, 0] }
        }
        transition={
          mood === 'shocked'
            ? { duration: 0.4, repeat: 3 }
            : mood === 'cheer' || mood === 'happy'
            ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ width: size, height: size * 1.15 }}
        className="relative"
      >
        <svg viewBox="0 0 120 140" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow */}
          <ellipse cx="60" cy="132" rx="30" ry="6" fill="#000000" fillOpacity="0.15" />

          {/* Character Fur Outfit (Leopard/Animal fur pattern) */}
          <path
            d="M38 78 C 38 74, 46 72, 60 72 C 74 72, 82 74, 82 78 L 86 116 C 86 120, 78 122, 60 122 C 42 122, 34 120, 34 116 Z"
            fill="#D97706"
            stroke="#92400E"
            strokeWidth="2.5"
          />
          {/* Fur pattern dots */}
          <circle cx="50" cy="88" r="2.5" fill="#78350F" />
          <circle cx="68" cy="92" r="3" fill="#78350F" />
          <circle cx="44" cy="106" r="2" fill="#78350F" />
          <circle cx="72" cy="108" r="2.5" fill="#78350F" />
          <circle cx="58" cy="102" r="2.5" fill="#78350F" />

          {/* Little feet */}
          <ellipse cx="48" cy="126" rx="8" ry="5" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <ellipse cx="72" cy="126" rx="8" ry="5" fill="#D97706" stroke="#92400E" strokeWidth="2" />

          {/* Arms */}
          {mood === 'shocked' ? (
            <>
              {/* Hands covering cheeks in shock */}
              <path d="M38 84 C 28 80, 24 64, 34 54" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
              <circle cx="33" cy="52" r="5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
              <path d="M82 84 C 92 80, 96 64, 86 54" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
              <circle cx="87" cy="52" r="5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
              {/* Sweat drop of shock */}
              <path
                d="M96 28 C 96 24, 102 20, 102 20 C 102 20, 108 24, 108 28 C 108 31, 105 34, 102 34 C 99 34, 96 31, 96 28 Z"
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="1.5"
              />
              <path
                d="M14 26 C 14 22, 19 18, 19 18 C 19 18, 24 22, 24 26 C 24 29, 21 31, 19 31 C 16 31, 14 29, 14 26 Z"
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="1.5"
              />
            </>
          ) : mood === 'cheer' || mood === 'happy' ? (
            <>
              {/* Arms raised up celebrating */}
              <path d="M38 84 C 26 76, 22 56, 26 42" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
              <circle cx="26" cy="40" r="5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
              <path d="M82 84 C 94 76, 98 56, 94 42" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
              <circle cx="94" cy="40" r="5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
            </>
          ) : (
            <>
              {/* Calm idle arms */}
              <path d="M38 82 C 30 88, 30 98, 38 102" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
              <circle cx="39" cy="103" r="5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
              <path d="M82 82 C 90 88, 90 98, 82 102" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
              <circle cx="81" cy="103" r="5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
            </>
          )}

          {/* Neck */}
          <rect x="54" y="66" width="12" height="10" rx="4" fill="#FBBF24" />

          {/* Head */}
          <circle cx="60" cy="46" r="26" fill="#FDE68A" stroke="#B45309" strokeWidth="2.5" />

          {/* Wild Prehistoric Hair */}
          <path
            d="M34 44 C 30 30, 42 16, 60 16 C 78 16, 90 30, 86 44 C 84 32, 76 24, 60 24 C 44 24, 36 32, 34 44 Z"
            fill="#451A03"
          />
          <path d="M32 40 C 26 44, 28 54, 32 58" stroke="#451A03" strokeWidth="5" strokeLinecap="round" />
          <path d="M88 40 C 94 44, 92 54, 88 58" stroke="#451A03" strokeWidth="5" strokeLinecap="round" />

          {/* Leaf & Feather Headband (Korean prehistoric chieftain/child band) */}
          <path d="M34 32 C 48 27, 72 27, 86 32" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
          {/* Feather tucked in headband */}
          <path
            d="M74 30 C 82 18, 90 14, 94 10 C 90 18, 82 24, 76 30 Z"
            fill="#EF4444"
            stroke="#991B1B"
            strokeWidth="1.5"
          />

          {/* Face Elements depending on mood */}
          {mood === 'shocked' ? (
            <>
              {/* Wide shocked round eyes */}
              <circle cx="49" cy="44" r="7" fill="#FFFFFF" stroke="#451A03" strokeWidth="2" />
              <circle cx="49" cy="44" r="2.5" fill="#451A03" />
              <circle cx="71" cy="44" r="7" fill="#FFFFFF" stroke="#451A03" strokeWidth="2" />
              <circle cx="71" cy="44" r="2.5" fill="#451A03" />
              {/* Shocked wavy eyebrows */}
              <path d="M43 33 C 47 36, 51 32, 55 35" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
              <path d="M65 35 C 69 32, 73 36, 77 33" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
              {/* Big O-shaped mouth */}
              <ellipse cx="60" cy="58" rx="7" ry="10" fill="#78350F" stroke="#451A03" strokeWidth="2" />
              <ellipse cx="60" cy="62" rx="4" ry="4" fill="#EF4444" />
              {/* Pale shock lines */}
              <line x1="56" y1="48" x2="56" y2="52" stroke="#60A5FA" strokeWidth="1.5" />
              <line x1="64" y1="48" x2="64" y2="52" stroke="#60A5FA" strokeWidth="1.5" />
            </>
          ) : mood === 'cheer' || mood === 'happy' ? (
            <>
              {/* Happy squinting arch eyes */}
              <path d="M44 45 C 47 40, 53 40, 56 45" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
              <path d="M64 45 C 67 40, 73 40, 76 45" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
              {/* Rosy blushing cheeks */}
              <ellipse cx="42" cy="52" rx="5" ry="3.5" fill="#F87171" opacity="0.85" />
              <ellipse cx="78" cy="52" rx="5" ry="3.5" fill="#F87171" opacity="0.85" />
              {/* Big happy smile */}
              <path
                d="M48 53 C 52 64, 68 64, 72 53 Z"
                fill="#EF4444"
                stroke="#451A03"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path d="M52 56 C 56 59, 64 59, 68 56" stroke="#FECDD3" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Friendly large sparkling eyes */}
              <ellipse cx="49" cy="45" rx="4.5" ry="5.5" fill="#451A03" />
              <circle cx="47" cy="43" r="1.8" fill="#FFFFFF" />
              <ellipse cx="71" cy="45" rx="4.5" ry="5.5" fill="#451A03" />
              <circle cx="69" cy="43" r="1.8" fill="#FFFFFF" />
              {/* Rosy cheeks */}
              <ellipse cx="42" cy="51" rx="4" ry="2.5" fill="#F87171" opacity="0.6" />
              <ellipse cx="78" cy="51" rx="4" ry="2.5" fill="#F87171" opacity="0.6" />
              {/* Cute smile */}
              <path d="M52 54 C 56 59, 64 59, 68 54" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* Cute freckles */}
          <circle cx="45" cy="48" r="1" fill="#B45309" />
          <circle cx="75" cy="48" r="1" fill="#B45309" />
        </svg>
      </motion.div>
    </div>
  );
};
