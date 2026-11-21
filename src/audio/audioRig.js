// Motor de audio Web Audio API: guitarra física (Karplus-Strong + overdrive cálido) y sintetizador.

class AudioRigEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.drive = null;
    this.analyser = null;
    this.data = null;
    this.enabled = false;
    this.mode = 'guitar'; // 'guitar' | 'synth'
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit() {
    this.listeners.forEach((fn) => fn({ enabled: this.enabled, mode: this.mode }));
  }

  makeCurve(amount = 14) {
    const n = 44100;
    const c = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      c[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x));
    }
    return c;
  }

  ensure() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    if (!this.ctx) {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.24;

      this.drive = this.ctx.createWaveShaper();
      this.drive.curve = this.makeCurve(14);
      this.drive.oversample = '2x';

      const cab = this.ctx.createBiquadFilter();
      cab.type = 'lowpass';
      cab.frequency.value = 4600;

      const comp = this.ctx.createDynamicsCompressor();
      const delay = this.ctx.createDelay(1);
      delay.delayTime.value = 0.25;
      const fb = this.ctx.createGain();
      fb.gain.value = 0.22;
      const wet = this.ctx.createGain();
      wet.gain.value = 0.2;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.data = new Uint8Array(this.analyser.fftSize);

      this.master.connect(this.drive);
      this.drive.connect(cab);
      cab.connect(comp);
      cab.connect(delay);
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(wet);
      wet.connect(comp);
      comp.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  pluck(freq, dur = 1.6, vel = 0.85) {
    if (!this.ensure()) return;
    const sr = this.ctx.sampleRate;
    const len = Math.floor(sr * dur);
    const buf = this.ctx.createBuffer(1, len, sr);
    const out = buf.getChannelData(0);
    const N = Math.max(2, Math.round(sr / freq));
    const ring = new Float32Array(N);

    let prev = 0;
    for (let i = 0; i < N; i++) {
      const w = Math.random() * 2 - 1;
      ring[i] = prev = prev * 0.32 + w * 0.68;
    }

    const damp = 0.996;
    let idx = 0;
    for (let i = 0; i < len; i++) {
      const nxt = (idx + 1) % N;
      const val = (ring[idx] + ring[nxt]) * 0.5 * damp;
      ring[idx] = val;
      out[i] = val * vel;
      idx = nxt;
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(g);
    g.connect(this.master);
    src.start(t);
  }

  synthNote(midi, dur = 0.45, vel = 0.9) {
    if (!this.ensure()) return;
    const f = this.midiToFreq(midi);
    const t = this.ctx.currentTime;
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    const filt = this.ctx.createBiquadFilter();
    const env = this.ctx.createGain();

    o1.type = 'triangle';
    o1.frequency.value = f;
    o2.type = 'sawtooth';
    o2.frequency.value = f;
    o2.detune.value = 7;
    g2.gain.value = 0.22;

    filt.type = 'lowpass';
    filt.Q.value = 3.5;
    filt.frequency.setValueAtTime(4000, t);
    filt.frequency.exponentialRampToValueAtTime(700, t + dur + 0.3);

    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.85 * vel, t + 0.012);
    env.gain.exponentialRampToValueAtTime(0.4 * vel, t + 0.16);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.4);

    o1.connect(filt);
    o2.connect(g2);
    g2.connect(filt);
    filt.connect(env);
    env.connect(this.master);

    o1.start(t);
    o2.start(t);
    o1.stop(t + dur + 0.45);
    o2.stop(t + dur + 0.45);
  }

  // Soporta una nota MIDI o un array de notas (acordes / cuartas / power chords)
  note(midiOrList, dur = 0.55, vel = 0.88) {
    const list = Array.isArray(midiOrList) ? midiOrList : [midiOrList];
    const perVel = list.length > 1 ? vel / Math.sqrt(list.length) : vel;
    list.forEach((m, idx) => {
      if (!m) return;
      const strumDelay = list.length > 1 ? idx * 14 : 0;
      const fire = () => {
        if (this.mode === 'guitar') {
          this.pluck(this.midiToFreq(m), Math.max(0.9, dur * 2.1), perVel);
        } else {
          this.synthNote(m, dur, perVel);
        }
      };
      if (strumDelay) setTimeout(fire, strumDelay);
      else fire();
    });
  }

  setEnabled(v) {
    this.enabled = v;
    if (v) this.ensure();
    this.emit();
  }

  setMode(m) {
    this.mode = m;
    this.emit();
  }

  wave() {
    if (!this.analyser) return null;
    this.analyser.getByteTimeDomainData(this.data);
    return this.data;
  }
}

export const audioRig = new AudioRigEngine();
