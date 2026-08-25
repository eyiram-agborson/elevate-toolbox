import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Elevate } from './elevate';

describe('Elevate', () => {
  let component: Elevate;
  let fixture: ComponentFixture<Elevate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Elevate],
    }).compileComponents();

    fixture = TestBed.createComponent(Elevate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
