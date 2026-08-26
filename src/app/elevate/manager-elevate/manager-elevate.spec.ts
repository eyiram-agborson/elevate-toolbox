import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerElevate } from './manager-elevate';

describe('ManagerElevate', () => {
  let component: ManagerElevate;
  let fixture: ComponentFixture<ManagerElevate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerElevate],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerElevate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
