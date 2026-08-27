import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyActivities } from './my-activities';

describe('MyActivities', () => {
  let component: MyActivities;
  let fixture: ComponentFixture<MyActivities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyActivities],
    }).compileComponents();

    fixture = TestBed.createComponent(MyActivities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
