import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ElevateApi, errorText } from '../../../core/elevate-api.service';
import { Cycle, DepartmentRow, EmployeeRow, ManagerRow, ReviewStatus } from '../../../core/models';
import { fmtScore, initials, personName } from '../../../core/format';

// HR: one department in one cycle — its head, its people and where each review stands.
@Component({
  selector: 'app-department-details',
  imports: [NzProgressModule, FormsModule, RouterLink],
  templateUrl: './department-details.html',
  styleUrl: './department-details.css',
})
export class DepartmentDetails implements OnInit {
  private readonly api = inject(ElevateApi);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private unitId = '';
  readonly cycleId = signal('');

  readonly cycle = signal<Cycle | null>(null);
  readonly department = signal<DepartmentRow | null>(null);
  readonly manager = signal<ManagerRow | null>(null);
  readonly employees = signal<EmployeeRow[]>([]);
  readonly search = signal('');
  readonly loading = signal(true);
  readonly error = signal('');

  readonly isHistoricalCycle = computed(() => this.cycle()?.status === 'CLOSED');
  readonly fmtScore = fmtScore;
  readonly initials = initials;
  readonly personName = personName;

  readonly visibleEmployees = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.employees().filter((e) => !q || personName(e.staff).toLowerCase().includes(q));
  });

  readonly percent = computed(() => {
    const d = this.department();
    return d && d.staffCount ? Math.round((d.managerReviewCount / d.staffCount) * 100) : 0;
  });

  readonly teamScore = computed(() => {
    const scored = this.employees().filter((e) => e.overallScore !== null);
    if (!scored.length) return null;
    return scored.reduce((s, e) => s + (e.overallScore as number), 0) / scored.length;
  });

  ngOnInit(): void {
    this.unitId = this.route.snapshot.paramMap.get('id') ?? '';
    const cycleId = this.route.snapshot.queryParamMap.get('cycle') ?? '';
    this.cycleId.set(cycleId);
    if (!this.unitId || !cycleId) {
      this.error.set('Choose a department and a cycle from the Departments page.');
      this.loading.set(false);
      return;
    }
    forkJoin({
      cycles: this.api.cycles(),
      departments: this.api.departments(cycleId),
      managers: this.api.managers(cycleId, this.unitId),
      employees: this.api.employees(cycleId, this.unitId),
    }).subscribe({
      next: ({ cycles, departments, managers, employees }) => {
        this.cycle.set(cycles.find((c) => c._id === cycleId) ?? null);
        this.department.set(departments.find((d) => d.unit._id === this.unitId) ?? null);
        this.manager.set(managers[0] ?? null);
        this.employees.set(employees);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load this department.'));
        this.loading.set(false);
      },
    });
  }

  stateOf(status: ReviewStatus | null | undefined, reviewId: string | null): { text: string; tone: 'done' | 'wait' | 'none' } {
    if (!reviewId) return { text: 'Not started', tone: 'none' };
    switch (status) {
      case 'HR_VALIDATED':
        return { text: 'Validated', tone: 'done' };
      case 'MANAGER_REVIEWED':
        return { text: 'Awaiting HR validation', tone: 'wait' };
      case 'SELF_REVIEW_SUBMITTED':
        return { text: 'Awaiting manager review', tone: 'wait' };
      default:
        return { text: 'In progress', tone: 'none' };
    }
  }

  /** The route's last segment is the review's id: only people with a review can be opened. */
  goToEmployeeReview(row: EmployeeRow): void {
    if (!row.reviewId) return;
    this.router.navigate(['/hr/departments', this.unitId, 'employee', row.reviewId], {
      queryParams: { cycle: this.cycleId() },
    });
  }
}
