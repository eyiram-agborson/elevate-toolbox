import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-performance-cycles',
  imports: [NzModalModule, NzStepsModule, FormsModule, RouterLink],
  templateUrl: './performance-cycles.html',
  styleUrl: './performance-cycles.css',
})
export class PerformanceCycles {

  isEditModal = false;

  selectedCycle = '';
  reviewPeriod = 'Q3';
  cycleName = 'ELEVATE – Q3 (July – September 2026)';
  startDate = '2026-07-22';
  endDate = '2026-10-07';

  openEditModal(cycle: string): void {
    this.selectedCycle = cycle;

    if (cycle === 'Q3') {
      this.reviewPeriod = 'Q3';
      this.cycleName = 'ELEVATE – Q3 (July – September 2026)';
      this.startDate = '2026-07-22';
      this.endDate = '2026-10-07';
    }

    this.isEditModal = true;
  }

  closeEditModal(): void {
    this.isEditModal = false;
  }

  saveChanges(): void {
    this.isEditModal = false;
  }

  updateCycleName(): void {
    const periods: Record<string, string> = {
      Q1: 'January – March',
      Q2: 'April – June',
      Q3: 'July – September',
      Q4: 'October – December',
    };

    this.cycleName =
      `ELEVATE – ${this.reviewPeriod} (${periods[this.reviewPeriod]} ${this.getYear()})`;
  }

  getYear(): string {
    return this.startDate
      ? new Date(this.startDate).getFullYear().toString()
      : '2026';
  }
}