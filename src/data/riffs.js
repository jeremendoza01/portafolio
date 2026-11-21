// Riffs conocidos de rock argentino e internacional.
// Cada paso es [midi | midi[], beats].
// El teclado JM-24 mapea cualquier MIDI a su tecla correspondiente (60..83) manteniendo el audio real.

export const RIFFS = [
  {
    id: 'de-musica-ligera',
    name: 'De Música Ligera',
    artist: 'Soda Stereo',
    origin: 'AR',
    beatMs: 225,
    steps: [
      // Bm -> G -> D -> A (arpegio + power chords)
      [[47, 54, 59], 1.5], [62, 0.5], [59, 0.5], [54, 0.5],
      [[43, 50, 55], 1.5], [59, 0.5], [55, 0.5], [50, 0.5],
      [[50, 57, 62], 1.5], [66, 0.5], [62, 0.5], [57, 0.5],
      [[45, 52, 57], 1.5], [61, 0.5], [57, 0.5], [52, 0.5],
      // Segunda vuelta con melodía icónica
      [[47, 59], 1], [62, 1], [61, 1],
      [[43, 55], 1], [59, 1], [57, 1],
      [[50, 62], 1], [66, 1], [64, 1],
      [[45, 57], 1.5], [61, 1.5],
    ],
  },
  {
    id: 'ji-ji-ji',
    name: 'Ji Ji Ji',
    artist: 'Los Redondos',
    origin: 'AR',
    beatMs: 175,
    steps: [
      // El pogo más grande del mundo — riff del solo en Mi menor
      [71, 1], [67, 1], [69, 1], [71, 1],
      [67, 1], [69, 1], [71, 1], [74, 1.5],
      [72, 0.5], [71, 1], [69, 1], [67, 1],
      [69, 1], [71, 1], [69, 0.5], [67, 0.5], [66, 1], [67, 1], [64, 2.5], [0, 0.5],
      // Repetición con empuje
      [71, 1], [67, 1], [69, 1], [71, 1],
      [67, 1], [69, 1], [71, 1], [74, 1.5],
      [72, 0.5], [71, 1], [69, 1], [67, 1],
      [66, 1], [67, 1], [[52, 59, 64], 3],
    ],
  },
  {
    id: 'lamento-boliviano',
    name: 'Lamento Boliviano',
    artist: 'Enanitos Verdes',
    origin: 'AR',
    beatMs: 215,
    steps: [
      // Em -> Bm -> Am -> Em -> B7
      [52, 0.75], [59, 0.75], [64, 0.75], [67, 0.75], [66, 0.5], [64, 0.5],
      [47, 0.75], [54, 0.75], [59, 0.75], [62, 0.75], [61, 0.5], [59, 0.5],
      [45, 0.75], [52, 0.75], [57, 0.75], [60, 0.75], [59, 0.5], [57, 0.5],
      [52, 0.75], [59, 0.75], [64, 0.75], [67, 0.75],
      [[47, 54, 59, 63], 2.5], [0, 0.5],
      [[52, 59, 64, 67], 3],
    ],
  },
  {
    id: 'persiana-americana',
    name: 'Persiana Americana',
    artist: 'Soda Stereo',
    origin: 'AR',
    beatMs: 185,
    steps: [
      // Arpegio brillante de intro en Sol (G - Em - C - D)
      [55, 0.75], [59, 0.75], [62, 0.75], [67, 0.75], [66, 0.75], [62, 0.75], [59, 0.75], [62, 0.75],
      [52, 0.75], [59, 0.75], [64, 0.75], [67, 0.75], [66, 0.75], [64, 0.75], [59, 0.75], [64, 0.75],
      [48, 0.75], [55, 0.75], [60, 0.75], [64, 0.75], [62, 0.75], [60, 0.75], [55, 0.75], [60, 0.75],
      [50, 0.75], [57, 0.75], [62, 0.75], [66, 0.75], [69, 1.5], [[55, 59, 67], 2.5],
    ],
  },
  {
    id: 'smoke-on-the-water',
    name: 'Smoke on the Water',
    artist: 'Deep Purple',
    origin: 'UK',
    beatMs: 250,
    steps: [
      // Cuartas paralelas clásicas en Gm
      [[50, 55], 1.5], [[53, 58], 1.5], [[55, 60], 2], [0, 0.5],
      [[50, 55], 1.5], [[53, 58], 1.5], [[56, 61], 1], [[55, 60], 2.5], [0, 0.5],
      [[50, 55], 1.5], [[53, 58], 1.5], [[55, 60], 2],
      [[53, 58], 1.5], [[50, 55], 3],
    ],
  },
  {
    id: 'seven-nation-army',
    name: 'Seven Nation Army',
    artist: 'The White Stripes',
    origin: 'US',
    beatMs: 230,
    steps: [
      [52, 1.5], [52, 0.5], [55, 0.75], [52, 0.75], [50, 0.5], [48, 2], [47, 2],
      [52, 1.5], [52, 0.5], [55, 0.75], [52, 0.75], [50, 0.5], [48, 0.75], [50, 0.75], [48, 0.5], [47, 2.5],
    ],
  },
  {
    id: 'come-as-you-are',
    name: 'Come As You Are',
    artist: 'Nirvana',
    origin: 'US',
    beatMs: 210,
    steps: [
      // En Em (afinación estándar, 1 tono arriba del disco)
      [52, 0.75], [52, 0.75], [53, 0.75], [54, 1.5], [57, 0.75], [54, 0.75], [57, 0.75], [54, 0.75],
      [54, 0.75], [53, 0.75], [52, 1.25], [59, 0.75], [52, 0.75], [52, 0.75], [59, 1.25],
      [52, 0.75], [52, 0.75], [53, 0.75], [54, 1.5], [57, 0.75], [54, 0.75], [57, 0.75], [54, 0.75],
      [54, 0.75], [53, 0.75], [52, 2.5],
    ],
  },
];
