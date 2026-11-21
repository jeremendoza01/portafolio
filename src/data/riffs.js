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
    id: 'ji-ji-ji',
    name: 'Ji Ji Ji',
    artist: 'Los Redondos',
    origin: 'AR',
    bpm: 158, // Oktubre (1986) · 158 BPM (corchea = 190ms)
    steps: [
      // Riff del solo final en Mi menor (8 beats por vuelta)
      [71, 0.5], [67, 0.5], [69, 0.5], [71, 0.5],
      [67, 0.5], [69, 0.5], [71, 0.5], [74, 1.0],
      [72, 0.5], [71, 0.5], [69, 0.5], [67, 0.5],
      [69, 0.5], [71, 0.5], [69, 0.25], [67, 0.25], [66, 0.5], [67, 0.5], [64, 1.5], [0, 0.5],
      // Repetición
      [71, 0.5], [67, 0.5], [69, 0.5], [71, 0.5],
      [67, 0.5], [69, 0.5], [71, 0.5], [74, 1.0],
      [72, 0.5], [71, 0.5], [69, 0.5], [67, 0.5],
      [66, 0.5], [67, 0.5], [[52, 59, 64], 2.0],
    ],
  },
  {
    id: 'lamento-boliviano',
    name: 'Lamento Boliviano',
    artist: 'Enanitos Verdes',
    origin: 'AR',
    bpm: 115, // Big Bang (1994) · 115 BPM (corchea = 261ms)
    steps: [
      // Em (4 beats)
      [52, 0.5], [59, 0.5], [64, 0.5], [67, 0.5], [66, 0.5], [64, 0.5], [59, 0.5], [64, 0.5],
      // Bm (4 beats)
      [47, 0.5], [54, 0.5], [59, 0.5], [62, 0.5], [61, 0.5], [59, 0.5], [54, 0.5], [59, 0.5],
      // Am (4 beats)
      [45, 0.5], [52, 0.5], [57, 0.5], [60, 0.5], [59, 0.5], [57, 0.5], [52, 0.5], [57, 0.5],
      // Em (2 beats) + B7 (2 beats) -> Em cierre
      [52, 0.5], [59, 0.5], [64, 0.5], [67, 0.5],
      [47, 0.5], [54, 0.5], [59, 0.5], [63, 0.5],
      [[52, 59, 64, 67], 2.0],
    ],
  },
  {
    id: 'persiana-americana',
    name: 'Persiana Americana',
    artist: 'Soda Stereo',
    origin: 'AR',
    bpm: 103, // Signos (1986) · 103 BPM (corchea = 291ms)
    steps: [
      // G (4 beats)
      [55, 0.5], [59, 0.5], [62, 0.5], [67, 0.5], [66, 0.5], [62, 0.5], [59, 0.5], [62, 0.5],
      // Em (4 beats)
      [52, 0.5], [59, 0.5], [64, 0.5], [67, 0.5], [66, 0.5], [64, 0.5], [59, 0.5], [64, 0.5],
      // C (4 beats)
      [48, 0.5], [55, 0.5], [60, 0.5], [64, 0.5], [62, 0.5], [60, 0.5], [55, 0.5], [60, 0.5],
      // D (3 beats) + G cierre
      [50, 0.5], [57, 0.5], [62, 0.5], [66, 0.5], [69, 1.0], [[55, 59, 67], 2.0],
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
