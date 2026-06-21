import { useState, useEffect } from "react";
import { playPunchSFX } from "../lib/audio";

interface Shockwave {
  id: string;
  x: number;
  y: number;
  size: number;
}

export default function InteractiveRings() {
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const [ambientGlow, setAmbientGlow] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Mouse click shockwaves
    const handleGlobalClick = (e: MouseEvent) => {
      // Ignore click inside input fields and specific buttons if needed, but visually trigger everywhere except typical form components
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select")) return;

      const newShock = {
        id: Math.random().toString(36).substring(2, 9),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() > 0.7 ? 140 : 100, // randomized power
      };

      setShockwaves((prev) => [...prev, newShock]);

      // Play synthesized boxing punch! High variety
      const roll = Math.random();
      const punchType = roll > 0.85 ? "giant" : roll > 0.35 ? "heavy" : "light";
      playPunchSFX(punchType);

      // Automatic cleanup after animation finishes (600ms)
      setTimeout(() => {
        setShockwaves((prev) => prev.filter((item) => item.id !== newShock.id));
      }, 620);
    };

    // 2. Mouse follow ambient red highlight
    const handleMouseMove = (e: MouseEvent) => {
      setAmbientGlow({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousedown", handleGlobalClick);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleGlobalClick);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* 1. Global Ambient Mouse Glowing Spotlight */}
      <div
        className="pointer-events-none fixed z-20 w-[45vw] h-[45vw] rounded-full filter blur-[120px] opacity-15 mix-blend-screen transition-transform duration-300 ease-out hidden md:block"
        style={{
          background: "radial-gradient(circle, #FF2D2D 0%, transparent 70%)",
          left: ambientGlow.x - 45 * window.innerWidth / 200,
          top: ambientGlow.y - 45 * window.innerWidth / 200,
          transform: `translate(${ambientGlow.x * 0.05}px, ${ambientGlow.y * 0.05}px)`,
        }}
      />

      {/* 2. Visual Punch Shockwaves Container */}
      <div className="pointer-events-none fixed inset-0 z-50">
        {shockwaves.map((sw) => (
          <div
            key={sw.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-ping-once rounded-full flex items-center justify-center"
            style={{
              left: sw.x,
              top: sw.y,
              width: `${sw.size}px`,
              height: `${sw.size}px`,
            }}
          >
            {/* Outer expanding ring */}
            <div className="w-full h-full rounded-full border border-punch-red border-t-white opacity-90 scale-0 animate-expand-ring-outer" style={{ boxShadow: "0 0 20px #FF2D2D, inset 0 0 10px #FF2D2D" }} />
            {/* Inner secondary ring */}
            <div className="absolute w-[80%] h-[80%] rounded-full border border-white opacity-60 scale-0 animate-expand-ring-inner" />
            {/* Red center flash */}
            <div className="absolute w-[20%] h-[20%] rounded-full bg-punch-red opacity-80 filter blur-sm scale-150 animate-flash-fade" />
          </div>
        ))}
      </div>

      {/* Tailwind scoped inline keyframe injectors for expanding rings */}
      <style>{`
        @keyframes expandRingOuter {
          0% {
            transform: scale(0.1);
            opacity: 1;
            border-width: 4px;
          }
          100% {
            transform: scale(3.5);
            opacity: 0;
            border-width: 1px;
          }
        }
        @keyframes expandRingInner {
          0% {
            transform: scale(0.1);
            opacity: 0.8;
            border-dasharray: 4, 4;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(2.8);
            opacity: 0;
          }
        }
        @keyframes flashFade {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .animate-expand-ring-outer {
          animation: expandRingOuter 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        .animate-expand-ring-inner {
          animation: expandRingInner 0.48s cubic-bezier(0.2, 0.6, 0.4, 1) forwards;
        }
        .animate-flash-fade {
          animation: flashFade 0.35s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
      `}</style>
    </>
  );
}
