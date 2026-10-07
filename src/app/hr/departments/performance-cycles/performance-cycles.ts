import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { Router, RouterLink } from '@angular/router';
import { ElevateApi, errorText } from '../../../core/elevate-api.service';
import { Cycle } from '../../../core/models';
import {
  PERIOD_LABELS,
  cycleName,
  cycleStage,
  dateInput,
  fmtDate,
  fmtRange,
  statusLabel,
} from '../../../core/format';

@Component({
  selector: 'app-performance-cycles',
  imports: [NzModalModule, NzStepsModule, FormsModule, RouterLink],
  templateUrl: './performance-cycles.html',
  styleUrl: './performance-cycles.css',
})
export class PerformanceCycles implements OnInit {
  private readonly api = inject(ElevateApi);
  private readonly router = inject(Router);

  readonly cycles = signal<Cycle[]>([]);
  readonly loading = signal(true);
  readonly pageError = signal('');
  readonly notice = signal('');

  // helpers for the template
  readonly fmtDate = fmtDate;
  readonly fmtRange = fmtRange;
  readonly statusLabel = statusLabel;
  readonly stage = cycleStage;
  readonly periods = Object.entries(PERIOD_LABELS);

  // modal (create or edit)
  isEditModal = false;
  editingId: string | null = null;
  readonly saving = signal(false);
  readonly formError = signal('');
  reviewPeriod = 'Q4';
  cycleName = '';
  startDate = '';
  endDate = '';
  targetStartDate = '';
  targetEndDate = '';
  reviewStartDate = '';
  reviewEndDate = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.cycles().subscribe({
      next: (list) => {
        this.cycles.set(list);
        this.loading.set(false);
      },
      error: (e) => {
        this.pageError.set(errorText(e, 'Could not load the performance cycles.'));
        this.loading.set(false);
      },
    });
  }

  stageIndex(cycle: Cycle): number {
    const s = cycleStage(cycle);
    return s === 'targets' ? 0 : s === 'review' ? 1 : 2;
  }

  goToDepartments(cycle?: Cycle): void {
    this.router.navigate(['/hr/departments'], cycle ? { queryParams: { cycle: cycle._id } } : {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openCreateModal(): void {
    this.editingId = null;
    this.formError.set('');
    this.reviewPeriod = 'Q4';
    const plus = (days: number) => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() + days);
      return dateInput(d);
    };
    this.startDate = plus(0);
    this.endDate = plus(90);
    this.targetStartDate = plus(0);
    this.targetEndDate = plus(8);
    this.reviewStartDate = plus(80);
    this.reviewEndDate = plus(90);
    this.updateCycleName();
    this.isEditModal = true;
  }

  openEditModal(cycle: Cycle): void {
    this.editingId = cycle._id;
    this.formError.set('');
    this.reviewPeriod = cycle.period;
    this.cycleName = cycle.name;
    this.startDate = dateInput(cycle.startDate);
    this.endDate = dateInput(cycle.endDate);
    this.targetStartDate = dateInput(cycle.targetStartDate);
    this.targetEndDate = dateInput(cycle.targetEndDate);
    this.reviewStartDate = dateInput(cycle.reviewStartDate);
    this.reviewEndDate = dateInput(cycle.reviewEndDate);
    this.isEditModal = true;
  }

  closeEditModal(): void {
    this.isEditModal = false;
  }

  updateCycleName(): void {
    this.cycleName = cycleName(this.reviewPeriod, this.startDate);
  }

  saveChanges(): void {
    const body = {
      name: this.cycleName,
      period: this.reviewPeriod as Cycle['period'],
      startDate: this.startDate,
      endDate: this.endDate,
      targetStartDate: this.targetStartDate,
      targetEndDate: this.targetEndDate,
      reviewStartDate: this.reviewStartDate,
      reviewEndDate: this.reviewEndDate,
    };
    if (Object.values(body).some((v) => !v)) {
      this.formError.set('Fill in every field, including the four window dates.');
      return;
    }

    this.saving.set(true);
    this.formError.set('');
    const editing = !!this.editingId;
    const request = this.editingId
      ? this.api.updateCycle(this.editingId, body)
      : this.api.createCycle(body);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.isEditModal = false;
        this.notice.set(editing ? 'Cycle updated.' : 'Cycle created. Activate it to open it to staff.');
        this.load();
      },
      error: (e) => {
        this.saving.set(false);
        this.formError.set(errorText(e));
      },
    });
  }

  activate(cycle: Cycle): void {
    this.api.activateCycle(cycle._id).subscribe({
      next: () => {
        this.notice.set(`${cycle.name} is now the active cycle.`);
        this.load();
      },
      error: (e) => this.pageError.set(errorText(e)),
    });
  }
}
