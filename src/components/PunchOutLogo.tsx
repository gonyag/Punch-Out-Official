import React from "react";

interface PunchOutLogoProps {
  className?: string;
  glow?: boolean;
}

export default function PunchOutLogo({ className = "w-full h-auto", glow = true }: PunchOutLogoProps) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 600 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(255,45,45,0.2)]"
      >
        {/* Filters and Gradients */}
        <defs>
          <linearGradient id="metallicWhite" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F5F5F7" />
            <stop offset="80%" stopColor="#E2E2E9" />
            <stop offset="100%" stopColor="#D1D1DB" />
          </linearGradient>
          
          <linearGradient id="neonRedGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF3E3E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#990000" stopOpacity="0.9" />
          </linearGradient>

          <filter id="vectorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Accent Glow Layer */}
        {glow && (
          <g filter="url(#vectorGlow)" opacity="0.6">
            <path
              d="M 160,8 H 40"
              stroke="#FF2D2D"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-pulse"
            />
            <path
              d="M 120,20 H 60"
              stroke="#FF2D2D"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* MAIN TEXT GROUP WITH SLANT SKEW (-14 DEG) */}
        <g transform="translate(15, 10)">
          {/* SPEED TRAILS FOR PUNCH (Top Left) */}
          <g opacity="0.9">
            {/* Trail Lines for P */}
            <line x1="30" y1="50" x2="120" y2="50" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="8, 12, 4" />
            <line x1="10" y1="70" x2="90" y2="70" stroke="#FFFFFF" strokeWidth="6" strokeDasharray="15, 10, 5" />
            <line x1="40" y1="90" x2="110" y2="90" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="12, 6, 2" />
            <line x1="20" y1="110" x2="100" y2="110" stroke="#FFFFFF" strokeWidth="5" strokeDasharray="30, 8, 4" strokeOpacity="0.7" />
            
            {/* Accent Red Speed Line under PUNCH */}
            <path
              d="M 200,123 L 80,123"
              stroke="#FF2D2D"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="40, 15, 10"
            />
          </g>

          {/* "PUNCH" Word */}
          <text
            x="110"
            y="110"
            fill="url(#metallicWhite)"
            stroke="#121212"
            strokeWidth="3.5"
            paintOrder="stroke"
            fontSize="108"
            fontWeight="900"
            fontFamily="Anton, sans-serif"
            fontStyle="italic"
            letterSpacing="2"
          >
            PUNCH
          </text>

          {/* SPEED TRAILS FOR OUT (Bottom Right / Left of O) */}
          <g opacity="0.8">
            {/* Trail lines for O */}
            <line x1="180" y1="160" x2="310" y2="160" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="10, 12" />
            <line x1="150" y1="180" x2="290" y2="180" stroke="#FFFFFF" strokeWidth="5.5" strokeDasharray="25, 15, 4" />
            <line x1="200" y1="200" x2="320" y2="200" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="8, 6, 2" strokeOpacity="0.6" />
            
            {/* Red glow highlight trail */}
            <line x1="240" y1="182" x2="300" y2="182" stroke="#FF2D2D" strokeWidth="2.5" />
          </g>

          {/* "OUT" Word */}
          <text
            x="310"
            y="200"
            fill="url(#metallicWhite)"
            stroke="#121212"
            strokeWidth="3.5"
            paintOrder="stroke"
            fontSize="96"
            fontWeight="900"
            fontFamily="Anton, sans-serif"
            fontStyle="italic"
            letterSpacing="3"
          >
            OUT
          </text>
        </g>

        {/* Epic Red Speed Slice Line across the whole logo (Decorative slash) */}
        <path
          d="M 100,50 L 530,190"
          stroke="#FF2D2D"
          strokeWidth="3.5"
          strokeDasharray="0 180 180 20 60 40 250"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Small speed dust flecks */}
        <circle cx="10" cy="150" r="1.5" fill="#FFFFFF" opacity="0.6" />
        <circle cx="580" cy="70" r="2" fill="#FF2D2D" opacity="0.8" />
        <circle cx="530" cy="40" r="1" fill="#FFFFFF" opacity="0.5" />
        <circle cx="140" cy="220" r="1.5" fill="#FF2D2D" opacity="0.4" />
      </svg>
    </div>
  );
}
