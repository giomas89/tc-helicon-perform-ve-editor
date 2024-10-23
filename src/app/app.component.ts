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
  isHardTuneOn: boolean = false;
  isMorphOn: boolean = false;
  isDoubleOn: boolean = false;
  isXfxOn: boolean = false;
  isEchoOn: boolean = false;
  isFilterOn: boolean = false;
  hardTuneKey: number = 0;
  importoHardTune: number = 0;

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

    this.midiOutput = this.midiOutputs.find(output =>
        output.name.includes('Perform-VE') || output.name === 'Perform-VE MIDI Out'
    );
    if (this.midiOutput) {
        console.log(`Selected MIDI Output: ${this.midiOutput.name}`);
    } else {
        console.warn('No MIDI Output found for "Perform-VE" or "Perform-VE MIDI Out"');
    }

    this.midiInput = this.midiInputs.find(input =>
        input.name.includes('Perform-VE') || input.name === 'Perform-VE MIDI In'
    );
    if (this.midiInput) {
        console.log(`Selected MIDI Input: ${this.midiInput.name}`);

        this.midiInput.addListener('controlchange', (event: any) => {
            console.log('Control Change Event:', event);
            this.updateControlStates(event.controller.number, event.rawValue ?? 0);
            this.cdr.detectChanges();
        });
    } else {
        console.warn('No MIDI Input found for "Perform-VE" or "Perform-VE MIDI In"');
    }
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
      case 51:
        this.isDoubleOn = value === 64;
        break;
      case 52:
        this.isMorphOn = value === 64;
        break;
      case 53:
        this.isHardTuneOn = value === 64;
        break;
      case 54:
        this.isXfxOn = value === 64;
        break;
      case 55:
        this.isEchoOn = value === 64;
        break;
      case 56:
        this.isFilterOn = value === 64;
        break;
      // default:
      //   console.warn(`Unhandled Controller Number: ${controllerNumber} with value: ${value}`);
      //   break;
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

  toggleDouble() {
    this.isDoubleOn = toggleDouble(this.midiOutput, this.isDoubleOn, this.selectedChannel);
  }

  toggleMorph() {
    this.isMorphOn = toggleMorph(this.midiOutput, this.isMorphOn, this.selectedChannel);
  }

  toggleHardTune() {
    this.isHardTuneOn = toggleHardTune(this.midiOutput, this.isHardTuneOn, this.selectedChannel);
  }

  toggleXfx() {
    this.isXfxOn = toggleXfx(this.midiOutput, this.isXfxOn, this.selectedChannel);
  }

  toggleEcho() {
    this.isEchoOn = toggleEcho(this.midiOutput, this.isEchoOn, this.selectedChannel);
  }

  toggleFilter() {
    this.isFilterOn = toggleFilter(this.midiOutput, this.isFilterOn, this.selectedChannel);
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
        console.log(`Sent Program Change: ${program} on channel ${this.selectedChannel}`);
    } else {
        console.warn('No MIDI Output available to send Program Change');
    }
}
}