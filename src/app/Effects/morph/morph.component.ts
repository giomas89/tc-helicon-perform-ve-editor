import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { morphControls, MorphControl } from './cc-morph';
import { WebMidi, Output, Input } from 'webmidi';

@Component({
  selector: 'app-morph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './morph.component.html',
  styleUrls: ['./morph.component.css']
})
export class MorphComponent implements AfterViewInit {
  morphControls: MorphControl[] = morphControls;
  midiOutput: Output | undefined;
  midiInput: Input | undefined;
  selectedShiftValue: number = 64;
  isToggleActive: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.initializeMidiOutput();
  }

  ngAfterViewInit() {
    this.drawKnob();
    this.setupKnobInteraction();
  }

  get morphStyleControl(): MorphControl | undefined {
    return this.morphControls.find(control => control.cc === 24);
  }

  getSliderDescription(value: number): string {
    if (this.isToggleActive) {
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

  onSliderChange(event: any) {
    const newValue = +event.target.value;
    const morphControl = this.morphStyleControl; // Salva la variabile per una migliore leggibilità

    if (morphControl) {
      morphControl.currentValue = newValue;
      this.isToggleActive = false; // Spegne il toggle
      this.sendMidiMessage(morphControl.cc, newValue);
      this.drawKnob(); // Ridisegna il knob in base al nuovo valore
      this.cdr.detectChanges();
    }
  }

  onToggleButtonClick(value: number) {
    const morphControl = this.morphStyleControl; // Salva la variabile per una migliore leggibilità

    if (morphControl && morphControl.styles) { // Verifica che entrambe le variabili siano definite
      console.log(`Toggle button clicked: ${value}`);

      morphControl.styles.forEach(style => {
        if (style.id === value) {
          style.currentValue = 20; // Attiva il toggle
          const midiValue = style.id; // Invia i valori da 21 a 29
          this.sendMidiMessage(morphControl.cc, midiValue); // Invia il valore MIDI corretto
          console.log(`Sending MIDI: CC ${morphControl.cc}, Value ${midiValue}`); // Mostra il valore corretto
          this.isToggleActive = true; // Imposta il toggle come attivo
        } else {
          style.currentValue = 0; // Reset per i toggle non attivi
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
            this.midiInput.addListener('controlchange', (event: any) => {
              this.handleControlChange(event);
            });
            // Aggiungi il listener per i messaggi SysEx
            this.midiInput.addListener('sysex', (event: any) => {
              this.handleSysEx(event);
            });
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

    const ccNumber = event.data[1]; // CC number
    const ccValue = event.data[2]; // Valore

    console.log(`Received CC: ${ccNumber}, Value: ${ccValue}`);

    if (ccNumber === undefined) {
      console.warn('Control Change received without CC value.');
      return;
    }

    const control = this.morphControls.find(ctrl => ctrl.cc === ccNumber);

    if (control) {
      control.currentValue = ccValue;

      if (ccValue >= 21 && ccValue <= 29) {
        const styleId = ccValue - 21; // Calcola l'ID dello stile
        this.onToggleButtonClick(styleId); // Attiva il toggle corrispondente
        console.log(`Toggle activated for style ID: ${styleId}`);
        return;
      }

      if (ccValue >= 0 && ccValue <= 20) {
        this.selectedShiftValue = ccValue;
        this.drawKnob(); // Ridisegna il knob in base al valore CC ricevuto
        console.log(`Slider value updated to: ${this.selectedShiftValue}`);
      }

      this.cdr.detectChanges();
    } else {
      console.warn(`No control found for CC: ${ccNumber}`);
    }
  }

  handleSysEx(event: any) {
    console.log('SysEx message received:', event.data); // Elenca i dati SysEx ricevuti
    // Puoi elaborare ulteriormente i dati SysEx qui
  }

  drawKnob() {
    const canvas = <HTMLCanvasElement>document.getElementById('morph-style-knob');
    const ctx = canvas.getContext('2d');

    // Verifica che ctx non sia null
    if (ctx) {
        const value = this.morphStyleControl?.currentValue || 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 10;
        ctx.stroke();

        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (2 * Math.PI * (value / 20));
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 40, startAngle, endAngle, false);
        ctx.strokeStyle = '#e500e5';
        ctx.lineWidth = 10;
        ctx.stroke();
    } else {
        console.error('Failed to get canvas 2D context.');
    }
}


  setupKnobInteraction() {
    const canvas = <HTMLCanvasElement>document.getElementById('morph-style-knob');
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const angle = Math.atan2(y - canvas.height / 2, x - canvas.width / 2);
      const value = Math.round(((angle + Math.PI / 2) / (2 * Math.PI)) * 20);

      this.morphStyleControl!.currentValue = Math.max(0, Math.min(20, value));
      this.drawKnob();
      this.onKnobChange(this.morphStyleControl!.currentValue);
    });
  }

  onKnobChange(value: number) {
    // Logica per gestire il cambiamento del valore del knob
    console.log("Knob value changed to:", value);
    this.sendMidiMessage(this.morphStyleControl!.cc, value);
  }
  
}
