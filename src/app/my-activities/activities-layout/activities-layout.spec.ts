import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesLayout } from './activities-layout';

describe('ActivitiesLayout', () => {
  let component: ActivitiesLayout;
  let fixture: ComponentFixture<ActivitiesLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
