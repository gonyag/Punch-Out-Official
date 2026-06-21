// PUNCH OUT Audio Synthesis Engine using browser Web Audio API.
// No physical audio files needed! Synthesizes 100% real-time sound waves procedurally.

let audioCtx: AudioContext | null = null;
let isMutedGlobal = true;
let isPlayingBeat = false;
let beatTimer: number | null = null;
let currentTempo = 110; // BPM

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Global Mute Toggle
export function setGlobalMute(mute: boolean) {
  isMutedGlobal = mute;
  if (mute) {
    stopMusicLoop();
  } else {
    try {
      getAudioContext();
      startMusicLoop();
    } catch (e) {
      console.error("Audio Context Init Failed: ", e);
    }
  }
}

export function isMuted(): boolean {
  return isMutedGlobal;
}

// 1. Procedural Impact SFX (Heavy Punch)
export function playPunchSFX(intensity: "light" | "heavy" | "giant" = "heavy") {
  if (isMutedGlobal) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // A. Main body oscillator: Low frequency punch drop
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    const startFreq = intensity === "giant" ? 220 : intensity === "heavy" ? 180 : 260;
    const endFreq = intensity === "giant" ? 30 : intensity === "heavy" ? 45 : 70;
    const duration = intensity === "giant" ? 0.35 : intensity === "heavy" ? 0.22 : 0.12;
    
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    gainNode.gain.setValueAtTime(1.0, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // B. Sub Bass impact thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(60, now);
    subOsc.frequency.exponentialRampToValueAtTime(10, now + duration);
    subGain.gain.setValueAtTime(0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // C. White noise shockwave snap (high end crunch)
    const bufferSize = ctx.sampleRate * 0.08; // 80ms duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(800, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 0.08);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(intensity === "giant" ? 1.2 : intensity === "heavy" ? 0.8 : 0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    // D. Soft Distortion for grit (Punch aggression)
    const waveShaper = ctx.createWaveShaper();
    function makeDistortionCurve(amount = 20) {
      const k = typeof amount === "number" ? amount : 50;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    }
    waveShaper.curve = makeDistortionCurve(30);
    waveShaper.oversample = "4x";

    // Connect nodes
    osc.connect(waveShaper);
    waveShaper.connect(gainNode);

    subOsc.connect(subGain);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);

    // Routing all to destination
    gainNode.connect(ctx.destination);
    subGain.connect(ctx.destination);
    noiseGain.connect(ctx.destination);

    // Start all
    osc.start(now);
    subOsc.start(now);
    noise.start(now);

    // Stop all
    osc.stop(now + duration);
    subOsc.stop(now + duration);
    noise.stop(now + duration);
  } catch (error) {
    console.warn("Audio Context punch failed: ", error);
  }
}

// 2. Fist Swoosh / Whoosh Wind Sound
export function playWhooshSFX() {
  if (isMutedGlobal) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.2;

    // Filtered white noise for wind rush
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Sweeping bandpass filter to sound like an active fist swinging
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(4, now);
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
    filter.frequency.exponentialRampToValueAtTime(320, now + duration);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.45, now + 0.06);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  } catch (e) {
    console.warn(e);
  }
}

// 3. Quick Interface Clicking
export function playClickSFX() {
  if (isMutedGlobal) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {
    console.warn(e);
  }
}

// 4. Success SFX (for loaded loading screens)
export function playSuccessSFX() {
  if (isMutedGlobal) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      
      gainNode.gain.setValueAtTime(0.15, now + idx * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.2);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.22);
    });
  } catch (e) {
    console.warn(e);
  }
}

// 5. Epic Dark Procedural Synth Music Loop
// Creates a mechanical industrial background beat using Synth oscillators
let currentStepNumber = 0;
function startMusicLoop() {
  if (isPlayingBeat) return;
  isPlayingBeat = true;
  currentStepNumber = 0;

  const intervalMs = (60 / currentTempo / 2) * 1000; // 8th notes

  function triggerStep() {
    if (!isPlayingBeat || isMutedGlobal) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // FOUR ON THE FLOOR KICK (step 0, 4, 8, 12 in 16 steps)
      if (currentStepNumber % 4 === 0) {
        // Kick synthesis
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.type = "sine";
        kickOsc.frequency.setValueAtTime(120, now);
        kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.15);

        kickGain.gain.setValueAtTime(0.4, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        kickOsc.connect(kickGain);
        kickGain.connect(ctx.destination);
        kickOsc.start(now);
        kickOsc.stop(now + 0.18);
      }

      // SNARE/CLAP TIGHT SLICE (step 4, 12)
      if (currentStepNumber % 8 === 4) {
        // Noise snare
        const snBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
        const snData = snBuffer.getChannelData(0);
        for (let i = 0; i < snData.length; i++) snData[i] = Math.random() * 2 - 1;

        const snSource = ctx.createBufferSource();
        snSource.buffer = snBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1000, now);

        const snGain = ctx.createGain();
        snGain.gain.setValueAtTime(0.12, now);
        snGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        snSource.connect(filter);
        filter.connect(snGain);
        snGain.connect(ctx.destination);

        snSource.start(now);
        snSource.stop(now + 0.1);
      }

      // OFF-BEAT TIGHT HI-HAT (steps 2, 6, 10, 14)
      if (currentStepNumber % 4 === 2) {
        const oscHat = ctx.createOscillator();
        const gainHat = ctx.createGain();
        
        oscHat.type = "triangle";
        oscHat.frequency.setValueAtTime(10000, now);
        
        gainHat.gain.setValueAtTime(0.04, now);
        gainHat.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        
        oscHat.connect(gainHat);
        gainHat.connect(ctx.destination);
        
        oscHat.start(now);
        oscHat.stop(now + 0.04);
      }

      // DRIVING BASS LINE (8th notes rhythm pulsing in Am scale)
      // Notes: A1 (55Hz), C2 (65Hz), D2 (73Hz), G1 (49Hz)
      const bassPattern = [
        55.00, 55.00, 55.00, 55.00, // A1
        65.41, 65.41, 73.42, 49.00  // C2, D2, G1
      ];
      
      const bassFreq = bassPattern[currentStepNumber % 8];
      
      // We pulse the index
      if (currentStepNumber % 2 === 0) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        const bassFilter = ctx.createBiquadFilter();

        bassOsc.type = "sawtooth";
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        // Sweeping filter cut for deep analog feel
        bassFilter.type = "lowpass";
        bassFilter.frequency.setValueAtTime(250, now);
        bassFilter.frequency.exponentialRampToValueAtTime(150, now + 0.12);

        bassGain.gain.setValueAtTime(0.18, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(ctx.destination);

        bassOsc.start(now);
        bassOsc.stop(now + 0.15);
      }

      // Advance sequencer step
      currentStepNumber = (currentStepNumber + 1) % 16;
    } catch (e) {
      console.warn("SEQ step error: ", e);
    }

    beatTimer = window.setTimeout(triggerStep, intervalMs);
  }

  // Kickstart step
  triggerStep();
}

function stopMusicLoop() {
  isPlayingBeat = false;
  if (beatTimer) {
    clearTimeout(beatTimer);
    beatTimer = null;
  }
}
