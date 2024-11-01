import { TestBed } from '@angular/core/testing';

import { MidiSettingsService } from './midi-settings.service';

describe('MidiSettingsService', () => {
  let service: MidiSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MidiSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
