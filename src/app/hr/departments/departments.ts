import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { Cycle, DepartmentRow } from '../../core/models';
import { cycleName, fmtDate } from '../../core/format';

// HR: how far each department has got with its reviews in a chosen cycle.
@Component({
  selector: 'app-departments',
  imports: [NzProgressModule, FormsModule, CommonModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments implements OnInit {
  private readonly api = inject(ElevateApi);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly cycles = signal<Cycle[]>([]);
  readonly selectedCycleId = signal('');
  readonly rows = signal<DepartmentRow[]>([]);
  readonly search = signal('');
  readonly loading = signal(true);
  readonly error = signal('');

  readonly selectedCycle = computed(
    () => this.cycles().find((c) => c._id === this.selectedCycleId()) ?? null,
  );
  readonly isHistoricalCycle = computed(() => this.selectedCycle()?.status === 'CLOSED');

  readonly visibleRows = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.rows().filter((r) => !q || r.unit.name.toLowerCase().includes(q));
  });

  readonly cycleName = cycleName;
  readonly fmtDate = fmtDate;

  label(c: Cycle): string {
    return c.name || cycleName(c.period, c.startDate);
  }

  statusText(c: Cycle): string {
    return c.status === 'ACTIVE' ? 'Active' : c.status === 'CLOSED' ? 'Completed' : 'Upcoming';
  }

  percent(r: DepartmentRow): number {
    return r.staffCount ? Math.round((r.managerReviewCount / r.staffCount) * 100) : 0;
  }

  ngOnInit(): void {
    this.api.cycles().subscribe({
      next: (list) => {
        const sorted = [...list].sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        );
        this.cycles.set(sorted);
        const wanted = this.route.snapshot.queryParamMap.get('cycle');
        const pick =
          sorted.find((c) => c._id === wanted) ?? sorted.find((c) => c.status === 'ACTIVE') ?? sorted[0];
        if (!pick) {
          this.loading.set(false);
          return;
        }
        this.selectedCycleId.set(pick._id);
        this.load();
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load performance cycles.'));
        this.loading.set(false);
      },
    });
  }

  onCycleChange(id: string): void {
    this.selectedCycleId.set(id);
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.departments(this.selectedCycleId()).subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load departments.'));
        this.loading.set(false);
      },
    });
  }

  goToDepartmentDetails(row: DepartmentRow): void {
    this.router.navigate(['/hr/departments', row.unit._id], {
      queryParams: { cycle: this.selectedCycleId() },
    });
  }
}
