import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReview } from './employee-review';

describe('EmployeeReview', () => {
  let component: EmployeeReview;
  let fixture: ComponentFixture<EmployeeReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeReview],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
