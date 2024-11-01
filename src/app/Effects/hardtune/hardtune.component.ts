import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MidiService } from '../../midi-settings.service';
import { hardtuneControls, HardtuneControl, Key } from './cc-hardtune';
import { KnobModule } from 'primeng/knob';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hardtune',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, KnobModule],
  templateUrl: './hardtune.component.html',
  styleUrls: ['./hardtune.component.css']
})
export class HardtuneComponent implements OnInit, OnDestroy {
  keys: Key[] = [];
  selectedKey: Key | null = null;
  hardtuneControls: HardtuneControl[] = hardtuneControls;
  hardtuneAmountValue: number = 0; // Shared value between slider and knob
  private midiMessageSubscription: Subscription | undefined;

  constructor(private cdr: ChangeDetectorRef, public midiService: MidiService) {}

  ngOnInit(): void {
    this.initializeKeys();
    // Iscrivi al servizio per i messaggi MIDI ricevuti
    this.midiMessageSubscription = this.midiService.midiMessageSubject.subscribe(message => {
      this.handleIncomingMidiMessage(message);
    });
  }

  ngOnDestroy(): void {
    // Disiscrivi dalla sottoscrizione per evitare perdite di memoria
    this.midiMessageSubscription?.unsubscribe();
  }

  initializeKeys() {
    const keyCC = this.hardtuneControls.find(control => control.cc === 19);
    if (keyCC && keyCC.keys) {
      this.keys = keyCC.keys; // Assicurati che ci sia un array di keys
    }
  }

  onKeySelect(key: Key) {
    this.selectedKey = key;
    this.midiService.sendControlChange(19, key.id); // Invia la chiave selezionata all'output MIDI
  }

  get hardtuneAmountControl(): HardtuneControl | undefined {
    return this.hardtuneControls.find(control => control.cc === 20); // Control Change per Hardtune Amount
  }

  onKnobChange(event: { value: number }) {
    this.hardtuneAmountValue = event.value;
    this.midiService.sendControlChange(this.hardtuneAmountControl?.cc || 20, this.hardtuneAmountValue);
    
    const percentage = this.calculatePercentage(this.hardtuneAmountValue);
    console.log(`HARDTUNE AMOUNT - Knob changed: ${this.hardtuneAmountValue} (${percentage}%)`);
  }

  calculatePercentage(value: number): string {
    return `${(value / 127 * 100).toFixed(0)}%`;
  }

  private handleIncomingMidiMessage(message: number[]) {
    const [status, controllerNumber, value] = message;
    console.log("Received MIDI message in Hardtune:", message);
    
    // Your existing logic for processing messages
    if (controllerNumber === 19) {
      const updatedKey = this.keys.find(key => key.id === value);
      if (updatedKey) {
        this.selectedKey = updatedKey;
        console.log(`Updated selected key to: ${updatedKey}`);
      }
    }
    if (controllerNumber === 20) {
      this.hardtuneAmountValue = value;
      console.log(`Updated hardtune amount to: ${value}`);
      this.cdr.detectChanges(); // Force UI update
    }
  }
}
