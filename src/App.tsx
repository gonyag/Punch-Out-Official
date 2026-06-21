import { useState, useEffect, useRef } from "react";
import { 
  Trophy, 
  Play, 
  Flame, 
  Users, 
  Activity, 
  Compass, 
  Target, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Lock, 
  Crown, 
  Tv, 
  Volume2, 
  Gamepad2, 
  Sparkles,
  Info
} from "lucide-react";

// Procedural synthesized audio
import { playClickSFX, playWhooshSFX, playSuccessSFX, isMuted } from "./lib/audio";

// Relative assets
import heroBg from "./assets/images/punch_out_hero_banner_1781997165973.jpg";
import warehouseBg from "./assets/images/underground_ring_arena_1781997182342.jpg";

// Datasets
import { gameSteps, gameFeatures, battlefields, topFighters, faqs } from "./data";

// Sub-components
import PunchOutLogo from "./components/PunchOutLogo";
import AudioControls from "./components/AudioControls";
import InteractiveRings from "./components/InteractiveRings";
import CustomCursor from "./components/CustomCursor";

export default function App() {
  // Loading screen states
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingScale, setLoadingScale] = useState(1);

  // Stats Counters
  const [serversOnline, setServersOnline] = useState(58);
  const [playersFighting, setPlayersFighting] = useState(12402);
  const [punchesToday, setPunchesToday] = useState(5481232);

  // Active Map Selector
  const [activeMapId, setActiveMapId] = useState("rooftop");

  // FAQ Accordion Toggle list
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  // Scroll depth progress bar
  const [scrollPercentage, setScrollPercentage] = useState(0);

  // Mock trailer / cinematic theater camera controller
  const [activeCam, setActiveCam] = useState<"front" | "tracking" | "ko">("front");
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

  // Scroll offset for subtle parallax
  const [scrollY, setScrollY] = useState(0);

  // References for count animation triggers
  useEffect(() => {
    // 1. Core loading screen timeline (0% -> 100%)
    if (isLoading) {
      const intervals = [0, 25, 50, 75, 100];
      let currentIndex = 0;

      const timerIdx = setInterval(() => {
        if (currentIndex < intervals.length - 1) {
          currentIndex++;
          const targetProgress = intervals[currentIndex];
          
          // Animate counter upwards
          setLoadingProgress(targetProgress);
          
          if (targetProgress === 100) {
            clearInterval(timerIdx);
            
            // Wait brief moment for completion visual flair
            setTimeout(() => {
              playSuccessSFX();
              setLoadingScale(1.15); // dramatic expansion
              
              setTimeout(() => {
                setIsLoading(false);
              }, 450); // fade transition
            }, 600);
          }
        }
      }, 420); // sequential loading

      return () => clearInterval(timerIdx);
    }
  }, [isLoading]);

  // Handle active status tickers
  useEffect(() => {
    if (isLoading) return;

    // Simulate fluctuating Roblox multiplayer counts in real-time
    const tickerInterval = setInterval(() => {
      setPlayersFighting((prev) => {
        const delta = Math.floor(Math.random() * 21) - 10;
        return Math.max(12200, prev + delta);
      });

      setPunchesToday((prev) => {
        const hits = Math.ceil(Math.random() * 4);
        return prev + hits;
      });

      // Servers online fluctuate slightly
      if (Math.random() > 0.9) {
        setServersOnline((prev) => {
          const delta = Math.random() > 0.5 ? 1 : -1;
          return Math.max(50, prev + delta);
        });
      }
    }, 1800);

    return () => clearInterval(tickerInterval);
  }, [isLoading]);

  // Handle scroll offsets
  useEffect(() => {
    if (isLoading) return;

    const handleScroll = () => {
      // Set scroll percentage for top progress indicator
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollPercentage(progress);

      // Parallax helper
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  // Sound play triggers on clicking standard links
  const playClickSfxHandler = () => {
    playClickSFX();
  };

  const playHoverSfxHandler = () => {
    playWhooshSFX();
  };

  // Get active battlefield item details
  const activeBattlefield = battlefields.find((b) => b.id === activeMapId) || battlefields[1];

  // Map preview backgrounds
  const getMapImage = (mapId: string, originalUrl: string) => {
    if (mapId === "rooftop") return heroBg;
    if (mapId === "warehouse") return warehouseBg;
    return originalUrl;
  };

  if (isLoading) {
    return (
      <div 
        className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#000000] overflow-hidden select-none transition-all duration-500 ease-in-out"
        style={{
          opacity: loadingScale === 1.15 ? 0 : 1,
          transform: `scale(${loadingScale})`,
        }}
      >
        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(255,45,45,0.08) 0%, transparent 60%)" />
        
        {/* Glowing visual speedlines background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none speedlines-overlay animate-pulse" />

        <div className="relative flex flex-col items-center z-10 scale-95 md:scale-100">
          <PunchOutLogo className="w-[320px] md:w-[480px] h-auto drop-shadow-[0_0_30px_rgba(255,45,45,0.3)]" glow={true} />

          {/* Epic Cyber Progress Meter */}
          <div className="mt-12 flex flex-col items-center gap-4 w-64 md:w-80">
            <div className="flex justify-between w-full text-xs font-mono tracking-widest text-[#FF2D2D]/80">
              <span className="font-bold">INITIALIZING COMBAT ENGINE</span>
              <span className="font-semibold">{loadingProgress}%</span>
            </div>

            {/* Micro horizontal progress slots */}
            <div className="relative w-full h-[6px] bg-zinc-950 rounded-full overflow-hidden border border-zinc-900 flex p-[1px]">
              <div 
                className="h-full bg-gradient-to-r from-red-600 via-[#FF2D2D] to-white rounded-full transition-all duration-300 shadow-[0_0_10px_#FF2D2D]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            {/* Cinematic Loader Indicator */}
            <div className="mt-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest animate-pulse">
              LOADING COMPTON METRIC CHASSIS...
            </div>
          </div>
        </div>

        {/* Framing Corner Decals */}
        <div className="absolute top-8 left-8 border-t border-l border-zinc-800 w-8 h-8 pointer-events-none" />
        <div className="absolute top-8 right-8 border-t border-r border-zinc-800 w-8 h-8 pointer-events-none" />
        <div className="absolute bottom-8 left-8 border-b border-l border-zinc-800 w-8 h-8 pointer-events-none" />
        <div className="absolute bottom-8 right-8 border-b border-r border-zinc-800 w-8 h-8 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-punch-red selection:text-white" id="main-content">
      {/* 1. Interactive Shockwaves & Global Cursor & Glowing Spotlight */}
      <InteractiveRings />
      <CustomCursor />
      <AudioControls />

      {/* 2. Scroll Progress Bar on top of screen */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-punch-red via-white to-punch-red z-50 transition-all duration-100 ease-out shadow-[0_0_8px_rgba(255,45,45,0.8)]"
        style={{ width: `${scrollPercentage}%` }}
      />

      {/* 3. Globals Scanline Effect overlay for absolute gaming visual immersion */}
      <div className="pointer-events-none fixed inset-0 z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] opacity-35" />

      {/* 4. Global Header Navigation Bar */}
      <header className="absolute top-0 left-0 w-full z-30 px-6 py-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Micro Mini Logo in header */}
          <div className="w-24 h-auto transform skew-x-[-10deg] duration-300 hover:skew-x-[0deg]">
            <PunchOutLogo className="w-full" glow={false} />
          </div>
        </div>

        {/* Minimal Navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-mono tracking-widest text-zinc-400">
          <a href="#how-it-works" onClick={playClickSfxHandler} className="hover:text-punch-red transition-colors duration-200">HOW IT WORKS</a>
          <a href="#features" onClick={playClickSfxHandler} className="hover:text-punch-red transition-colors duration-200">FEATURES</a>
          <a href="#battlefields" onClick={playClickSfxHandler} className="hover:text-punch-red transition-colors duration-200">ARENAS</a>
          <a href="#leaderboard" onClick={playClickSfxHandler} className="hover:text-punch-red transition-colors duration-200">TOP FIGHTERS</a>
          <a href="#trailer" onClick={playClickSfxHandler} className="hover:text-punch-red transition-colors duration-200">WATCH ACTIONS</a>
          <a href="#faq" onClick={playClickSfxHandler} className="hover:text-punch-red transition-colors duration-200">FAQS</a>
        </nav>

        {/* Direct Play button */}
        <div>
          <a 
            href="https://www.roblox.com" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={playClickSfxHandler}
            onMouseEnter={playHoverSfxHandler}
            className="relative px-6 py-2.5 rounded-sm border border-punch-red/50 bg-punch-red bg-opacity-10 hover:bg-opacity-100 hover:border-punch-red transition-all duration-300 font-bold font-orbitron text-xs tracking-wider text-white flex items-center gap-2 shadow-[0_0_10px_rgba(255,45,45,0.15)] hover:shadow-[0_0_20px_rgba(255,45,45,0.4)]"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>PLAY ON ROBLOX</span>
          </a>
        </div>
      </header>

      {/* 5. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-16">
        {/* Parallax Background generated image with cinematic filters */}
        <div 
          className="absolute inset-0 bg-cover bg-center select-none"
          style={{
            backgroundImage: `url(${heroBg})`,
            transform: `translateY(${scrollY * 0.2}px) scale(1.05)`,
            filter: "brightness(0.3) contrast(1.1) saturate(1.1)",
          }}
        />

        {/* Dynamic Vignette Masking Cover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_100%)] opacity-85" />

        {/* Speedline particles flying across */}
        <div className="absolute inset-0 opacity-15 pointer-events-none speedlines-overlay animate-[speed-lines_0.8s_linear_infinite]" />

        {/* Hero visual content frame */}
        <div className="relative z-10 flex flex-col items-center max-w-4xl px-4 mt-8">
          {/* Arena status tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-950/90 border border-[#FF2D2D]/30 text-[#FF2D2D] rounded-full text-[10px] font-mono tracking-widest mb-6 uppercase shadow-[0_0_8px_rgba(255,45,45,0.2)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-punch-red" />
            <span>AAA MULTIPLAYER ROBLOX EXPERIENCE OUT NOW</span>
          </div>

          {/* Epic Centered Styled Logo */}
          <PunchOutLogo className="w-[340px] md:w-[620px] lg:w-[720px] h-auto mb-4 drop-shadow-[0_0_25px_rgba(255,45,45,0.2)]" />

          {/* Slogan with intense metallic look */}
          <h2 className="font-bebas text-3xl md:text-5xl lg:text-6xl text-white tracking-widest uppercase mb-4 text-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            "PUNCH HARD, <span className="text-punch-red font-bold">PUNCH OUT.</span>"
          </h2>

          <p className="font-orbitron font-extrabold text-[#FF2D2D] tracking-[0.25em] text-sm md:text-xl lg:text-2xl mb-8 flex items-center gap-4">
            <span>NO GUNS</span>
            <span className="text-zinc-600 text-sm">•</span>
            <span>NO SUPERPOWERS</span>
            <span className="text-zinc-600 text-sm">•</span>
            <span>JUST FISTS</span>
          </p>

          {/* Combat CTAs Layout */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
            <a 
              href="https://www.roblox.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSfxHandler}
              onMouseEnter={playHoverSfxHandler}
              className="w-full sm:w-56 py-4 px-8 rounded-sm text-center font-orbitron font-extrabold text-sm tracking-widest text-black bg-[#FF2D2D] border border-transparent shadow-[0_0_25px_rgba(255,45,45,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 hover:bg-white"
            >
              <Gamepad2 className="w-5 h-5 animate-bounce" />
              <span>PLAY NOW</span>
            </a>

            <a 
              href="#trailer"
              onClick={playClickSfxHandler}
              onMouseEnter={playHoverSfxHandler}
              className="w-full sm:w-56 py-4 px-8 rounded-sm text-center font-orbitron font-semibold text-sm tracking-widest text-white bg-transparent border border-zinc-700 hover:border-punch-red hover:bg-punch-red/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-punch-red" />
              <span>WATCH TRAILER</span>
            </a>

            <a 
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSfxHandler}
              onMouseEnter={playHoverSfxHandler}
              className="w-full sm:w-56 py-4 px-8 rounded-sm text-center font-orbitron font-semibold text-sm tracking-widest text-zinc-400 bg-zinc-950/60 border border-zinc-800 hover:border-zinc-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>DISCORD</span>
            </a>
          </div>
        </div>

        {/* 6. HERO BOTTOM LIVE STATUS BAR */}
        <div className="absolute bottom-0 left-0 w-full z-25 bg-gradient-to-t from-black via-zinc-950/95 to-transparent border-t border-zinc-900 px-6 md:px-12 py-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            
            {/* Servers Online Column */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-punch-red/10 rounded-sm border border-punch-red/30 text-punch-red">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-mono text-zinc-500 tracking-wider">🟢 CONNECTED SERVERS</div>
                <div className="font-orbitron font-black text-2xl text-white tracking-wider">
                  {serversOnline.toLocaleString()} <span className="text-[10px] text-zinc-500 font-mono">ONLINE</span>
                </div>
              </div>
            </div>

            {/* Players Fighting Column */}
            <div className="flex items-center justify-center md:justify-start gap-4 border-y md:border-y-0 md:border-x border-zinc-900 py-4 md:py-0 md:px-8">
              <div className="p-3 bg-punch-red/10 rounded-sm border border-punch-red/30 text-punch-red">
                <Users className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-mono text-zinc-500 tracking-wider">🟢 PLAYERS FIGHTING</div>
                <div className="font-orbitron font-black text-2xl text-white tracking-wider animate-pulse">
                  {playersFighting.toLocaleString()} <span className="text-[10px] text-zinc-500 font-mono">MATCHING</span>
                </div>
              </div>
            </div>

            {/* Total Punches Today Column */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-punch-red/10 rounded-sm border border-punch-red/30 text-punch-red">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono text-zinc-500 tracking-wider">🟢 PUNCHES LANDED TODAY</div>
                <div className="font-orbitron font-black text-2xl text-punch-red tracking-wider">
                  {punchesToday.toLocaleString()}{" "}
                  <span className="text-[9px] text-zinc-400 font-mono animate-pulse">COLLISIONS</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. GAME PLAY SECTION (HOW IT WORKS) */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-black border-t border-zinc-900 relative">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="font-bebas text-5xl md:text-7xl tracking-widest uppercase text-white mb-2">
              HOW IT <span className="text-punch-red">WORKS</span>
            </h3>
            <p className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
              // NO MECHANIC DRIFT. NO MAGIC. 3 STEPS TO DOMINANCE.
            </p>
          </div>

          {/* 3 Steps dynamic container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {gameSteps.map((step, idx) => (
              <div 
                key={step.number}
                className="group relative flex flex-col p-8 rounded-sm glass-panel border border-zinc-800 overflow-hidden transform transition-all duration-300 hover:translate-y-[-8px] hover:border-punch-red/40"
              >
                {/* Visual Corner Indicator */}
                <div className="absolute top-0 right-0 p-4 font-orbitron font-black text-6xl text-zinc-900 group-hover:text-punch-red/10 select-none transition-colors duration-300">
                  {step.number}
                </div>

                <div className="text-4xl mb-6">{step.icon}</div>

                <h4 className="font-orbitron font-bold text-lg tracking-wider text-white mb-4 group-hover:text-punch-red transition-colors duration-300">
                  {step.title}
                </h4>

                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  {step.description}
                </p>

                {/* Sub corner border ticks */}
                <div className="absolute bottom-0 left-0 w-6 h-[2px] bg-zinc-800 group-hover:bg-punch-red transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-[2px] h-6 bg-zinc-800 group-hover:bg-punch-red transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. GAME FEATURES SECTION (WHY PLAY?) */}
      <section id="features" className="py-24 px-6 md:px-12 bg-zinc-950/70 relative border-t border-zinc-900">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="font-bebas text-5xl md:text-7xl tracking-widest uppercase text-white mb-2">
              WHY PLAY <span className="text-punch-red">PUNCH OUT?</span>
            </h3>
            <p className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
              // DESIGNED FOR HARDCORE PURISTS AND FAST APEX MATCHMAKING
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameFeatures.map((feat) => (
              <div 
                key={feat.id}
                className="group p-6 rounded-sm bg-zinc-900/40 border border-zinc-800/80 hover:border-punch-red/40 hover:bg-zinc-950/80 transition-all duration-300 shadow-lg relative flex flex-col justify-between"
              >
                {/* Glowing neon red radial glow inside glassmorphic panel */}
                <div className="absolute inset-0 bg-radial-gradient(circle_at_top_right, rgba(255,45,45,0.03), transparent 50%) opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="w-12 h-12 rounded-sm bg-zinc-950 flex items-center justify-center border border-zinc-800 mb-6 font-semibold group-hover:border-punch-red text-xl transition-all duration-300 text-punch-red shadow-inner">
                    <span>{feat.icon}</span>
                  </div>

                  <h4 className="font-orbitron font-extrabold text-[#F5F5F7] tracking-wider mb-3">
                    {feat.title.toUpperCase()}
                  </h4>

                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    {feat.description}
                  </p>
                </div>

                {/* Arrow hint icon */}
                <div className="mt-6 font-mono text-[9px] text-zinc-650 flex items-center gap-1.5 justify-end">
                  <span>COMBAT PROTOCOL SECURED</span>
                  <span className="w-1 h-1 rounded-full bg-punch-red" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BATTLEFIELDS (ARENAS SECTION) */}
      <section id="battlefields" className="py-24 px-6 md:px-12 bg-black border-t border-zinc-900 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center lg:text-left mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h3 className="font-bebas text-5xl md:text-7xl tracking-widest uppercase text-white mb-2">
                CHOOSE YOUR <span className="text-punch-red">BATTLEFIELD</span>
              </h3>
              <p className="font-mono text-xs text-zinc-550 tracking-widest uppercase">
                // ACTIVE WAR PREVIEWS • RECOGNIZED COMBAT MAPS
              </p>
            </div>

            {/* Arena stats indicator */}
            <div className="flex justify-center flex-wrap items-center gap-4 text-xs font-mono bg-zinc-950 p-4 border border-zinc-900 rounded-sm">
              <span className="text-punch-red font-bold">🗺️ 6 MAPS LOADED</span>
              <span className="text-zinc-650">|</span>
              <span className="text-[#FF2D2D]/80">⚠️ WARNING: NO ESCAPE ZONES</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* LEFT COLUMN: Map Tabs List */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              {battlefields.map((field) => (
                <button
                  key={field.id}
                  onClick={() => {
                    setActiveMapId(field.id);
                    playClickSFX();
                  }}
                  onMouseEnter={playHoverSfxHandler}
                  className={`w-full text-left p-4 rounded-sm border transition-all duration-300 flex items-center justify-between ${
                    activeMapId === field.id
                      ? "bg-punch-red text-white border-punch-red shadow-[0_0_15px_rgba(255,45,45,0.3)] transform translate-x-1"
                      : "bg-[#0b0b0b] text-zinc-400 border-zinc-900 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  <span className="font-orbitron font-extrabold text-xs tracking-widest">{field.name.toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 py-0.5 font-mono font-black ${
                      field.dangerLevel === "CRITICAL"
                        ? "bg-black text-punch-red"
                        : field.dangerLevel === "HIGH"
                        ? "bg-[#111] text-[#FF2D2D]"
                        : "bg-black text-zinc-400"
                    }`}>
                      {field.dangerLevel}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* RIGHT COLUMN: Large Active Map HUD Card Preview */}
            <div className="lg:col-span-8 flex">
              <div className="relative w-full rounded-sm glass-panel-heavy border border-zinc-800 overflow-hidden flex flex-col justify-between p-6 md:p-8 min-h-[460px]">
                
                {/* Background image preview */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 select-none brightness-[0.25] group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${getMapImage(activeBattlefield.id, activeBattlefield.imageUrl)})`,
                  }}
                />

                {/* Corner grid designs representing strategic radar screens */}
                <div className="absolute top-4 right-4 text-zinc-600 font-mono text-[9px] tracking-wider text-right hidden sm:block">
                  <div>LAT_GRID: 35.12N • COMP</div>
                  <div>TACTICAL STAGE FEED AVAILABLE</div>
                </div>

                <div className="relative z-10">
                  <span className="px-3 py-1 bg-punch-red text-white font-mono text-[10px] font-bold tracking-widest rounded-sm shadow-md uppercase">
                    🌋 SPEC: ACTIVE ZONE
                  </span>
                  
                  <h4 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-white tracking-wider mt-6 mb-2">
                    {activeBattlefield.name}
                  </h4>

                  <p className="text-zinc-300 text-sm max-w-xl font-light leading-relaxed mb-6">
                    {activeBattlefield.description}
                  </p>
                </div>

                {/* Sub radar panel with technical breakdown info */}
                <div className="relative z-10 pt-6 mt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 uppercase">ENVIRONMENT HAZARDS:</span>
                    <div className="text-white font-bold tracking-wider mt-1 text-punch-red flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{activeBattlefield.mechanics}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-500 uppercase">WARNING THREAT LEVEL:</span>
                    <div className={`font-black tracking-widest mt-1 text-right sm:text-left ${
                      activeBattlefield.dangerLevel === "CRITICAL"
                        ? "text-red-500 animate-pulse"
                        : "text-zinc-300"
                    }`}>
                      🚨 STATS // {activeBattlefield.dangerLevel}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 10. ONLY ONE RULE SECTION */}
      <section className="relative py-32 px-6 md:px-12 bg-[#000000] overflow-hidden text-center border-t border-zinc-900">
        <div className="absolute inset-0 opacity-15 pointer-events-none speedlines-overlay animate-pulse" />
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center, rgba(255,45,45,0.06) 0%, transparent 65%)" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <span className="bg-punch-red/10 border border-punch-red text-punch-red px-4 py-1 font-mono text-[10px] tracking-[0.2em] uppercase rounded-sm mb-4">
            LAW OF THE STREETS
          </span>

          <h3 className="font-bebas text-5xl md:text-6xl tracking-widest uppercase text-white mb-6">
            THERE IS ONLY <span className="text-punch-red">ONE RULE</span>
          </h3>

          {/* Huge decorative Text overlay with glowing text */}
          <div className="relative select-none my-6 transform transition-all duration-300 hover:scale-105">
            <h1 className="font-anton italic font-black text-[120px] md:text-[200px] leading-none text-white tracking-widest drop-shadow-[0_0_50px_rgba(255,45,45,0.8)] filter opacity-100 uppercase">
              PUNCH
            </h1>
            <div className="absolute -inset-2 bg-gradient-to-r from-punch-red to-orange-500 filter blur-3xl opacity-20" />
          </div>

          <div className="text-xs font-mono text-zinc-400 tracking-widest space-y-3 uppercase max-w-md bg-zinc-950 p-6 border border-zinc-900 rounded-sm">
            <p className="flex items-center justify-between">
              <span>1. KNOCK PLAYERS AWAY</span>
              <span className="text-punch-red">✔</span>
            </p>
            <p className="flex items-center justify-between">
              <span>2. STAY ALIVE</span>
              <span className="text-punch-red">✔</span>
            </p>
            <p className="flex items-center justify-between">
              <span>3. LAST FIGHTER STANDING WINS</span>
              <span className="text-punch-red">🏆</span>
            </p>
          </div>
        </div>
      </section>

      {/* 11. STATS SECTION (BY THE NUMBERS) */}
      <section className="py-20 px-6 bg-zinc-950 border-t border-zinc-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center items-center">
            
            <div className="p-6">
              <div className="font-bebas text-5xl md:text-6xl text-white tracking-wider glow-hover inline-block">100,000+</div>
              <div className="font-orbitron font-semibold text-xs text-zinc-500 tracking-widest uppercase mt-2">MATCHES COMPLETED</div>
            </div>

            <div className="p-6 border-t sm:border-t-0 sm:border-l border-zinc-900">
              <div className="font-bebas text-5xl md:text-6xl text-punch-red tracking-wider inline-block">5,000,000+</div>
              <div className="font-orbitron font-semibold text-xs text-zinc-500 tracking-widest uppercase mt-2">TOTAL PLACED BLOWS</div>
            </div>

            <div className="p-6 border-t lg:border-t-0 lg:border-l border-zinc-900">
              <div className="font-bebas text-5xl md:text-6xl text-white tracking-wider inline-block">10,000+</div>
              <div className="font-orbitron font-semibold text-xs text-zinc-500 tracking-widest uppercase mt-2">CHAMPION VICTORIES</div>
            </div>

            <div className="p-6 border-t lg:border-t-0 lg:border-l border-zinc-900">
              <div className="font-bebas text-5xl md:text-6xl text-punch-red tracking-wider inline-block">1 GOAL</div>
              <div className="font-orbitron font-extrabold text-xs text-white tracking-widest uppercase mt-2">RULE THE LEADERBOARD</div>
            </div>

          </div>
        </div>
      </section>

      {/* 12. TOP FIGHTERS (LEADERBOARD SECTION) */}
      <section id="leaderboard" className="py-24 px-6 md:px-12 bg-black border-t border-zinc-900 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <h3 className="font-bebas text-5xl md:text-7xl tracking-widest uppercase text-white mb-2">
              TOP <span className="text-punch-red">FIGHTERS</span>
            </h3>
            <p className="font-mono text-xs text-zinc-550 tracking-widest uppercase">
              // DAILY LEADERBOARD SYNC FROM THE ROBLOX DATA BASES
            </p>
          </div>

          {/* Podium Top 3 Cards display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-16 max-w-5xl mx-auto">
            
            {/* 2nd Place Card */}
            <div className="order-2 lg:order-1 flex flex-col items-center">
              <div className="w-full text-center p-6 bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-900 rounded-sm hover:border-zinc-800 transition-all duration-300 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-400 text-black font-orbitron font-black text-sm flex items-center justify-center shadow-md">
                  2ND
                </div>
                
                <h4 className="font-bebas text-2xl text-white mt-4">{topFighters[1].username}</h4>
                <div className="font-mono text-[10px] text-punch-red tracking-widest mb-4">{topFighters[1].title}</div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-950 pt-4 text-xs font-mono text-zinc-400">
                  <div>
                    <span className="text-[9px] text-zinc-600 block">WIN RATE</span>
                    <span className="font-black text-white">{topFighters[1].winRate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-600 block">TOTAL BLOWS</span>
                    <span className="font-black text-punch-red">{topFighters[1].punches.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1st Place Card (Largest with Crown decal) */}
            <div className="order-1 lg:order-2 flex flex-col items-center">
              <div className="w-full text-center p-8 bg-gradient-to-b from-zinc-950 to-zinc-900 border border-punch-red/40 rounded-sm relative scale-102 lg:scale-105 shadow-[0_0_30px_rgba(255,45,45,0.15)]">
                
                {/* Crown Decal */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center">
                  <Crown className="w-8 h-8 text-yellow-500 fill-current drop-shadow-[0_0_10px_#EAB308]" />
                  <span className="text-[9px] text-yellow-500 font-orbitron font-extrabold tracking-wider bg-black px-2 py-0.5 rounded-sm border border-yellow-500/50 mt-1">1ST PLACE</span>
                </div>

                <h4 className="font-bebas text-3xl text-white mt-4">{topFighters[0].username}</h4>
                <div className="font-mono text-[10px] text-yellow-500 tracking-widest mb-4 font-bold">{topFighters[0].title}</div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-850 pt-4 text-xs font-mono text-zinc-300">
                  <div>
                    <span className="text-[9px] text-zinc-500 block">WIN RATE</span>
                    <span className="font-black text-white">{topFighters[0].winRate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 block">TOTAL BLOWS</span>
                    <span className="font-black text-[#FF2D2D]">{topFighters[0].punches.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd Place Card */}
            <div className="order-3 flex flex-col items-center">
              <div className="w-full text-center p-6 bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-900 rounded-sm hover:border-zinc-800 transition-all duration-300 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-amber-700 text-white font-orbitron font-black text-sm flex items-center justify-center shadow-md">
                  3RD
                </div>

                <h4 className="font-bebas text-2xl text-white mt-4">{topFighters[2].username}</h4>
                <div className="font-mono text-[10px] text-orange-500 tracking-widest mb-4">{topFighters[2].title}</div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-950 pt-4 text-xs font-mono text-zinc-400">
                  <div>
                    <span className="text-[9px] text-zinc-600 block">WIN RATE</span>
                    <span className="font-black text-white">{topFighters[2].winRate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-600 block">TOTAL BLOWS</span>
                    <span className="font-black text-punch-red">{topFighters[2].punches.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Leaderboard Table rows for ranks 4-7 */}
          <div className="max-w-4xl mx-auto glass-panel border border-zinc-900 rounded-sm overflow-hidden">
            <div className="grid grid-cols-12 bg-zinc-950 px-6 py-3 font-mono text-[10px] text-zinc-500 tracking-widest uppercase border-b border-zinc-900 select-none">
              <div className="col-span-2">RANK</div>
              <div className="col-span-4">FIGHTER ACCOUNT</div>
              <div className="col-span-3 text-right">TOTAL COLLISION PUNS</div>
              <div className="col-span-3 text-right">WIN FRACTION</div>
            </div>

            <div className="divide-y divide-zinc-900/50">
              {topFighters.slice(3).map((f) => (
                <div 
                  key={f.rank}
                  className="grid grid-cols-12 px-6 py-4 items-center text-xs font-mono text-zinc-300 hover:bg-zinc-900/20 transition-all duration-150 rounded-sm border border-transparent hover:border-zinc-900/50 fighter-row"
                >
                  <div className="col-span-2 text-zinc-500 font-bold font-orbitron">#{f.rank}</div>
                  <div className="col-span-4 flex flex-col">
                    <span className="text-white font-bold">{f.username}</span>
                    <span className="text-[9px] text-zinc-500 tracking-wider mt-0.5">{f.title}</span>
                  </div>
                  <div className="col-span-3 text-right text-punch-red font-bold">{f.punches.toLocaleString()}</div>
                  <div className="col-span-3 text-right text-white font-semibold">{f.winRate}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 13. TRAILER THEATER SECTION (WATCH THE ACTION) */}
      <section id="trailer" className="py-24 px-6 md:px-12 bg-zinc-950 border-t border-zinc-900 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <h3 className="font-bebas text-5xl md:text-7xl tracking-widest uppercase text-white mb-2">
              WATCH THE <span className="text-punch-red">ACTION</span>
            </h3>
            <p className="font-mono text-xs text-zinc-550 tracking-widest uppercase">
              // SWITCH CAM FEEDS • LIVE GAMEPLAY SNAPSHOTS
            </p>
          </div>

          {/* Interactive Cinematic Sandbox Deck */}
          <div className="relative rounded-sm bg-black border border-zinc-850 p-3 shadow-2xl">
            <div className="relative aspect-video max-h-[580px] w-full bg-zinc-950 rounded-sm overflow-hidden">
              
              {/* Retro scanline video filter overlay on action feed */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-white/10 shadow-[0_0_10px_white] z-10 animate-scanline pointer-events-none" />

              {/* Live camera status display watermark */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/80 font-mono text-[9px] px-2 py-1 border border-zinc-800 rounded-xs select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-punch-red animate-ping" />
                <span className="text-zinc-400">LIVE FEED CAM: <span className="text-[#FF2D2D] font-bold">FE_CHASSIS_{activeCam.toUpperCase()}</span></span>
              </div>

              {/* Dynamic Camera Feed Simulation */}
              <div className="w-full h-full relative select-none">
                {activeCam === "front" && (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <img 
                      src={heroBg} 
                      alt="Front Dynamic Combat" 
                      className="w-full h-full object-cover brightness-50 contrast-115 transform scale-102"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                    
                    {/* Simulated visual combat HUD overlay */}
                    {!isTrailerPlaying && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40">
                        <button 
                          onClick={() => {
                            setIsTrailerPlaying(true);
                            playClickSFX();
                          }}
                          className="w-20 h-20 rounded-full bg-punch-red text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_30px_#FF2D2D] hover:scale-110 active:scale-95 border border-transparent hover:border-punch-red transform"
                        >
                          <Play className="w-8 h-8 fill-current ml-1" />
                        </button>
                        <span className="mt-4 font-orbitron font-extrabold text-[#FF2D2D] text-xs tracking-widest">TAP TO LAUNCH CINEMATIC STREAM</span>
                      </div>
                    )}
                  </div>
                )}

                {activeCam === "tracking" && (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <img 
                      src={warehouseBg} 
                      alt="Tracking Combat Feed" 
                      className="w-full h-full object-cover brightness-40 contrast-125 saturate-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute inset-10 border border-white/5 flex flex-col justify-between p-4 pointer-events-none">
                      <div className="flex justify-between font-mono text-[9px] text-[#FF2D2D] opacity-60">
                        <span>[TRK_ACTIVE_FOCUS_SEC]</span>
                        <span>AZ_ANGLE: 43.12 DEG</span>
                      </div>
                      <div className="font-mono text-[9px] text-zinc-500 opacity-80 uppercase tracking-widest">
                        // FOCUS LOCK RANGE: DETECTING 4 COLLIDERS
                      </div>
                    </div>
                  </div>
                )}

                {activeCam === "ko" && (
                  <div className="w-full h-full relative flex flex-col items-center justify-center bg-zinc-950 p-6">
                    {/* Retro CRT Grid layout */}
                    <div className="absolute inset-0 grid-bg opacity-15" />
                    <div className="relative flex flex-col items-center max-w-sm text-center">
                      <Star className="w-12 h-12 text-[#FF2D2D]/60 animate-spin mb-4" />
                      <h4 className="font-orbitron font-black text-white text-lg tracking-widest mb-2">// DETECTED RECENT ROUND WINNER</h4>
                      <p className="font-mono text-[10px] text-zinc-500 max-w-xs leading-relaxed">
                        ROBLOX_PUNCH_GOD LANDED SPEED CRUSH OF 14.2M/S FORCE KNOCKBACK ON OPPONENT BLOCKY_MC_PUNCH AT WAREHOUSE CORRIDOR D. 
                      </p>
                      <span className="mt-4 px-3 py-1 bg-punch-red text-black font-mono font-bold text-[9px] rounded-sm shadow-md animate-pulse">
                        PLAYBACK AVAILABLE
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Camera Dashboard Switches */}
            <div className="mt-4 border-t border-zinc-900 pt-3 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-mono">
              <span className="text-zinc-500 uppercase flex items-center gap-1.5 text-[10px]">
                <Tv className="w-4 h-4 text-punch-red" />
                <span>CHOOSE SIMULATION CAMERA ANGLE:</span>
              </span>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setActiveCam("front");
                    playClickSFX();
                  }}
                  className={`px-3 py-1.5 border rounded-sm transition-all duration-200 text-[10px] font-bold ${
                    activeCam === "front"
                      ? "bg-punch-red border-punch-red text-white"
                      : "bg-[#0b0b0b] border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  CAM 1: MAIN HUBS
                </button>
                <button
                  onClick={() => {
                    setActiveCam("tracking");
                    playClickSFX();
                  }}
                  className={`px-3 py-1.5 border rounded-sm transition-all duration-200 text-[10px] font-bold ${
                    activeCam === "tracking"
                      ? "bg-punch-red border-punch-red text-white"
                      : "bg-[#0b0b0b] border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  CAM 2: ACTIVE CORRIDORS
                </button>
                <button
                  onClick={() => {
                    setActiveCam("ko");
                    playClickSFX();
                  }}
                  className={`px-3 py-1.5 border rounded-sm transition-all duration-200 text-[10px] font-bold ${
                    activeCam === "ko"
                      ? "bg-punch-red border-punch-red text-white animate-pulse"
                      : "bg-[#0b0b0b] border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  CAM 3: SPEED REPORT
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 14. JOIN THE COMMUNITY */}
      <section className="py-24 px-6 md:px-12 bg-black border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center, rgba(255,45,45,0.04) 0%, transparent 60%)" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h3 className="font-bebas text-5xl md:text-7xl tracking-widest uppercase text-white mb-2">
            JOIN THE <span className="text-punch-red">COMMUNITY</span>
          </h3>
          <p className="font-mono text-xs text-zinc-500 tracking-widest uppercase mb-12">
            // JOIN LOBBIES • REPORT BUGS • TRADE COMBO CODES
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            <a 
              href="https://discord.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={playClickSfxHandler}
              onMouseEnter={playHoverSfxHandler}
              className="p-6 bg-zinc-950 hover:bg-punch-red hover:text-white border border-zinc-900 hover:border-transparent rounded-sm transition-all duration-300 flex flex-col items-center gap-3 group shadow-md"
            >
              <span className="text-2xl font-bold font-mono group-hover:scale-110 transition-transform">💬</span>
              <span className="font-orbitron text-[10px] font-black tracking-widest uppercase">Discord</span>
            </a>

            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={playClickSfxHandler}
              onMouseEnter={playHoverSfxHandler}
              className="p-6 bg-zinc-950 hover:bg-punch-red hover:text-white border border-zinc-900 hover:border-transparent rounded-sm transition-all duration-300 flex flex-col items-center gap-3 group shadow-md"
            >
              <span className="text-2xl font-bold font-mono group-hover:scale-110 transition-transform">📺</span>
              <span className="font-orbitron text-[10px] font-black tracking-widest uppercase">YouTube</span>
            </a>

            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={playClickSfxHandler}
              onMouseEnter={playHoverSfxHandler}
              className="p-6 bg-zinc-950 hover:bg-punch-red hover:text-white border border-zinc-900 hover:border-transparent rounded-sm transition-all duration-300 flex flex-col items-center gap-3 group shadow-md"
            >
              <span className="text-2xl font-bold font-mono group-hover:scale-110 transition-transform">🔥</span>
              <span className="font-orbitron text-[10px] font-black tracking-widest uppercase">TikTok</span>
            </a>

            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={playClickSfxHandler}
              onMouseEnter={playHoverSfxHandler}
              className="p-6 bg-zinc-950 hover:bg-punch-red hover:text-white border border-zinc-900 hover:border-transparent rounded-sm transition-all duration-300 flex flex-col items-center gap-3 group shadow-md"
            >
              <span className="text-2xl font-bold font-mono group-hover:scale-110 transition-transform">🕊️</span>
              <span className="font-orbitron text-[10px] font-black tracking-widest uppercase">X Feed</span>
            </a>

            <a 
              href="https://www.roblox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={playClickSfxHandler}
              onMouseEnter={playHoverSfxHandler}
              className="col-span-2 md:col-span-1 p-6 bg-zinc-950 hover:bg-punch-red hover:text-white border border-zinc-900 hover:border-transparent rounded-sm transition-all duration-300 flex flex-col items-center gap-3 group shadow-md"
            >
              <span className="text-2xl font-bold font-mono group-hover:scale-110 transition-transform">🎮</span>
              <span className="font-orbitron text-[10px] font-black tracking-widest uppercase">Group</span>
            </a>

          </div>
        </div>
      </section>

      {/* 15. FAQ SECTION */}
      <section id="faq" className="py-24 px-6 md:px-12 bg-zinc-950 border-t border-zinc-900 relative">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <h3 className="font-bebas text-5xl md:text-7xl tracking-widest uppercase text-white mb-2">
              FREQUENTLY ASKED <span className="text-punch-red">QUESTIONS</span>
            </h3>
            <p className="font-mono text-xs text-zinc-550 tracking-widest uppercase">
              // CLARIFIED COMBAT MECHANICS • SYSTEM REQUIREMENTS
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((item, idx) => {
              const isOpen = activeFaqIdx === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-sm bg-black border border-zinc-900 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => {
                      setActiveFaqIdx(isOpen ? null : idx);
                      playClickSFX();
                    }}
                    className="w-full text-left p-6 font-orbitron font-extrabold text-xs tracking-wider text-white flex items-center justify-between gap-4 transition-colors duration-150 hover:text-punch-red"
                  >
                    <span>{item.question.toUpperCase()}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-punch-red shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                  </button>

                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-56 border-t border-zinc-900/50 p-6 opacity-100" : "max-h-0 p-0 overflow-hidden opacity-0"
                    }`}
                  >
                    <p className="text-xs text-zinc-450 leading-relaxed font-light font-poppins">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 16. FINAL CTA SECTION */}
      <section className="relative py-40 px-6 md:px-12 bg-[#000000] overflow-hidden text-center border-t border-zinc-900 flex flex-col items-center justify-center">
        {/* Extreme Red linear gradient background blending with black */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000] via-[#0b0000] to-[#210000]" />
        
        {/* Extreme particle overlay speed lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none speedlines-overlay animate-[speed-lines_1.2s_linear_infinite]" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          <span className="text-punch-red font-mono text-[10px] tracking-[0.3em] uppercase bg-punch-red/10 px-4 py-1 rounded-sm border border-punch-red mb-6 animate-pulse select-none">
            DO YOU HAVE WHAT IT TAKES?
          </span>

          <h2 className="font-anton italic font-black text-6xl md:text-8xl tracking-widest text-white mb-4 uppercase">
            ARE YOU READY?
          </h2>

          <p className="font-orbitron font-extrabold text-[#F5F5F7] tracking-[0.2em] text-sm md:text-lg mb-12 uppercase flex items-center gap-3">
            <span>PUNCH HARD.</span>
            <span className="text-punch-red font-black">PUNCH OUT!</span>
          </p>

          <a 
            href="https://www.roblox.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSfxHandler}
            onMouseEnter={playHoverSfxHandler}
            className="group relative inline-flex items-center gap-3 py-6 px-16 rounded-sm text-center font-orbitron font-black text-lg tracking-[0.2em] uppercase text-black bg-[#FF2D2D] hover:bg-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,45,45,0.7)] hover:shadow-[0_0_50px_rgba(255,255,255,1)]"
          >
            {/* Pulsing visual halo boundary */}
            <div className="absolute -inset-1 border border-[#FF2D2D] rounded-sm scale-102 group-hover:scale-105 animate-ping opacity-20 transition-all pointer-events-none" />
            <Gamepad2 className="w-6 h-6 animate-bounce" />
            <span>PLAY NOW</span>
          </a>

        </div>
      </section>

      {/* 17. FOOTER */}
      <footer className="bg-black border-t border-zinc-900 py-16 px-6 md:px-12 relative text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-between">
          
          {/* Brand/Logo Col */}
          <div className="flex flex-col items-center lg:items-start max-w-xs text-center lg:text-left">
            <div className="w-36 h-auto transform skew-x-[-12deg] mb-4">
              <PunchOutLogo className="w-full" glow={false} />
            </div>
            <p className="text-[10px] text-zinc-650 leading-relaxed uppercase mt-2">
              The premier physical fighting gladiator platform on Roblox. Join the elite fist purists and build your undisputed tournament status.
            </p>
          </div>

          {/* Quick links Col */}
          <div className="flex flex-wrap items-start justify-center gap-12 text-center lg:text-left">
            <div>
              <span className="text-[10px] text-white tracking-widest font-black uppercase block mb-3">QUICK LINKS</span>
              <ul className="space-y-2 text-[10px]">
                <li><a href="#how-it-works" onClick={playClickSfxHandler} className="hover:text-punch-red transition-colors duration-150">HOW TO PLAY</a></li>
                <li><a href="#features" onClick={playClickSfxHandler} className="hover:text-punch-red transition-colors duration-150">COMBAT FEATURES</a></li>
                <li><a href="#battlefields" onClick={playClickSfxHandler} className="hover:text-punch-red transition-colors duration-150">WAR BATTLEFIELDS</a></li>
                <li><a href="#leaderboard" onClick={playClickSfxHandler} className="hover:text-punch-red transition-colors duration-150">DAILY LOBBY RANKS</a></li>
              </ul>
            </div>

            <div>
              <span className="text-[10px] text-white tracking-widest font-black uppercase block mb-3">SOCIAL CONNECTIONS</span>
              <ul className="space-y-2 text-[10px]">
                <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-punch-red transition-colors duration-150">DISCORD GATEWAY</a></li>
                <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-punch-red transition-colors duration-150">YOUTUBE DECK</a></li>
                <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-punch-red transition-colors duration-150">TIKTOK COMBATS</a></li>
                <li><a href="https://www.roblox.com" target="_blank" rel="noopener noreferrer" className="hover:text-punch-red transition-colors duration-150">ROBLOX GROUP JOIN</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom copyright notice */}
        <div className="max-w-7xl mx-auto border-t border-zinc-950 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[9px] text-zinc-650">
          <div>
            © 2026 PUNCH OUT. All rights reserved. Registered Roblox Independent Affiliate celebration.
          </div>
          <div className="flex items-center gap-4">
            <a href="#faq" className="hover:text-zinc-400 text-neutral-600 transition-colors">PRIVACY TERMS</a>
            <span className="text-zinc-800">•</span>
            <a href="#faq" className="hover:text-zinc-400 text-neutral-600 transition-colors">SECURITY AUDITS SECURED</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
