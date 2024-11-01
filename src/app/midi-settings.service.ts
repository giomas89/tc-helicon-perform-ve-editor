import { Injectable, NgZone } from '@angular/core';
import { WebMidi, Output, Input } from 'webmidi';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MidiService {
  aryMidiOutputs: Output[] = [];
  aryMidiInputs: Input[] = [];
  midiOutput: Output | undefined;
  midiInput: Input | undefined;
  selectedMidiOutput: string | null = null;
  selectedMidiInput: string | null = null;
  selectedChannel: number = 1;
  
  // Subject to emit MIDI messages
  midiMessageSubject = new Subject<number[]>();

  constructor(private ngZone: NgZone) {
    this.enableWebMidi();
  }

  private enableWebMidi() {
    console.log('enableWebMidi');
    if (WebMidi.supported) {
      WebMidi.enable()
        .then(() => this.onMidiEnabled())
        .catch(err => console.error('WebMidi could not be enabled', err));
    } else {
      console.error('WebMIDI is not supported by this browser.');
    }
  }

  private onMidiEnabled() {
    // Populate MIDI inputs and outputs
    this.updateMidiDevices();

    // Automatically select MIDI devices after they are found
    this.autoSelectMidiDevices();

    // Listen for changes in MIDI inputs and outputs
    WebMidi.addListener('connected', this.onMidiDeviceChange.bind(this));
    WebMidi.addListener('disconnected', this.onMidiDeviceChange.bind(this));
  }

  private updateMidiDevices() {
    this.aryMidiOutputs = WebMidi.outputs;
    this.aryMidiInputs = WebMidi.inputs;
    console.log('Updated MIDI Inputs:', this.aryMidiInputs, 'Updated MIDI Outputs:', this.aryMidiOutputs);
  }

  private autoSelectMidiDevices() {
    // Automatically select MIDI Output
    this.midiOutput = this.aryMidiOutputs.find(output =>
      output.name.toLowerCase().startsWith('perform-ve')
    );
    console.log('midiOutput:', this.midiOutput);

    // Automatically select MIDI Input
    this.midiInput = this.aryMidiInputs.find(input =>
      input.name.toLowerCase().startsWith('perform-ve')
    );
    console.log('midiInput:', this.midiInput);

    if (this.midiInput) {
      this.midiInput.addListener('midimessage', this.handleMidiMessage.bind(this));
      console.log(`Selected MIDI Input: ${this.midiInput.name}`);
    }

    if (this.midiOutput) {
      console.log(`Selected MIDI Output: ${this.midiOutput.name}`);
    }
  }

  private onMidiDeviceChange() {
    this.ngZone.run(() => {
      this.updateMidiDevices();
      // Automatically re-select devices after a change
      this.autoSelectMidiDevices();
    });
  }

  onSelectMidiOutputChange(event: any) {
    const selectedId = event.target.value;
    const selectedOutput = this.aryMidiOutputs.find(output => output.id === selectedId);

    if (selectedOutput) {
      this.midiOutput = selectedOutput;
      this.selectedMidiOutput = selectedOutput.id;
      console.log(`Selected MIDI Output: ${selectedOutput.name}`);
    }
  }

  onSelectMidiInputChange(event: any) {
    const selectedId = event.target.value;
    const selectedInput = this.aryMidiInputs.find(input => input.id === selectedId);

    if (selectedInput) {
      // Remove previous listener if it exists
      if (this.midiInput) {
        this.midiInput.removeListener('midimessage', this.handleMidiMessage.bind(this));
      }

      this.midiInput = selectedInput;
      this.selectedMidiInput = selectedInput.id;
      this.midiInput.addListener('midimessage', this.handleMidiMessage.bind(this));
      console.log(`Selected MIDI Input: ${selectedInput.name}`);
    }
  }

  // Change the parameter type to WebMidi.MIDIMessageEvent
  handleMidiMessage(message: any) {
    const [status, controllerNumber, value] = message.data;
    console.log("RECEIVED MIDI message:", message.data); // Log dei messaggi MIDI ricevuti
    this.updateControlStates(controllerNumber, value);
  }
// Aggiungi questo metodo alla tua classe MidiService
private updateControlStates(controllerNumber: number, value: number) {
  // Logica per aggiornare gli stati dei controlli
  console.log(`Updating control states with CC: ${controllerNumber}, Value: ${value}`);
  
  // Puoi aggiungere la logica specifica per aggiornare gli stati dei tuoi controlli qui.
  // Ad esempio, potresti utilizzare un Subject per notificare altre parti della tua applicazione.
  
  // Esempio di emissione del messaggio
  this.midiMessageSubject.next([controllerNumber, value]);
}
  sendControlChange(cc: number, value: number) {
    if (this.midiOutput) {
      this.midiOutput.sendControlChange(cc, value, { channels: this.selectedChannel });
    } else {
      console.warn('No MIDI Output available to send Control Change');
    }
  }

  sendProgramChange(program: number) {
    if (this.midiOutput) {
      this.midiOutput.sendProgramChange(program, { channels: this.selectedChannel });
    } else {
      console.warn('No MIDI Output available to send Program Change');
    }
  }
}