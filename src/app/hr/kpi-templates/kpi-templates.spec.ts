import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiTemplates } from './kpi-templates';

describe('KpiTemplates', () => {
  let component: KpiTemplates;
  let fixture: ComponentFixture<KpiTemplates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiTemplates],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiTemplates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
