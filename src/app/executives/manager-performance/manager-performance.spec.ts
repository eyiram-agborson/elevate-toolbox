import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPerformance } from './manager-performance';

describe('ManagerPerformance', () => {
  let component: ManagerPerformance;
  let fixture: ComponentFixture<ManagerPerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerPerformance],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerPerformance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
