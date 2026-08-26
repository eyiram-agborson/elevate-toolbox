import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserElevate } from './user-elevate';

describe('UserElevate', () => {
  let component: UserElevate;
  let fixture: ComponentFixture<UserElevate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserElevate],
    }).compileComponents();

    fixture = TestBed.createComponent(UserElevate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
