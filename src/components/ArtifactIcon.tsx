import React from 'react';

interface ArtifactIconProps {
  name: string;
  size?: number | string;
  className?: string;
}

export const ArtifactIcon: React.FC<ArtifactIconProps> = ({ name, size = 64, className = '' }) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;
  const rawId = React.useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');

  switch (name) {
    case 'red_pottery':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Burnished luster aura & drop shadow */}
          <ellipse cx="50" cy="88" rx="28" ry="6" fill="#000000" fillOpacity="0.2" />
          {/* Main pot body */}
          <path
            d="M36 28 C 36 22, 40 18, 50 18 C 60 18, 64 22, 64 28 C 64 34, 76 42, 80 58 C 84 74, 72 86, 50 86 C 28 86, 16 74, 20 58 C 24 42, 36 34, 36 28 Z"
            fill={`url(#redPotGrad_${uid})`}
            stroke="#991B1B"
            strokeWidth="2.5"
          />
          {/* Neck rim */}
          <ellipse cx="50" cy="20" rx="14" ry="4" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="2" />
          {/* High gloss burnished highlight lines */}
          <path
            d="M28 54 C 30 46, 38 40, 42 38"
            stroke="#FCA5A5"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <ellipse cx="36" cy="62" rx="4" ry="8" fill="#FEE2E2" opacity="0.65" transform="rotate(-20 36 62)" />
          {/* Decorative handles */}
          <path
            d="M20 50 C 13 52, 13 62, 21 64"
            fill="none"
            stroke="#991B1B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M80 50 C 87 52, 87 62, 79 64"
            fill="none"
            stroke="#991B1B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <defs>
            <radialGradient id={`redPotGrad_${uid}`} cx="42%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="45%" stopColor="#DC2626" />
              <stop offset="85%" stopColor="#991B1B" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'stone_knife':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="86" rx="36" ry="6" fill="#000000" fillOpacity="0.2" />
          {/* Crescent Stone Blade Body */}
          <path
            d="M12 40 C 26 24, 74 24, 88 40 C 82 72, 18 72, 12 40 Z"
            fill={`url(#knifeGrad_${uid})`}
            stroke="#44403C"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Sharp Beveled Cutting Edge on the curved back */}
          <path
            d="M16 46 C 28 66, 72 66, 84 46"
            stroke="#E7E5E4"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Twine thread through the holes */}
          <path
            d="M36 44 C 36 26, 64 26, 64 44"
            stroke="#D97706"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="4 2"
          />
          {/* Finger holes */}
          <circle cx="38" cy="45" r="5" fill="#292524" stroke="#78716C" strokeWidth="2" />
          <circle cx="62" cy="45" r="5" fill="#292524" stroke="#78716C" strokeWidth="2" />
          {/* Polished stone texture flakes */}
          <path d="M26 34 L32 38" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round" />
          <path d="M70 34 L76 38" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id={`knifeGrad_${uid}`} x1="50" y1="26" x2="50" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A8A29E" />
              <stop offset="40%" stopColor="#78716C" />
              <stop offset="85%" stopColor="#57534E" />
              <stop offset="100%" stopColor="#292524" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'stone_dagger':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <ellipse cx="50" cy="92" rx="20" ry="4" fill="#000000" fillOpacity="0.2" />
          {/* Blade Spine Ridge */}
          <path
            d="M50 10 L62 55 L58 68 L54 88 L46 88 L42 68 L38 55 Z"
            fill={`url(#daggerGrad_${uid})`}
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Center Raised Rib (등대) */}
          <line x1="50" y1="12" x2="50" y2="84" stroke="#F1F5F9" strokeWidth="2.5" opacity="0.9" />
          {/* Left beveled facet */}
          <path d="M50 10 L38 55 L42 68 L46 86 L50 86 Z" fill="#94A3B8" fillOpacity="0.4" />
          {/* Stepped tang (손잡이 홈) */}
          <rect x="44" y="68" width="12" height="18" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="2" />
          {/* Pommel tip */}
          <circle cx="50" cy="88" r="4" fill="#334155" />
          {/* Razor sharp edge highlight */}
          <path d="M50 12 L61 54" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id={`daggerGrad_${uid}`} x1="38" y1="10" x2="62" y2="88" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="35%" stopColor="#94A3B8" />
              <stop offset="70%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'bronze_mirror':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <ellipse cx="50" cy="88" rx="34" ry="5" fill="#000000" fillOpacity="0.2" />
          {/* Main Disc */}
          <circle cx="50" cy="50" r="38" fill={`url(#bronzeGrad_${uid})`} stroke="#78350F" strokeWidth="3.5" />
          {/* Concentric rings */}
          <circle cx="50" cy="50" r="30" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="22" stroke="#B45309" strokeWidth="2" />
          <circle cx="50" cy="50" r="14" stroke="#D97706" strokeWidth="1.5" />
          {/* Coarse geometric chevron rays */}
          <path
            d="M32 32 L36 36 M68 32 L64 36 M32 68 L36 64 M68 68 L64 64 M50 20 L50 26 M50 74 L50 80 M20 50 L26 50 M74 50 L80 50"
            stroke="#FEF3C7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Two knobs (다뉴 - loop handles) */}
          <ellipse cx="44" cy="50" rx="3.5" ry="5" fill="#78350F" stroke="#FDE68A" strokeWidth="1.5" />
          <ellipse cx="56" cy="50" rx="3.5" ry="5" fill="#78350F" stroke="#FDE68A" strokeWidth="1.5" />
          {/* Golden shine sheen */}
          <path
            d="M24 38 C 34 26, 66 26, 76 38"
            stroke="#FFFBEB"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
          <defs>
            <radialGradient id={`bronzeGrad_${uid}`} cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="45%" stopColor="#D97706" />
              <stop offset="80%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'plain_pottery':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <ellipse cx="50" cy="88" rx="26" ry="5" fill="#000000" fillOpacity="0.2" />
          {/* Vessel body with sturdy flat base */}
          <path
            d="M32 20 L68 20 L76 52 C 78 70, 70 86, 62 86 L38 86 C 30 86, 22 70, 24 52 Z"
            fill={`url(#plainPotGrad_${uid})`}
            stroke="#78350F"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Flared rim */}
          <ellipse cx="50" cy="20" rx="19" ry="5" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
          {/* Subtle clay pottery texture horizontal comb traces */}
          <path d="M30 42 C 40 44, 60 44, 70 42" stroke="#B45309" strokeWidth="2" opacity="0.6" />
          <path d="M28 58 C 42 61, 58 61, 72 58" stroke="#B45309" strokeWidth="2" opacity="0.6" />
          <path d="M34 74 C 44 76, 56 76, 66 74" stroke="#B45309" strokeWidth="2" opacity="0.6" />
          {/* Light sheen */}
          <path d="M32 30 C 30 45, 34 65, 40 76" stroke="#FED7AA" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          <defs>
            <linearGradient id={`plainPotGrad_${uid}`} x1="24" y1="20" x2="76" y2="86" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="35%" stopColor="#EA580C" />
              <stop offset="80%" stopColor="#C2410C" />
              <stop offset="100%" stopColor="#7C2D12" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'gogok_jade':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <ellipse cx="50" cy="88" rx="26" ry="5" fill="#000000" fillOpacity="0.2" />
          {/* Curved comma shaped jade body */}
          <path
            d="M48 18 C 66 18, 80 32, 80 50 C 80 72, 58 84, 40 84 C 28 84, 24 74, 30 64 C 36 54, 48 56, 54 52 C 58 48, 56 40, 50 36 C 42 32, 36 38, 32 32 C 30 26, 38 18, 48 18 Z"
            fill={`url(#jadeGrad_${uid})`}
            stroke="#065F46"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Perforation hole for cord */}
          <circle cx="56" cy="30" r="5" fill="#064E3B" stroke="#047857" strokeWidth="2" />
          {/* Translucent jade gleam */}
          <path
            d="M66 32 C 74 40, 74 58, 66 68"
            stroke="#A7F3D0"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.9"
          />
          <ellipse cx="44" cy="74" rx="4" ry="3" fill="#ECFDF5" opacity="0.85" />
          <defs>
            <radialGradient id={`jadeGrad_${uid}`} cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="45%" stopColor="#10B981" />
              <stop offset="85%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064E3B" />
            </radialGradient>
          </defs>
        </svg>
      );

    default:
      return null;
  }
};
