import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutivepageLayout } from './executivepage-layout';

describe('ExecutivepageLayout', () => {
  let component: ExecutivepageLayout;
  let fixture: ComponentFixture<ExecutivepageLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutivepageLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutivepageLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
