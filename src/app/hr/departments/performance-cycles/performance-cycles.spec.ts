import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceCycles } from './performance-cycles';

describe('PerformanceCycles', () => {
  let component: PerformanceCycles;
  let fixture: ComponentFixture<PerformanceCycles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceCycles],
    }).compileComponents();

    fixture = TestBed.createComponent(PerformanceCycles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
