// src/app/cc-list.ts

export interface Tone {
  value: number;
  name: string;
}

export const ccList = [
  { CC: 1, description: 'Vibrato (Mod Wheel)', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 16, description: 'XFX Style', values: [0, 1, 2, 3, 4, 5, 6] },
  { CC: 17, description: 'DOUBLE Style', values: [0, 1, 2, 3] },
  { CC: 18, description: 'FILTER Style', values: [0, 1, 2, 3, 4] },
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
  { CC: 21, description: 'XFX Mod 1', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 22, description: 'XFX Mod 2', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 23, description: 'MORPH Mode', values: Array.from({ length: 26 }, (_, i) => i) },
  { CC: 24, description: 'MORPH Style', values: Array.from({ length: 11 }, (_, i) => i) },
  { CC: 25, description: 'SAMPLE Mode', values: [0, 1, 2, 3] },
  { CC: 26, description: 'Voice Smoothing Notes', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 27, description: 'ECHO (Delay) Div', values: Array.from({ length: 13 }, (_, i) => i) },
  { CC: 28, description: 'ECHO (Reverb) Style', values: [0, 1, 2, 3] },
  { CC: 41, description: 'Top Mix: LEAD Level', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 42, description: 'Top Mix: MIDI Level', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 43, description: 'MORPH Shift', values: [0, 36, 72] },
  { CC: 44, description: 'MORPH Gender', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 45, description: 'DOUBLE Level', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 46, description: 'Delay', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 47, description: 'Reverb', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 48, description: 'Filter Mod', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 51, description: 'DOUBLE Enable', values: [0, 63, 64, 127] },
  { CC: 52, description: 'MORPH Enable', values: [0, 63, 64, 127] },
  { CC: 53, description: 'HARDTUNE Enable', values: [0, 63, 64, 127] },
  { CC: 54, description: 'XFX Enable', values: [0, 63, 64, 127] },
  { CC: 55, description: 'ECHO Enable', values: [0, 63, 64, 127] },
  { CC: 56, description: 'FILTER Enable', values: [0, 63, 64, 127] },
  { CC: 58, description: 'SAMPLE Record Switch', values: [0, 63, 64, 127] },
  { CC: 59, description: 'SAMPLE Play Switch', values: [0, 63, 64, 127] },
  { CC: 64, description: 'Sustain Pedal', values: [0, 63, 64, 127] },
  { CC: 72, description: 'Envelope Release', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 73, description: 'Envelope Attack', values: Array.from({ length: 128 }, (_, i) => i) },
  { CC: 80, description: 'SAMPLE Enable', values: [0, 63, 64, 127] },
  { CC: 81, description: 'LOOPER Kick Trigger', values: [0, 1] },
  { CC: 82, description: 'LOOPER Snare Trigger', values: [0, 1] },
  { CC: 83, description: 'LOOPER Hi-Hat Trigger', values: [0, 1] }
];
