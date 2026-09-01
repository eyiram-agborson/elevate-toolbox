import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamReview } from './team-review';

describe('TeamReview', () => {
  let component: TeamReview;
  let fixture: ComponentFixture<TeamReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamReview],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
