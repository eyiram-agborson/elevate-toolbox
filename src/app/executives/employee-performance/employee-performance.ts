import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { Cycle, EmployeeRow, ManagedUnit, Review } from '../../core/models';
import { newestFirst, pickCycle } from '../../core/cycle-context';
import { cycleName, fmtScore, personName } from '../../core/format';

type StatusFilter = 'all' | 'submitted' | 'not-submitted';

// Executives: every employee's review in a cycle, with the full review in a popup. Read-only in phase 1.
@Component({
  selector: 'app-employee-performance',
  imports: [FormsModule],
  templateUrl: './employee-performance.html',
  styleUrl: './employee-performance.css',
})
export class EmployeePerformance implements OnInit {
  private readonly api = inject(ElevateApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly cycles = signal<Cycle[]>([]);
  readonly units = signal<ManagedUnit[]>([]);
  readonly cycleId = signal('');
  readonly unitId = signal('');
  readonly rows = signal<EmployeeRow[]>([]);
  readonly search = signal('');
  readonly status = signal<StatusFilter>('all');
  readonly loading = signal(true);
  readonly error = signal('');

  /** The review shown in the popup. */
  readonly review = signal<Review | null>(null);
  readonly reviewLoading = signal(false);
  readonly reviewError = signal('');
  readonly popupOpen = signal(false);

  readonly fmtScore = fmtScore;
  readonly personName = personName;

  readonly visible = computed(() => {
    const q = this.search().trim().toLowerCase();
    const status = this.status();
    return this.rows().filter((r) => {
      if (q && !personName(r.staff).toLowerCase().includes(q)) return false;
      if (status === 'submitted') return this.isSubmitted(r);
      if (status === 'not-submitted') return !this.isSubmitted(r);
      return true;
    });
  });

  readonly reviewUnit = computed(() => {
    const u = this.review()?.unit;
    return u && typeof u !== 'string' ? u.name : '';
  });

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    this.unitId.set(q.get('unit') ?? '');
    this.api.units().subscribe({ next: (u) => this.units.set(u) });
    this.api.cycles().subscribe({
      next: (list) => {
        const sorted = newestFirst(list);
        this.cycles.set(sorted);
        const pick = pickCycle(sorted, q.get('cycle'));
        if (!pick) {
          this.loading.set(false);
          return;
        }
        this.cycleId.set(pick._id);
        this.load();
        const open = q.get('open');
        if (open) this.openById(open);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load performance cycles.'));
        this.loading.set(false);
      },
    });
  }

  label(c: Cycle): string {
    return c.name || cycleName(c.period, c.startDate);
  }

  isSubmitted(r: EmployeeRow): boolean {
    return !!r.reviewId && r.status !== 'DRAFT';
  }

  onCycleChange(id: string): void {
    this.cycleId.set(id);
    this.load();
  }

  onUnitChange(id: string): void {
    this.unitId.set(id);
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.employees(this.cycleId(), this.unitId() || undefined).subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load employees.'));
        this.loading.set(false);
      },
    });
  }

  goToManagerPerformance(): void {
    this.router.navigate(['executives/manager-performance'], {
      queryParams: { cycle: this.cycleId(), unit: this.unitId() || undefined },
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  openEmployeeDetails(row: EmployeeRow): void {
    if (row.reviewId) this.openById(row.reviewId);
  }

  private openById(id: string): void {
    this.popupOpen.set(true);
    this.review.set(null);
    this.reviewError.set('');
    this.reviewLoading.set(true);
    this.api.review(id).subscribe({
      next: (r) => {
        this.review.set(r);
        this.reviewLoading.set(false);
      },
      error: (e) => {
        this.reviewError.set(errorText(e, 'Could not load this review.'));
        this.reviewLoading.set(false);
      },
    });
  }

  closeEmployeeDetails(): void {
    this.popupOpen.set(false);
    this.review.set(null);
  }
}
