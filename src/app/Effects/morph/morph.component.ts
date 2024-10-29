import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { morphControls, MorphControl } from './cc-morph';
import { WebMidi, Output, Input } from 'webmidi';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-morph',
  standalone: true,
  imports: [CommonModule, KnobModule, FormsModule],
  templateUrl: './morph.component.html',
  styleUrls: ['./morph.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MorphComponent implements AfterViewInit {
  morphControls: MorphControl[] = morphControls;
  midiOutput: Output | undefined;
  midiInput: Input | undefined;
  selectedShiftValue: number = 64;
  isStyleToggleActive: boolean = false;  // Rinominato da isToggleActive a isStyleToggleActive
  morphStyleValue: number = 0; // Shared value between slider and knob

  constructor(private cdr: ChangeDetectorRef) {
    this.initializeMidiOutput();
  }

  ngAfterViewInit() {}

  get morphStyleControl(): MorphControl | undefined {
    return this.morphControls.find(control => control.cc === 24);
  }

  getSliderDescription(value: number): string {
    if (this.isStyleToggleActive) {
      return 'SYNTH VOCODER';
    }
    const style = this.morphStyleControl?.styles?.find(s => s.id === value);
    return style ? style.name : '';
  }

  getRows(styles: any[]): any[][] {
    const rows = [];
    for (let i = 0; i < styles.length; i += 3) {
      rows.push(styles.slice(i, i + 3));
    }
    return rows;
  }

  onSliderChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).valueAsNumber;
    const morphControl = this.morphStyleControl;

    if (morphControl) {
      morphControl.currentValue = newValue;
      this.isStyleToggleActive = false; // Imposta a false quando si cambia lo slider
      this.sendMidiMessage(morphControl.cc, newValue);
      this.onKnobChange({ value: newValue }); // Sync the value with the knob
      this.cdr.detectChanges();
    }
  }

  onToggleButtonClick(value: number) {
    const morphControl = this.morphStyleControl;

    if (morphControl && morphControl.styles) {
      console.log(`Toggle button clicked: ${value}`);
      morphControl.styles.forEach(style => {
        style.currentValue = style.id === value ? 20 : 0;
        if (style.id === value) {
          this.sendMidiMessage(morphControl.cc, value);
          console.log(`Sending MIDI: CC ${morphControl.cc}, Value ${value}`);
          this.isStyleToggleActive = true; // Toggle attivato
        }
      });
      this.cdr.detectChanges();
    } else {
      console.warn('MorphStyleControl or its styles are undefined.');
    }
  }

  sendMidiMessage(cc: number, value: number) {
    if (this.midiOutput) {
      this.midiOutput.sendControlChange(cc, value);
      console.log(`Sent CC: ${cc}, Value: ${value}`);
    } else {
      console.warn('No MIDI output available to send messages.');
    }
  }

  initializeMidiOutput() {
    if (WebMidi.supported) {
      WebMidi.enable()
        .then(() => {
          this.midiOutput = WebMidi.outputs.find(output =>
            output.name.toLowerCase().startsWith('perform-ve')
          );

          if (this.midiOutput) {
            console.log(`MIDI Output initialized: ${this.midiOutput.name}`);
          } else {
            console.warn('No suitable MIDI output found.');
          }

          this.midiInput = WebMidi.inputs.find(input =>
            input.name.toLowerCase().startsWith('perform-ve')
          );

          if (this.midiInput) {
            this.midiInput.addListener('controlchange', event => this.handleControlChange(event));
            this.midiInput.addListener('sysex', event => this.handleSysEx(event));
          } else {
            console.warn('No suitable MIDI input found.');
          }
        })
        .catch(err => console.error('WebMidi could not be enabled', err));
    } else {
      console.error('WebMIDI is not supported by this browser.');
    }
  }

  handleControlChange(event: any) {
    console.log('MIDI event received:', event);

    const ccNumber = event.data[1];
    const ccValue = event.data[2];

    console.log(`Received CC: ${ccNumber}, Value: ${ccValue}`);

    if (ccNumber === undefined) {
      console.warn('Control Change received without CC value.');
      return;
    }

    const control = this.morphControls.find(ctrl => ctrl.cc === ccNumber);

    if (control) {
      control.currentValue = ccValue;

      if (ccValue >= 21 && ccValue <= 29) {
        const styleId = ccValue - 21;
        this.onToggleButtonClick(styleId);
        console.log(`Toggle activated for style ID: ${styleId}`);
        return;
      }

      if (ccValue >= 0 && ccValue <= 20) {
        this.selectedShiftValue = ccValue;
        console.log(`Slider value updated to: ${this.selectedShiftValue}`);
      }

      this.cdr.detectChanges();
    } else {
      console.warn(`No control found for CC: ${ccNumber}`);
    }
  }

  handleSysEx(event: any) {
    console.log('SysEx message received:', event.data);
  }

  onKnobChange(event: { value: number }) {
    this.morphStyleValue = event.value;
    const percentage = this.calculatePercentage(this.morphStyleValue);
    console.log(`Knob changed: ${this.morphStyleValue} (${percentage}%)`);
    this.sendMidiMessage(this.morphStyleControl!.cc, this.morphStyleValue);
    this.cdr.detectChanges(); // Rileva le modifiche
  }

  calculatePercentage(value: number): string {
    if (value === 0 && this.isStyleToggleActive) { // Controlla se è zero e se un toggle è attivo
      return 'FIXED'; // Restituisce "-" per il valore 0
    }
    return `${value * 5}%`; // Altrimenti, restituisce la percentuale
  }
}
