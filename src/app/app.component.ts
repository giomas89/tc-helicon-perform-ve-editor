import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebMidi, Output, Input } from 'webmidi';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

// Risorse CC
import { ccList, Tone } from './cc-list';
import { toggleDouble } from './CC/double';
import { toggleMorph } from './CC/morph';
import { toggleHardTune } from './CC/hardtune';
import { toggleXfx } from './CC/xfx';
import { toggleEcho } from './CC/echo';
import { toggleFilter } from './CC/filter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TC Helicon Perform VE'; 
  midiOutputs: Output[] = [];
  midiInputs: Input[] = [];
  midiOutput: Output | undefined;
  midiInput: Input | undefined;
  tones: Tone[] = []; 
  selectedChannel: number;
  selectedTone: Tone | null = null; 
  selectedMidiOutput: string | null = null;
  selectedMidiInput: string | null = null;

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
    this.midiOutputs = WebMidi.outputs;
    this.midiInputs = WebMidi.inputs;

    // Imposta il dispositivo MIDI OUT selezionato se disponibile
    this.selectedMidiOutput = this.midiOutputs.find(output =>
        output.name.toLowerCase().startsWith('perform-ve')
    )?.id || null;

    // Imposta il dispositivo MIDI IN selezionato se disponibile
    this.selectedMidiInput = this.midiInputs.find(input =>
        input.name.toLowerCase().startsWith('perform-ve')
    )?.id || null;

    // Log degli output e input MIDI
    console.log('Available MIDI Outputs:', this.midiOutputs);
    console.log('Available MIDI Inputs:', this.midiInputs);
}


  updateControlStates(controllerNumber: number, value: number) {
    switch (controllerNumber) {
      case 19:
        const selectedTone = this.tones.find(tone => tone.value === value);
        if (selectedTone) {
          this.selectedTone = selectedTone; 
          console.log(`Updated selected tone to: ${selectedTone.name}`);
        }
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
    }
  }

  onDeviceSelected(event: any) {
    const selectedId = event.target.value;
    this.midiOutput = WebMidi.getOutputById(selectedId);
    console.log(`Selected device ID: ${selectedId}`);
  }

  onInputDeviceSelected(event: any) {
    const selectedId = event.target.value;
    this.midiInput = WebMidi.getInputById(selectedId);
    console.log(`Selected input device ID: ${selectedId}`);
  }

  toggleEffect(effect: keyof typeof this.EffectStates) {
    // Invertire lo stato dell'effetto
    this.EffectStates[effect] = !this.EffectStates[effect];
    
    // Determinare il valore da inviare (127 per ON, 0 per OFF)
    const value = this.EffectStates[effect] ? 127 : 0;

    // Inviare il messaggio MIDI corrispondente
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
    }
  }

  onToneSelect(tone: Tone) {
    console.log(`Selected tone: ${tone.name}`);
    this.selectedTone = tone;

    if (this.midiOutput) {
        this.midiOutput.sendControlChange(19, tone.value, { channels: this.selectedChannel });
    }
  }

  sendProgramChange(program: number) {
    if (this.midiOutput) {
        this.midiOutput.sendProgramChange(program, { channels: this.selectedChannel });
        this.activeProgram = program; // Aggiorna il programma attivo
        console.log(`Sent Program Change: ${program} on channel ${this.selectedChannel}`);
    } else {
        console.warn('No MIDI Output available to send Program Change');
    }
  }

  // Funzioni per gestire gli slider
  onVolumeChange(volume: number, cc: number) {
    if (this.midiOutput) {
      this.midiOutput.sendControlChange(cc, volume, { channels: this.selectedChannel });
      console.log(`Sent volume change: ${volume} on CC ${cc}`);
    }
  }
}
