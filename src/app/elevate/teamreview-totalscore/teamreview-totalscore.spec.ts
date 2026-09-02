import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamreviewTotalscore } from './teamreview-totalscore';

describe('TeamreviewTotalscore', () => {
  let component: TeamreviewTotalscore;
  let fixture: ComponentFixture<TeamreviewTotalscore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamreviewTotalscore],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamreviewTotalscore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
