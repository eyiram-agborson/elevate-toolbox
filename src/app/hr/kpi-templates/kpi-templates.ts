import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-kpi-templates',
  imports: [ReactiveFormsModule],
  templateUrl: './kpi-templates.html',
  styleUrl: './kpi-templates.css',
})
export class KpiTemplates {

  isEditKpi = false;
  showAddTemplateModal = false;

  kpiForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.kpiForm = this.fb.group({
      department: ['Client-side Engineering'],
      jobRole: ['Software Engineer'],
      kpis: this.fb.array([
        this.createKpi(
          'Application Development & Delivery',
          60,
          'Deliver assigned work within agreed sprint timelines.'
        ),
        this.createKpi(
          'Operational Efficiency & Code Quality',
          40,
          'Maintain code quality and review standards.'
        )
      ])
    });
  }

  createKpi(name = '', weight = 0, description = ''): FormGroup {
    return this.fb.group({
      name: [name],
      weight: [weight],
      description: [description]
    });
  }

  get kpis(): FormArray {
    return this.kpiForm.get('kpis') as FormArray;
  }

  addKpi(): void {
    this.kpis.push(this.createKpi());
  }

  removeKpi(index: number): void {
    this.kpis.removeAt(index);
  }

  get totalWeight(): number {
    return this.kpis.controls.reduce((total, kpi) => {
      return total + Number(kpi.get('weight')?.value || 0);
    }, 0);
  }

  openEditKpi(): void {
    this.isEditKpi = true;
  }

  closeEditKpi(): void {
    this.isEditKpi = false;
  }

  saveTemplate(): void {
    console.log(this.kpiForm.value);
    this.isEditKpi = false;
  }

  openAddTemplate(): void {
    this.showAddTemplateModal = true;
  }

  closeAddTemplate(): void {
    this.showAddTemplateModal = false;
  }
}