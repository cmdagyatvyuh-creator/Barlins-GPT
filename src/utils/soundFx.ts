// Tactical HUD Audio Synthesizer (Web Audio API)
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Futuristic click beep
  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // AudioContext blocked or unsupported
    }
  }

  // Toggle feedback chime
  playToggle(turnOn: boolean) {
    if (!turnOn) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime( turnOn ? 600 : 400, now);
      osc.frequency.exponentialRampToValueAtTime(turnOn ? 1200 : 200, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  // Hover tone
  playHover() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // ignore
    }
  }

  // Command executed chime
  playSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(880.00, now + 0.16); // A5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.35);
    } catch {
      // ignore
    }
  }

  // Alert/Error tone
  playAlert() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(250, now + 0.1);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }

  playError() {
    this.playAlert();
  }

  // Cinematic Sci-Fi Portal Boot Chime Synthesizer
  playPortalStartupAudio() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Sub Bass Power-Up Sweep
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(45, now);
      bassOsc.frequency.exponentialRampToValueAtTime(220, now + 1.2);

      bassGain.gain.setValueAtTime(0.01, now);
      bassGain.gain.linearRampToValueAtTime(0.25, now + 0.8);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 1.8);

      // 2. Harmonic Riser Chord (C Major / Arc Reactor Energy)
      const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        const startDelay = now + idx * 0.12;
        osc.frequency.setValueAtTime(freq, startDelay);

        gain.gain.setValueAtTime(0.001, startDelay);
        gain.gain.linearRampToValueAtTime(0.12, startDelay + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, startDelay + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startDelay);
        osc.stop(startDelay + 1.2);
      });

      // 3. Cyber Lock Beep (Final Confirmation Chime)
      setTimeout(() => {
        if (!this.ctx) return;
        const confirmNow = this.ctx.currentTime;
        const confirmOsc = this.ctx.createOscillator();
        const confirmGain = this.ctx.createGain();

        confirmOsc.type = 'sine';
        confirmOsc.frequency.setValueAtTime(1046.50, confirmNow); // C6
        confirmOsc.frequency.setValueAtTime(1318.51, confirmNow + 0.08); // E6
        confirmOsc.frequency.setValueAtTime(1567.98, confirmNow + 0.16); // G6

        confirmGain.gain.setValueAtTime(0.2, confirmNow);
        confirmGain.gain.exponentialRampToValueAtTime(0.001, confirmNow + 0.5);

        confirmOsc.connect(confirmGain);
        confirmGain.connect(this.ctx.destination);

        confirmOsc.start(confirmNow);
        confirmOsc.stop(confirmNow + 0.5);
      }, 1200);

    } catch {
      // Audio context error or blocked
    }
  }

  // Intense Wolf Mode Activation Audio Synthesizer (Devil Sub-bass + Red Cyber Laser Sweep)
  playWolfActivationAudio() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Devil Sub-Bass Power Sweep
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(30, now);
      bassOsc.frequency.exponentialRampToValueAtTime(120, now + 1.5);

      bassGain.gain.setValueAtTime(0.01, now);
      bassGain.gain.linearRampToValueAtTime(0.35, now + 0.5);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 2.5);

      // 2. High Cyber Pulse Glitch Laser Sweeps
      [150, 300, 450, 600, 900].forEach((startFreq, i) => {
        if (!this.ctx) return;
        const delay = now + i * 0.15;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(startFreq, delay);
        osc.frequency.linearRampToValueAtTime(startFreq * 2.5, delay + 0.12);

        gain.gain.setValueAtTime(0.12, delay);
        gain.gain.exponentialRampToValueAtTime(0.001, delay + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(delay);
        osc.stop(delay + 0.12);
      });

      // 3. Devil Alarm Stabs
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const alarmOsc = this.ctx.createOscillator();
        const alarmGain = this.ctx.createGain();

        alarmOsc.type = 'sawtooth';
        alarmOsc.frequency.setValueAtTime(880, t); // A5
        alarmOsc.frequency.setValueAtTime(440, t + 0.15); // A4

        alarmGain.gain.setValueAtTime(0.2, t);
        alarmGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        alarmOsc.connect(alarmGain);
        alarmGain.connect(this.ctx.destination);

        alarmOsc.start(t);
        alarmOsc.stop(t + 0.4);
      }, 1000);

    } catch {
      // ignore
    }
  }

  // Triumphant System Ready Audio Confirmation (When voice finishes saying "Ready for your command, sir")
  playWolfSystemReadyAudio() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Major Triad Chime
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.2);
      });
    } catch {
      // ignore
    }
  }

  // Crisp Cyan Normal Mode Activation Audio Synthesizer
  playNormalActivationAudio() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Upward Smooth Chime
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        if (!this.ctx) return;
        const delay = now + i * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, delay);

        gain.gain.setValueAtTime(0.2, delay);
        gain.gain.exponentialRampToValueAtTime(0.001, delay + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(delay);
        osc.stop(delay + 0.8);
      });
    } catch {
      // ignore
    }
  }

  playNormalSystemReadyAudio() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Soft Harmony Confirmation
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 1.0);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 1.0);
      });
    } catch {
      // ignore
    }
  }
}

export const soundFx = new SoundFX();
