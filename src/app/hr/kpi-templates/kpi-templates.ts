import { Component } from '@angular/core';

@Component({
  selector: 'app-kpi-templates',
  imports: [],
  templateUrl: './kpi-templates.html',
  styleUrl: './kpi-templates.css',
})
export class KpiTemplates {

  isEditKpi = false;

openEditKpi(): void {
  this.isEditKpi= true;
}

closeEditKpi(): void {
  this.isEditKpi= false;
}

saveTemplate(): void {
  this.isEditKpi= false;
}

showAddTemplateModal = false;

openAddTemplate(): void {
  this.showAddTemplateModal = true;
}

closeAddTemplate(): void {
  this.showAddTemplateModal = false;
}

}
