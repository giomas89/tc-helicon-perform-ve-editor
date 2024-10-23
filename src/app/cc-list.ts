// src/app/cc-list.ts

export interface Tone {
    value: number;
    name: string;
  }
  
  export const ccList = [
    { CC: 1, description: 'Vibrato (Mod Wheel)', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 16, description: 'Stile XFX', values: [0, 1, 2, 3, 4, 5, 6] },
    { CC: 17, description: 'Stile DOPPIO', values: [0, 1, 2, 3] },
    { CC: 18, description: 'Stile FILTRO', values: [0, 1, 2, 3, 4] },
    { CC: 19, description: 'Tasto HardTune', values: [
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
          { value: 13, name: 'Chromatic' },
      ] as Tone[] },
  
    { CC: 20, description: 'Importo HardTune', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 21, description: 'Modifica XEX1', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 22, description: 'Mica X2', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 23, description: 'Modalità MORPH', values: Array.from({ length: 26 }, (_, i) => i) },
    { CC: 24, description: 'Stile MORPH', values: Array.from({ length: 11 }, (_, i) => i) },
    { CC: 25, description: 'Modalità CAMPIONE', values: [0, 1, 2, 3] },
    { CC: 26, description: 'Note di levigatura vocale', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 27, description: 'ECHO (Ritardo) Div', values: Array.from({ length: 13 }, (_, i) => i) },
    { CC: 28, description: 'Stile ECHO (Riverbero)', values: [0, 1, 2, 3] },
    { CC: 41, description: 'Top Mixx Livello LEAD', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 42, description: 'Top Mixx Livello MIDI', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 43, description: 'Staren MORRH', values: [0, 36, 72] },
    { CC: 44, description: 'Genere Morph', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 45, description: 'DOPPIO Livello', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 46, description: 'Delay', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 47, description: 'Rev', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 48, description: 'Filtro Mod', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 51, description: 'Abilita DOPPIO', values: [0, 63, 64, 127] },
    { CC: 52, description: 'Abilita MORPH', values: [0, 63, 64, 127] },
    { CC: 53, description: 'Abilita HARDTUNE', values: [0, 63, 64, 127] },
    { CC: 54, description: 'Abilita XFX', values: [0, 63, 64, 127] },
    { CC: 55, description: 'Abilita ECHO', values: [0, 63, 64, 127] },
    { CC: 56, description: 'FILTRO Abilita', values: [0, 63, 64, 127] },
    { CC: 58, description: 'Unknown 58', values: [0, 63, 64, 127] },
    { CC: 59, description: 'CAMPIONE Ranatom', values: [0, 63, 64, 127] },
    { CC: 64, description: 'Pedale di stegno', values: [0, 63, 64, 127] },
    { CC: 72, description: 'Rilascio della busta', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 73, description: 'Attacco di busta', values: Array.from({ length: 128 }, (_, i) => i) },
    { CC: 80, description: 'Abilita CAMPIONE', values: [0, 63, 64, 127] },
    { CC: 81, description: 'Griletto a pedale LOOPER', values: [0, 1] },
    { CC: 82, description: 'Grilletto rullante LOOPER', values: [0, 1] },
    { CC: 83, description: 'Tinggar par charles LOOPER', values: [0, 1] }
  ];
  