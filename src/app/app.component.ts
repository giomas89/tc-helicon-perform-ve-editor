import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebMidi, Output, Input } from 'webmidi';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';


// Risorse CC
import { ccList, Tone } from './cc-list';

import { MorphComponent } from './Effects/morph/morph.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, MorphComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TC Helicon Perform VE'; 
  aryMidiOutputs: Output[] = [];
  aryMidiInputs: Input[] = [];
  midiOutput: Output | undefined;
  midiInput: Input | undefined;
  tones: Tone[] = []; 
  selectedTone: Tone | null = null; 
  selectedMidiOutput: string | null = null;
  selectedMidiInput: string | null = null;
  // selectedChannel: number;
  selectedChannel: number = 1; 

  // Stato degli effetti
  EffectStates = {
    isHardTuneOn: false,
    isMorphOn: false,
    isDoubleOn: false,
    isXfxOn: false,
    isEchoOn: false,
    isFilterOn: false,
  };

  // Program attivo
  activeProgram: number | null = null;

  // Volumi
  volume1: number = 0; // CC 41
  volume2: number = 0; // CC 42

  constructor(private cdr: ChangeDetectorRef) {
    this.selectedChannel = 1; 
  }

  ngOnInit(): void {
    this.enableWebMidi();
    this.initializeTones(); 
  }

  initializeTones() {
    const toneCC = ccList.find(entry => entry.CC === 19);
    if (toneCC) {
      this.tones = toneCC.values as Tone[];
    }
  }

  enableWebMidi() {
    if (WebMidi.supported) {
      WebMidi.enable()
        .then(() => this.onMidiEnabled())
        .catch(err => console.error('WebMidi could not be enabled', err));
    } else {
      console.error('WebMIDI is not supported by this browser.');
    }
  }

  onMidiEnabled() {
    console.log('WebMIDI enabled!');

    this.aryMidiOutputs = WebMidi.outputs;
    this.aryMidiInputs = WebMidi.inputs;

    console.log('Available MIDI Outputs:', this.aryMidiOutputs);
    console.log('Available MIDI Inputs:', this.aryMidiInputs);

    // Selezione del dispositivo MIDI OUT
    const selectedOutput = this.aryMidiOutputs.find(output =>
        output.name.toLowerCase().startsWith('perform-ve')
    );

    if (selectedOutput) {
        this.selectedMidiOutput = selectedOutput.id;
        this.midiOutput = selectedOutput;
        console.log("Automatically selected output device: ID: ${this.selectedMidiOutput}, Name: ${this.midiOutput.name}");
        
        // Invio messaggio di controllo per conferma
        this.midiOutput.sendControlChange(19, 0, { channels: this.selectedChannel });
    } else {
        console.warn('No suitable MIDI output found.');
    }

    // Selezione del dispositivo MIDI IN
    const selectedInput = this.aryMidiInputs.find(input =>
        input.name.toLowerCase().startsWith('perform-ve')
    );

    if (selectedInput) {
        this.selectedMidiInput = selectedInput.id;
        this.midiInput = selectedInput;
        console.log("Automatically selected input device: ID: ${this.selectedMidiInput}, Name: ${this.midiInput.name}");

        // Aggiungi listener per messaggi MIDI
        this.midiInput.addListener('midimessage', this.handleMidiMessage.bind(this));
        console.log("Listening for MIDI messages on input device: ${this.midiInput.name}");
    } else {
        console.warn('No suitable MIDI input found.');
    }


    // this.requestAllCcValues(); // Aggiungi questa riga
  }

  updateControlStates(controllerNumber: number, value: number) {
    console.log('upd:',controllerNumber,value);
    switch (controllerNumber) {
      case 19:
        const selectedTone = this.tones.find(tone => tone.value === value);
        if (selectedTone) {
          this.selectedTone = selectedTone; 
        }
        console.log(this.selectedTone?.value);
        break;
      case 41:
        this.volume1 = value; // Aggiorna il volume 1
        break;
      case 42:
        this.volume2 = value; // Aggiorna il volume 2
        break;
      case 51:
        this.EffectStates.isDoubleOn = value === 64;
        break;
      case 52:
        this.EffectStates.isMorphOn = value === 64;
        break;
      case 53:
        this.EffectStates.isHardTuneOn = value === 64;
        break;
      case 54:
        this.EffectStates.isXfxOn = value === 64;
        break;
      case 55:
        this.EffectStates.isEchoOn = value === 64;
        break;
      case 56:
        this.EffectStates.isFilterOn = value === 64;
        break;
      default:
        console.warn("Unrecognized controller number: ${controllerNumber}");
    }

    this.cdr.detectChanges(); // Forza il rilevamento dei cambiamenti
  }

  handleMidiMessage(message: any) {
    const [status, controllerNumber, value] = message.data;
    console.log("RECEIVED MIDI message:", message.data); // Log dei messaggi MIDI ricevuti
    this.updateControlStates(controllerNumber, value);
  }

  toggleEffect(effect: keyof typeof this.EffectStates) {
    // Invertire lo stato dell'effetto
    this.EffectStates[effect] = !this.EffectStates[effect];
    
    // Determinare il valore da inviare (127 per ON, 0 per OFF)
    const value = this.EffectStates[effect] ? 127 : 0;

    // INVIA il messaggio MIDI corrispondente
    switch (effect) {
      case 'isDoubleOn':
        this.midiOutput?.sendControlChange(51, value, { channels: this.selectedChannel });
        break;
      case 'isMorphOn':
        this.midiOutput?.sendControlChange(52, value, { channels: this.selectedChannel });
        break;
      case 'isHardTuneOn':
        this.midiOutput?.sendControlChange(53, value, { channels: this.selectedChannel });
        break;
      case 'isXfxOn':
        this.midiOutput?.sendControlChange(54, value, { channels: this.selectedChannel });
        break;
      case 'isEchoOn':
        this.midiOutput?.sendControlChange(55, value, { channels: this.selectedChannel });
        break;
      case 'isFilterOn':
        this.midiOutput?.sendControlChange(56, value, { channels: this.selectedChannel });
        break;
      default:
        console.warn("Unrecognized effect: ${effect}");
    }
  }

  onToneSelect(tone: Tone) {
    this.selectedTone = tone;

    if (this.midiOutput) {
      this.midiOutput.sendControlChange(19, tone.value, { channels: this.selectedChannel });
    }
  }

  sendProgramChange(program: number) {
    console.log('Send PC');
    if (this.midiOutput) {
      this.midiOutput.sendProgramChange(program, { channels: this.selectedChannel });
      this.activeProgram = program; // Aggiorna il programma attivo
    } else {
      console.warn('No MIDI Output available to send Program Change');
    }

    // this.requestAllCcValues();
  }

  // Funzioni per gestire gli slider
  onVolumeChange(volume: number, cc: number) {
    if (this.midiOutput) {
      this.midiOutput.sendControlChange(cc, volume, { channels: this.selectedChannel });
    } else {
      console.warn('No MIDI Output available to send volume change');
    }
  }

  // Funzione per resettare il volume e aggiornare lo slider
  resetVolume(cc: number) {
    if (cc === 41) {
      this.volume1 = 0; // Resetta volume1
      this.onVolumeChange(this.volume1, 41); // Invia il CC 41 con valore 0
    } else if (cc === 42) {
      this.volume2 = 0; // Resetta volume2
      this.onVolumeChange(this.volume2, 42); // Invia il CC 42 con valore 0
    }
  }

  setMaxVolume(cc: number) {
    const maxVolume = 127;
    if (cc === 41) {
        this.volume1 = maxVolume;
    } else if (cc === 42) {
        this.volume2 = maxVolume;
    }
    this.onVolumeChange(maxVolume, cc);
}


  onSelectMidiOutputChange(event: any) {
    const selectedId = event.target.value;
    const selectedOutput = this.aryMidiOutputs.find(output => output.id === selectedId);
    
    if (selectedOutput) {
      this.midiOutput = selectedOutput;
      this.selectedMidiOutput = selectedOutput.id;
      console.log("Selected MIDI Output: ${selectedOutput.name}");
    }
  }
  
  onSelectMidiInputChange(event: any) {
    const selectedId = event.target.value;
    const selectedInput = this.aryMidiInputs.find(input => input.id === selectedId);
    
    if (selectedInput) {
      this.midiInput = selectedInput;
      this.selectedMidiInput = selectedInput.id;
      this.midiInput.addListener('midimessage', this.handleMidiMessage.bind(this));
      console.log("Selected MIDI Input: ${selectedInput.name}");
    }
  }

  // requestAllCcValues() {
  //   console.log("requestAllCcValues");
  //   if (this.midiOutput) {
  //     const ccNumbers = [19, 41, 42, 51, 52, 53, 54, 55, 56]; // Lista dei CC da interrogare
  //     ccNumbers.forEach(cc => {
  //       const value = this.midiOutput?.sendControlChange(cc, 0, { channels: this.selectedChannel });
  //       console.log(`Requesting value for CC: ${cc}, returned value:`, value);
  //     });
  //   } else {
  //     console.warn('No MIDI output available to request CC values.');
  //   }
  // }
  
  

  
  
  

}