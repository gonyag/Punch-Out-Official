import { useState, useEffect } from "react";
import { playClickSFX, playWhooshSFX } from "../lib/audio";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Detect mobile touch devices to turn off custom cursor (highly buggy on mobile touch screens otherwise)
    const checkViewportAndTouch = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
      setIsMobile(isTouch);
    };

    checkViewportAndTouch();
    window.addEventListener("resize", checkViewportAndTouch);

    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setIsClicked(true);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    // Attach listeners to buttons to scale cursor up and trigger a swoosh or click
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        "a, button, [role='button'], input[type='submit'], .map-card, .fighter-row"
      );

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          setIsHovered(true);
          playWhooshSFX();
        });
        el.addEventListener("mouseleave", () => {
          setIsHovered(false);
        });
        el.addEventListener("click", () => {
          playClickSFX();
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Initial attach and periodic poll (since React renders components dynamically)
    addHoverListeners();
    const interval = setInterval(addHoverListeners, 1500);

    return () => {
      window.removeEventListener("resize", checkViewportAndTouch);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      clearInterval(interval);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Dynamic Cursor Target Reticle */}
      <div
        className="pointer-events-none fixed z-100 -translate-x-1/2 -translate-y-1/2 transition-all duration-75 mix-blend-difference"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {/* Core center dot */}
        <div
          className={`rounded-full bg-white transition-all duration-200 ${
            isClicked ? "scale-50 bg-punch-red" : isHovered ? "scale-150 bg-punch-red" : "scale-100"
          } w-3 h-3`}
        />

        {/* Framing bracket container */}
        <div
          className={`absolute inset-0 -m-3 border rounded-full transition-all duration-300 ${
            isHovered
              ? "scale-150 border-punch-red animate-spin [animation-duration:4s] opacity-100"
              : "scale-100 border-white/40 opacity-50"
          }`}
          style={{ width: "24px", height: "24px" }}
        />

        {/* Hover label tip */}
        {isHovered && (
          <div className="absolute top-5 left-5 bg-punch-red text-white text-[9px] font-mono px-1 rounded-sm tracking-widest font-bold whitespace-nowrap shadow-[0_0_8px_rgba(255,45,45,0.8)]">
            ⚡ PUNCH!
          </div>
        )}
      </div>
    </>
  );
}
