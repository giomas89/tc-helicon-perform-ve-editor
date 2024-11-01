import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiSettingsComponent } from './midi-settings.component';

describe('MidiSettingsComponent', () => {
  let component: MidiSettingsComponent;
  let fixture: ComponentFixture<MidiSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MidiSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidiSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
