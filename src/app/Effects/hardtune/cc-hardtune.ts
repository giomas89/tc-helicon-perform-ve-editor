export interface HardtuneControl {
  name: string;
  cc: number;
  currentValue: number;
  keys?: Key[]; // Opzionale per Hardtune Key
  values?: { id: number; name: string }[]; // Opzionale per Hardtune Amount
}
export interface Key {
  id: number;    // Identificativo della key
  name: string;  // Nome della key
}


export const hardtuneControls: HardtuneControl[] = [
  {
      name: 'HardTune Key', // Nome del controllo HardTune Key
      cc: 19, // Control Change per HardTune Key
      currentValue: 0, // Valore iniziale predefinito
      keys: [  // Cambiato values in keys
          { id: 0, name: 'Natural' },
          { id: 1, name: 'C/Am' },
          { id: 2, name: 'C#/Bbm' },
          { id: 3, name: 'D/Bm' },
          { id: 4, name: 'D#/Cm' },
          { id: 5, name: 'E/C#m' },
          { id: 6, name: 'F/Dm' },
          { id: 7, name: 'F#/D#m' },
          { id: 8, name: 'G/Em' },
          { id: 9, name: 'G#/Fm' },
          { id: 10, name: 'A/F#m' },
          { id: 11, name: 'A#/Gm' },
          { id: 12, name: 'B/G#m' },
          { id: 13, name: 'Chromatic' }
      ]
  },
  {
      name: 'Hardtune Amount',
      cc: 20, // Numero di Control Change per Hardtune Amount
      currentValue: 0, // Valore iniziale predefinito
      values: Array.from({ length: 128 }, (_, index) => ({
          id: index,
          name: `${(index / 127 * 100).toFixed(0)}%` // Converti da 0 a 127 in percentuale
      }))
  }
];
