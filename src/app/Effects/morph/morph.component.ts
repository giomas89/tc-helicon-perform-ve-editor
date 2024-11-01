import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { morphControls, MorphControl } from './cc-morph';
import { MidiService } from '../../midi-settings.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { KnobModule } from 'primeng/knob';
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
  selectedShiftValue: number = 64;
  isStyleToggleActive: boolean = false;  // Rinominato da isToggleActive a isStyleToggleActive
  morphStyleValue: number = 0; // Shared value between slider and knob

  constructor(private cdr: ChangeDetectorRef, private midiService: MidiService) {
    // Non è più necessario inizializzare l'output MIDI qui
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
      this.midiService.sendControlChange(morphControl.cc, newValue); // Invia il messaggio MIDI tramite il servizio
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
          this.midiService.sendControlChange(morphControl.cc, value); // Invia il messaggio MIDI tramite il servizio
          console.log(`Sending MIDI: CC ${morphControl.cc}, Value ${value}`);
          this.isStyleToggleActive = true; // Toggle attivato
        }
      });
      this.cdr.detectChanges();
    } else {
      console.warn('MorphStyleControl or its styles are undefined.');
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

  onKnobChange(event: { value: number }) {
    this.morphStyleValue = event.value;
    const percentage = this.calculatePercentage(this.morphStyleValue);
    console.log(`Knob changed: ${this.morphStyleValue} (${percentage}%)`);
    this.midiService.sendControlChange(this.morphStyleControl!.cc, this.morphStyleValue); // Invia il messaggio MIDI tramite il servizio
    this.cdr.detectChanges(); // Rileva le modifiche
  }

  calculatePercentage(value: number): string {
    if (value === 0 && this.isStyleToggleActive) { // Controlla se è zero e se un toggle è attivo
      return 'FIXED'; // Restituisce "-" per il valore 0
    }
    return `${value * 5}%`; // Altrimenti, restituisce la percentuale
  }
}
