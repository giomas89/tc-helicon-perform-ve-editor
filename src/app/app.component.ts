import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MidiService } from './midi-settings.service';
import { DoubleComponent } from './Effects/double/double.component';
import { MorphComponent } from './Effects/morph/morph.component';
import { HardtuneComponent } from './Effects/hardtune/hardtune.component';
import { XfxComponent } from './Effects/xfx/xfx.component';
import { EchoComponent } from './Effects/echo/echo.component';
import { FilterComponent } from './Effects/filter/filter.component';
import { MidiSettingsComponent } from './midi-settings/midi-settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    TabViewModule,
    MidiSettingsComponent,
    DoubleComponent,
    MorphComponent,
    HardtuneComponent,
    XfxComponent,
    EchoComponent,
    FilterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
  title = 'TC Helicon Perform VE';
  activeTab: string | null = 'hardtune'; // Allowing string and initializing with 'double'

  // Stato degli effetti
  EffectStates = {
    isHardTuneOn: false,
    isMorphOn: false,
    isDoubleOn: false,
    isXfxOn: false,
    isEchoOn: false,
    isFilterOn: false,
  };

  activeProgram: number | null = null;

  constructor(private cdr: ChangeDetectorRef, public midiService: MidiService) {}

  ngOnInit(): void {
   // Ascolta i messaggi MIDI dal servizio
    this.midiService.midiMessageSubject.subscribe((message) => {
      const [status, controllerNumber, value] = message;
      this.updateControlStates(controllerNumber, value);
    });
  }

  updateControlStates(controllerNumber: number, value: number) {
    console.log('upd:', controllerNumber, value);
    switch (controllerNumber) {
      case 19:
        break;
      case 41:
        // Aggiorna il volume 1
        break;
      case 42:
        // Aggiorna il volume 2
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
        console.warn(`Unrecognized controller number: ${controllerNumber}`);
    }

    this.cdr.detectChanges(); // Forza il rilevamento dei cambiamenti
  }

  toggleEffect(effect: keyof typeof this.EffectStates) {
    // Invertire lo stato dell'effetto
    this.EffectStates[effect] = !this.EffectStates[effect];
    
    // Determinare il valore da inviare (127 per ON, 0 per OFF)
    const value = this.EffectStates[effect] ? 127 : 0;

    // INVIA il messaggio MIDI corrispondente
    switch (effect) {
      case 'isDoubleOn':
        this.midiService.midiOutput?.sendControlChange(51, value, { channels: this.midiService.selectedChannel });
        break;
      case 'isMorphOn':
        this.midiService.midiOutput?.sendControlChange(52, value, { channels: this.midiService.selectedChannel });
        break;
      case 'isHardTuneOn':
        this.midiService.midiOutput?.sendControlChange(53, value, { channels: this.midiService.selectedChannel });
        break;
      case 'isXfxOn':
        this.midiService.midiOutput?.sendControlChange(54, value, { channels: this.midiService.selectedChannel });
        break;
      case 'isEchoOn':
        this.midiService.midiOutput?.sendControlChange(55, value, { channels: this.midiService.selectedChannel });
        break;
      case 'isFilterOn':
        this.midiService.midiOutput?.sendControlChange(56, value, { channels: this.midiService.selectedChannel });
        break;
      default:
        console.warn(`Unrecognized effect: ${effect}`);
    }
  }

  sendProgramChange(program: number) {
    console.log('Send PC');
    this.midiService.midiOutput?.sendProgramChange(program, { channels: this.midiService.selectedChannel });
    this.activeProgram = program; // Aggiorna il programma attivo
  }

  // Funzioni per gestire gli slider
  onVolumeChange(volume: number, cc: number) {
    this.midiService.midiOutput?.sendControlChange(cc, volume, { channels: this.midiService.selectedChannel });
  }

  resetVolume(cc: number) {
    if (cc === 41) {
      // Resetta volume1
      this.onVolumeChange(0, 41); // Invia il CC 41 con valore 0
    } else if (cc === 42) {
      // Resetta volume2
      this.onVolumeChange(0, 42); // Invia il CC 42 con valore 0
    }
  }

  setMaxVolume(cc: number) {
    const maxVolume = 127;
    this.onVolumeChange(maxVolume, cc);
  }

  onSelectMidiOutputChange(event: any) {
    const selectedId = event.target.value;
    this.midiService.selectedMidiOutput = selectedId;
    const selectedOutput = this.midiService.aryMidiOutputs.find(output => output.id === selectedId);
    
    if (selectedOutput) {
      this.midiService.midiOutput = selectedOutput;
      console.log(`Selected MIDI Output: ${selectedOutput.name}`);
    }
  }

  onSelectMidiInputChange(event: any) {
    const selectedId = event.target.value;
    this.midiService.selectedMidiInput = selectedId;
    const selectedInput = this.midiService.aryMidiInputs.find(input => input.id === selectedId);
    
    // if (selectedInput) {
    //   this.midiService.midiInput = selectedInput;
    //   this.midiService.midiInput.addListener('midimessage', this.midiService.handleMidiMessage.bind(this));
    //   console.log(`Selected MIDI Input: ${selectedInput.name}`);
    // }
  }
}
