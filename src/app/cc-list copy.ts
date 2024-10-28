// src/app/cc-list.ts

export interface Tone {
  value: number;
  name: string;
}

export const hardTuneControls = [
  { CC: 19, description: 'HardTune Key', values: [
      { value: 0, name: 'Natural' },
      { value: 1, name: 'C' },
      { value: 2, name: 'C#' },
      { value: 3, name: 'D' },
      { value: 4, name: 'D#' },
      { value: 5, name: 'E' },
      { value: 6, name: 'F' },
      { value: 7, name: 'F#' },
      { value: 8, name: 'G' },
      { value: 9, name: 'G#' },
      { value: 10, name: 'A' },
      { value: 11, name: 'A#' },
      { value: 12, name: 'B' },
      { value: 13, name: 'Chromatic' }
    ] as Tone[] },
  { CC: 20, description: 'HardTune Amount', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 53, description: 'HARDTUNE Enable', values: [0, 63, 64, 127] }
];

const morphControls = [
  {
    name: 'Morph Style',
    cc: 20,
    styles: [
      { id: 1, name: 'Simple Saw' },
      { id: 2, name: 'Osc Saw' },
      { id: 3, name: 'Saw Detune' },
      { id: 4, name: 'Narrow Pulse' },
      { id: 5, name: 'Pulse Detune I' },
      { id: 6, name: 'Pulse Detune II' },
      { id: 7, name: 'Voice PWM' },
      { id: 8, name: 'Square Detune' },
      { id: 9, name: 'Pulse Fifths' }
    ]
  },
  {
    name: 'Morph Mode',
    cc: 21,
    polyphonicRelease: [
      ...Array.from({ length: 13 }, (_, i) => ({ value: i, name: `Polyphonic Release ${i}` }))
    ],
    monophonicPortamento: [
      ...Array.from({ length: 13 }, (_, i) => ({ value: i + 13, name: `Monophonic Portamento ${i}` }))
    ]
  },
  {
    name: 'Morph Shift',
    cc: 22,
    shiftRange: [
      ...Array.from({ length: 73 }, (_, i) => ({
        value: i,
        semitone: i - 36,
        name: `${i - 36} Semitones`
      }))
    ]
  },
  {
    name: 'Morph Gender',
    cc: 23,
    genderRange: [
      ...Array.from({ length: 128 }, (_, i) => ({
        value: i,
        description:
          i === 64 ? 'Neutral' :
          i < 64 ? `${i}% Male` :
          `${i - 64}% Female`
      }))
    ]
  }
];


export const xfxControls = [
  { CC: 16, description: 'XFX Style', values: [0, 1, 2, 3, 4, 5, 6] },
  { CC: 21, description: 'XFX Mod 1', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 22, description: 'XFX Mod 2', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 54, description: 'XFX Enable', values: [0, 63, 64, 127] }
];

export const doubleControls = [
  { CC: 17, description: 'DOUBLE Style', values: [0, 1, 2, 3] },
  { CC: 45, description: 'DOUBLE Level', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 51, description: 'DOUBLE Enable', values: [0, 63, 64, 127] }
];

export const echoControls = [
  { CC: 27, description: 'ECHO (Delay) Div', values: Array.from({ length: 13 }, (_, i) => i) },
  { CC: 28, description: 'ECHO (Reverb) Style', values: [0, 1, 2, 3] },
  { CC: 46, description: 'Delay', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 47, description: 'Reverb', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 55, description: 'ECHO Enable', values: [0, 63, 64, 127] }
];

export const filterControls = [
  { CC: 18, description: 'FILTER Style', values: [0, 1, 2, 3, 4] },
  { CC: 48, description: 'Filter Mod', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 56, description: 'FILTER Enable', values: [0, 63, 64, 127] }
];

export const otherControls = [
  { CC: 29, description: 'Level', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 30, description: 'Harmony Style', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 31, description: 'Harmony Level', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 32, description: 'Harmony Pan', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 57, description: 'Harmony Enable', values: [0, 63, 64, 127] },
  { CC: 58, description: 'Lead Level', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 59, description: 'Gender Amount', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 60, description: 'Pitch Amount', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 61, description: 'Transducer Style', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 62, description: 'Transducer Amount', values: Array.from({ length: 128 }, (_, i) => i) }
];
