export interface MorphControl {
    name: string;
    cc: number;
    currentValue: number;
    styles?: { id: number; name: string ; currentValue?:number}[]; // Opzionale per Morph Style
    polyphonicRelease?: { value: number; name: string }[]; // Opzionale per Morph Mode
    monophonicPortamento?: { value: number; name: string }[]; // Opzionale per Morph Mode
    shiftRange?: { value: number; semitone: number; name: string }[]; // Opzionale per Morph Shift
    genderRange?: { value: number; description: string }[]; // Opzionale per Morph Gender
}

export const morphControls: MorphControl[] = [
    {
        name: 'Morph Style',
        cc: 24, // CC aggiornato per Morph Style
        currentValue: 0, // Valore iniziale predefinito
        styles: [
            { id: 0, name: 'Fixed Gender' },
            { id: 1, name: 'Gender 5%' },
            { id: 2, name: 'Gender 10%' },
            { id: 3, name: 'Gender 15%' },
            { id: 4, name: 'Gender 20%' },
            { id: 5, name: 'Gender 25%' },
            { id: 6, name: 'Gender 30%' },
            { id: 7, name: 'Gender 35%' },
            { id: 8, name: 'Gender 40%' },
            { id: 9, name: 'Gender 45%' },
            { id: 10, name: 'Gender 50%' },
            { id: 11, name: 'Gender 55%' },
            { id: 12, name: 'Gender 60%' },
            { id: 13, name: 'Gender 65%' },
            { id: 14, name: 'Gender 70%' },
            { id: 15, name: 'Gender 75%' },
            { id: 16, name: 'Gender 80%' },
            { id: 17, name: 'Gender 85%' },
            { id: 18, name: 'Gender 90%' },
            { id: 19, name: 'Gender 95%' },
            { id: 20, name: 'Gender 100%' },
            { id: 21, name: 'Simple Saw' },
            { id: 22, name: 'Osc Saw' },
            { id: 23, name: 'Saw Detune' },
            { id: 24, name: 'Narrow Pulse' },
            { id: 25, name: 'Pulse Detune I' },
            { id: 26, name: 'Pulse Detune II' },
            { id: 27, name: 'Voice PWM' },
            { id: 28, name: 'Square Detune' },
            { id: 29, name: 'Pulse Fifths' }
      
]

      },      
    // {
    //     name: 'Morph Mode',
    //     cc: 23, // Aggiornato a 23 per Morph Mode
    //     currentValue: 0, // Aggiungi un valore predefinito
    //     polyphonicRelease: [
    //         ...Array.from({ length: 13 }, (_, i) => ({ value: i, name: `Polyphonic Release ${i}` })) // 0-12
    //     ],
    //     monophonicPortamento: [
    //         ...Array.from({ length: 13 }, (_, i) => ({ value: i + 62, name: `Monophonic Portamento ${i}` })) // 62-74
    //     ]
    // },
    // {
    //     name: 'Morph Shift',
    //     cc: 43, // Aggiornato a 43 per Morph Shift
    //     currentValue: 0, // Aggiungi un valore predefinito
    //     shiftRange: [
    //         ...Array.from({ length: 44 }, (_, i) => ({ // 42-85
    //             value: i + 42, // Inizio da 42
    //             semitone: (i + 42) - 64, // Regola per semitono
    //             name: `${(i + 42) - 64} Semitones`
    //         }))
    //     ]
    // },
    // {
    //     name: 'Morph Gender',
    //     cc: 44, // Aggiornato a 44 per Morph Gender
    //     currentValue: 0, // Aggiungi un valore predefinito
    //     genderRange: [
    //         ...Array.from({ length: 128 }, (_, i) => ({
    //             value: i,
    //             description:
    //                 i === 64 ? 'Neutral' :
    //                 i < 64 ? `${i}% Male` :
    //                 `${i - 64}% Female`
    //         }))
    //     ]
    // }
];
