import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetTarget } from './set-target';

describe('SetTarget', () => {
  let component: SetTarget;
  let fixture: ComponentFixture<SetTarget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetTarget],
    }).compileComponents();

    fixture = TestBed.createComponent(SetTarget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
