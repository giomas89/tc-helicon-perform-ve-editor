import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XfxComponent } from './xfx.component';

describe('XfxComponent', () => {
  let component: XfxComponent;
  let fixture: ComponentFixture<XfxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XfxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XfxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
