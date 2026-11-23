// Riffs conocidos de rock argentino e internacional con su BPM original exacto.
// Cada paso es [midi | midi[], beats] en compás de 4/4 (1 = negra = 60000 / bpm ms).
// El teclado JM-24 mapea cualquier nota MIDI a su tecla visual (60..83) manteniendo la octava real de audio.

export const RIFFS = [
  {
    id: 'de-musica-ligera',
    name: 'De Música Ligera',
    artist: 'Soda Stereo',
    origin: 'AR',
    bpm: 124, // Canción Animal (1990) · 124 BPM
    steps: [
      // Bm (2 beats) | G (2 beats) || D (2 beats) | A (2 beats)
      [[47, 54, 59], 0.75], [[54, 59, 62], 0.75], [59, 0.5],
      [[43, 50, 55], 0.75], [[50, 55, 59], 0.75], [55, 0.5],
      [[50, 57, 62], 0.75], [[57, 62, 66], 0.75], [62, 0.5],
      [[45, 52, 57], 0.75], [[52, 57, 61], 0.75], [57, 0.5],
      // Segunda vuelta (estribillo)
      [[47, 54, 59], 0.5], [[47, 54, 59], 0.5], [62, 0.5], [61, 0.5],
      [[43, 50, 55], 0.5], [[43, 50, 55], 0.5], [59, 0.5], [57, 0.5],
      [[50, 57, 62], 0.5], [[50, 57, 62], 0.5], [66, 0.5], [64, 0.5],
      [[45, 52, 57], 1.0], [[45, 52, 57, 61], 1.0],
    ],
  },
  {
    id: 'smoke-on-the-water',
    name: 'Smoke on the Water',
    artist: 'Deep Purple',
    origin: 'UK',
    bpm: 114, // Machine Head (1972) · 114 BPM (negra = 526ms)
    steps: [
      // Frase 1 (8 beats con la síncopa exacta en el & del 4)
      [[50, 55], 1.0], [[53, 58], 1.0], [[55, 60], 1.5],
      [[50, 55], 1.0], [[53, 58], 1.0], [[56, 61], 0.5], [[55, 60], 1.5], [0, 0.5],
      // Frase 2 (8 beats)
      [[50, 55], 1.0], [[53, 58], 1.0], [[55, 60], 1.5],
      [[53, 58], 1.0], [[50, 55], 3.0], [0, 0.5],
    ],
  },
  {
    id: 'seven-nation-army',
    name: 'Seven Nation Army',
    artist: 'The White Stripes',
    origin: 'US',
    bpm: 124, // Elephant (2003) · 124 BPM (negra = 484ms)
    steps: [
      // Vuelta 1 (8 beats exactos: 1.5 + 0.5 + 0.75 + 0.75 + 0.5 + 2 + 2)
      [52, 1.5], [52, 0.5], [55, 0.75], [52, 0.75], [50, 0.5], [48, 2.0], [47, 2.0],
      // Vuelta 2 (8 beats exactos: 1.5 + 0.5 + 0.75 + 0.75 + 0.5 + 0.75 + 0.75 + 0.5 + 2)
      [52, 1.5], [52, 0.5], [55, 0.75], [52, 0.75], [50, 0.5],
      [48, 0.75], [50, 0.75], [48, 0.5], [47, 2.0],
    ],
  },
  {
    id: 'come-as-you-are',
    name: 'Come As You Are',
    artist: 'Nirvana',
    origin: 'US',
    bpm: 120, // Nevermind (1991) · 120 BPM (corchea = 250ms)
    steps: [
      // Pickup + 2 vueltas exactas de 8 beats
      [52, 0.5], [52, 0.5], [53, 0.5],
      [54, 1.0], [57, 0.5], [54, 0.5], [57, 0.5], [54, 0.5], [54, 0.5], [53, 0.5],
      [52, 0.5], [59, 0.5], [52, 0.5], [52, 0.5], [59, 0.5], [52, 0.5], [52, 0.5], [53, 0.5],
      [54, 1.0], [57, 0.5], [54, 0.5], [57, 0.5], [54, 0.5], [54, 0.5], [53, 0.5],
      [52, 0.5], [59, 0.5], [52, 2.0],
    ],
  },
];
