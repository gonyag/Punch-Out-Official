import { useState, useEffect } from "react";
import { Volume2, VolumeX, Radio } from "lucide-react";
import { setGlobalMute, isMuted, playClickSFX } from "../lib/audio";

export default function AudioControls() {
  const [muted, setMuted] = useState(isMuted());

  const handleToggle = () => {
    const nextState = !muted;
    setGlobalMute(nextState);
    setMuted(nextState);
    
    // Play snap click if unmuted
    if (!nextState) {
      setTimeout(() => {
        playClickSFX();
      }, 50);
    }
  };

  useEffect(() => {
    // Keep in sync with initial loads
    setMuted(isMuted());
  }, []);

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
      {/* Sound active status bar */}
      <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-all duration-300 ${
        !muted 
          ? "bg-punch-red/10 border-punch-red text-punch-red animate-pulse" 
          : "bg-zinc-900/40 border-zinc-800 text-zinc-500"
      }`}>
        <Radio className={`w-3.5 h-3.5 ${!muted ? "animate-spin" : ""}`} />
        <span>{!muted ? "CYBER SYNTH BEAT: ACTIVE" : "SYNTH AUDIO: OFF"}</span>
      </div>

      <button
        id="audio-toggle-btn"
        onClick={handleToggle}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 ${
          !muted
            ? "bg-punch-red border-punch-red text-white shadow-[0_0_15px_rgba(255,45,45,0.6)] animate-pulse"
            : "bg-black/80 border-zinc-700 text-zinc-400 hover:text-white hover:border-punch-red"
        }`}
        title={muted ? "Enable Synth Soundtrack & SFX" : "Mute Sound"}
      >
        {/* Button hover border ring */}
        <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-punch-red/30 scale-110 transition-all duration-300" />
        
        {muted ? (
          <VolumeX className="w-5 h-5 transition-transform group-hover:scale-110" />
        ) : (
          <Volume2 className="w-5 h-5 transition-transform group-hover:scale-110" />
        )}
      </button>
    </div>
  );
}
