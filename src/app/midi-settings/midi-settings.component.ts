import { Component } from '@angular/core';
import { MidiService } from '../midi-settings.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-midi-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './midi-settings.component.html',
  styleUrls: ['./midi-settings.component.css']
})
export class MidiSettingsComponent {
  constructor(public midiService: MidiService) {}

  ngOnInit() {
    console.log('midi-setting.component.ts - ngOnInit')
    // Seleziona automaticamente i dispositivi MIDI all'inizio
    this.autoSelectMidiDevices();
  }

  autoSelectMidiDevices() {
    // Seleziona automaticamente il dispositivo MIDI Output
    this.midiService.midiOutput = this.midiService.aryMidiOutputs.find(output =>
      output.name.toLowerCase().startsWith('perform-ve')
    );
    console.log('midiOutput:',this.midiService.midiOutput);

    // Seleziona automaticamente il dispositivo MIDI Input
    this.midiService.midiInput = this.midiService.aryMidiInputs.find(input =>
      input.name.toLowerCase().startsWith('perform-ve')
    );
     console.log('midiInput:',this.midiService.midiInput);

    if (this.midiService.midiInput) {
      this.midiService.midiInput.addListener('midimessage', this.midiService.handleMidiMessage.bind(this.midiService));
      console.log(`Selected MIDI Input: ${this.midiService.midiInput.name}`);
    }

    if (this.midiService.midiOutput) {
      console.log(`Selected MIDI Output: ${this.midiService.midiOutput.name}`);
    }
  }

  onSelectMidiOutputChange(event: any) {
    this.midiService.onSelectMidiOutputChange(event);
    const selectedOutput = this.midiService.midiOutput;
    if (selectedOutput) {
      console.log("Selected MIDI Output:", selectedOutput.name);
    }
  }

  onSelectMidiInputChange(event: any) {
    this.midiService.onSelectMidiInputChange(event);
  }
}
