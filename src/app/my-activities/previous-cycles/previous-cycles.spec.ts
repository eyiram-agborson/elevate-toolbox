import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousCycles } from './previous-cycles';

describe('PreviousCycles', () => {
  let component: PreviousCycles;
  let fixture: ComponentFixture<PreviousCycles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousCycles],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviousCycles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
