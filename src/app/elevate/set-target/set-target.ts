import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-set-targets',
  imports: [FormsModule],
  templateUrl: './set-target.html',
  styleUrl: './set-target.css',
})
export class SetTarget {

  showEditModal = false;

  selectedKpi = {
    name: '',
    weight: 0
  };

  openEditKpi(name: string, weight: number): void {
    this.selectedKpi = { name, weight };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveKpi(): void {
    console.log('Updated KPI:', this.selectedKpi);
    this.showEditModal = false;
  }
}