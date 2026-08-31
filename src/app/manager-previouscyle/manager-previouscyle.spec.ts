import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPreviouscyle } from './manager-previouscyle';

describe('ManagerPreviouscyle', () => {
  let component: ManagerPreviouscyle;
  let fixture: ComponentFixture<ManagerPreviouscyle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerPreviouscyle],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerPreviouscyle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
