import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'myapp' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('myapp');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, myapp');
  });


  describe('MIDI Message Handling', () => {
    let component: AppComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    });

    it('should handle Note On messages', () => {
      const event = new MessageEvent('MIDI', { data: [144, 60, 100] }); // Note On, middle C, velocity 100
      component.handleMidiMessage(event);
      // Add assertions to check if the note is played or state is updated accordingly
    });

    it('should handle Note Off messages', () => {
      const event = new MessageEvent('MIDI', { data: [128, 60, 0] }); // Note Off, middle C
      component.handleMidiMessage(event);
      // Add assertions to check if the note is stopped or state is updated accordingly
    });

    it('should handle other MIDI messages (e.g., Control Change)', () => {
      const event = new MessageEvent('MIDI', { data: [176, 7, 127] }); // Control Change, channel 1, controller 7, value 127
      component.handleMidiMessage(event);
      // Add assertions to check for specific behavior based on the message type
    });
  });

  describe('Effect Toggling', () => {
    let component: AppComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    });

    it('should toggle effects on/off', () => {
      // Test with a valid effect name
      const effectName = 'isHardTuneOn'; 
      component.toggleEffect(effectName); 
      expect(component.EffectStates[effectName]).toBe(true); 

      component.toggleEffect(effectName); 
      expect(component.EffectStates[effectName]).toBe(false); 
    });
  });

  describe('Volume Changes', () => {
    let component: AppComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    });
    it('should update volume1 when onVolumeChange is called with volume and cc number', () => {
      component.onVolumeChange(0.75, 41); // Call with volume and CC number
      expect(component.volume1).toBe(0.75);
    });
  });

});

@Component({
  selector: 'app-synth',
  template: ''
})
class MockSynthComponent {
  // Mock necessary properties and methods of the SynthComponent
  // For example, if SynthComponent has a playNote() method:
  // playNote(note: number, velocity: number) { /* Mock implementation */ }
}

@Component({
  selector: 'app-effects-rack',
  template: ''
})
class MockEffectsRackComponent {
  // Mock necessary properties and methods of the EffectsRackComponent
}

@Component({
  selector: 'app-keyboard',
  template: ''
})
class MockKeyboardComponent {
  // Mock necessary properties and methods of the KeyboardComponent
}
