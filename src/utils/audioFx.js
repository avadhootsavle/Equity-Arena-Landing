/**
 * Marvel Spider-Man Audio Synthesis Engine
 * Zero-latency native Web Audio API synthesis recreating iconic Spider-Man sound effects:
 * - Iconic "THWIP!" Web-Shooter Sound
 * - Spider-Sense Electric Tingling Alert
 * - Stark Suit HUD Notification Chime
 * - Spidey Tracker Sonar Dual-Pulse Radar Beep
 */

let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  try {
    localStorage.setItem('ea_sound_fx', enabled ? 'true' : 'false');
  } catch (_) {}
}

export function initSoundPreference() {
  try {
    const saved = localStorage.getItem('ea_sound_fx');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  } catch (_) {}
  return soundEnabled;
}

/**
 * 1. Marvel Spider-Man "THWIP!" Web-Shooter Sound
 * Recreates the signature pressurized fluid ejection + tight whip snap.
 */
export function playSpidermanWebThwip() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // --- Part A: Pressurized Gas / Fluid Hiss (Noise Buffer) ---
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(3200, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    noiseFilter.Q.setValueAtTime(3, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.08);

    // --- Part B: The Resonant "THWIP" Pitch Drop & Whip Snap ---
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1450, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);

    oscGain.gain.setValueAtTime(0.22, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  } catch (_) {}
}

/**
 * 2. Spider-Sense Electric Tingling Sound
 * Recreates the iconic tingling frequency-modulated danger sense.
 */
export function playSpidermanSpiderSense() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Carrier Oscillator
    const carrier = ctx.createOscillator();
    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(1180, now);

    // Modulator Oscillator (High-speed 24Hz vibrato tingle)
    const modulator = ctx.createOscillator();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(24, now);

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(220, now); // frequency deviation depth

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    // Filter to soften the buzz into an eerie cyber tingle
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    carrier.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    modulator.start(now);
    carrier.start(now);
    modulator.stop(now + 0.38);
    carrier.stop(now + 0.38);
  } catch (_) {}
}

/**
 * 3. Stark Suit Spider-Man Incoming Notification Chime
 * Signature futuristic 4-tone ascending cyber chime (E6 -> G#6 -> B6 -> E7).
 */
export function playSpidermanNotification() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [
      { freq: 1318.51, time: 0.00, dur: 0.12 }, // E6
      { freq: 1661.22, time: 0.05, dur: 0.12 }, // G#6
      { freq: 1975.53, time: 0.10, dur: 0.14 }, // B6
      { freq: 2637.02, time: 0.15, dur: 0.28 }, // E7 (final sustained bell)
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.09, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  } catch (_) {}
}

/**
 * 4. Spidey Tracker Sonar Dual-Pulse Telemetry Chirp ("Pip-Pip!")
 * High-tech radar chirp from the movie tracker console.
 */
export function playSpidermanTrackerSonar() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Pulse 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.50, now); // C6
    osc1.frequency.exponentialRampToValueAtTime(2093.00, now + 0.06); // C7
    gain1.gain.setValueAtTime(0.14, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.09);

    // Pulse 2 (Echo harmonic)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1567.98, now + 0.10); // G6
    osc2.frequency.exponentialRampToValueAtTime(3135.96, now + 0.16); // G7
    gain2.gain.setValueAtTime(0.12, now + 0.10);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.10);
    osc2.stop(now + 0.24);
  } catch (_) {}
}

/**
 * 5. Tactile UI Click Sound
 */
export function playTactileClick() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.03);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch (_) {}
}

// Aliases for compatibility
export const playSonarPing = playSpidermanTrackerSonar;
export const playWebSling = playSpidermanWebThwip;
export const playSpiderTingle = playSpidermanSpiderSense;
