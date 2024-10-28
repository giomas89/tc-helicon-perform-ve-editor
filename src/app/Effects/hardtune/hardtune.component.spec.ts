import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardtuneComponent } from './hardtune.component';

describe('HardtuneComponent', () => {
  let component: HardtuneComponent;
  let fixture: ComponentFixture<HardtuneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HardtuneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HardtuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
