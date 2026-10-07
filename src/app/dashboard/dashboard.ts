import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { Role } from '../services/role';
import { Router, RouterLink } from '@angular/router';

import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ElevateApi, errorText } from '../core/elevate-api.service';
import { Cycle, DepartmentRow, EmployeeRow, ManagerRow, Review } from '../core/models';
import { cycleName, cycleStage, fmtRange, fmtScore, initials, personName } from '../core/format';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, NzStepsModule, NzProgressModule  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  roleService = inject(Role);
  private readonly api = inject(ElevateApi);

  constructor(private router: Router){
    this.api.activeCycle().subscribe({
      next: (c) => {
        this.cycle.set(c);
        this.cycleLoaded.set(true);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load the active cycle.'));
        this.cycleLoaded.set(true);
      },
    });

    // Load what the chosen role needs once the cycle is known, and again when the role changes.
    effect(() => {
      const cycle = this.cycle();
      this.roleService.role();
      if (!this.cycleLoaded()) return;
      untracked(() => this.loadForRole(cycle));
    });
  }

  readonly cycle = signal<Cycle | null>(null);
  readonly cycleLoaded = signal(false);
  readonly error = signal('');

  readonly departments = signal<DepartmentRow[]>([]);
  readonly employees = signal<EmployeeRow[]>([]);
  readonly managers = signal<ManagerRow[]>([]);
  readonly submissions = signal<Review[]>([]);
  /** Team reviews waiting for this manager's rating. */
  readonly pendingReviews = signal(0);

  readonly fmtRange = fmtRange;
  readonly fmtScore = fmtScore;
  readonly personName = personName;
  readonly initials = initials;
  readonly cycleName = cycleName;

  readonly stage = computed(() => {
    const c = this.cycle();
    return c ? cycleStage(c) : 'done';
  });

  readonly stepIndex = computed(() => ({ targets: 0, review: 1, done: 2 })[this.stage()]);

  readonly cycleSummary = computed(() => {
    switch (this.stage()) {
      case 'targets':
        return 'Goal setting is open. Targets are agreed with your manager during the target window.';
      case 'review':
        return 'The performance review is open. Rate your KPIs and your manager will follow up.';
      default:
        return 'The review window has ended.';
    }
  });

  // HR cards
  readonly topDepartments = computed(() => this.departments().filter((d) => !d.unit.isSubUnit));
  readonly hrReviewCompletion = computed(() => {
    const staff = this.employees().length;
    const done = this.employees().filter((e) => e.status === 'MANAGER_REVIEWED' || e.status === 'HR_VALIDATED').length;
    return staff ? Math.round((done / staff) * 100) : 0;
  });
  readonly hrAwaitingManager = computed(
    () => this.employees().filter((e) => e.reviewId && e.status === 'SELF_REVIEW_SUBMITTED').length,
  );
  readonly recentSubmissions = computed(() =>
    [...this.submissions()]
      .filter((r) => r.status !== 'DRAFT')
      .sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())
      .slice(0, 5),
  );

  // Executive cards
  readonly managersCompleted = computed(() => this.managers().reduce((s, m) => s + m.completedReviews, 0));
  readonly managersTeamSize = computed(() => this.managers().reduce((s, m) => s + m.teamSize, 0));
  readonly bestDepartment = computed(() => {
    const scored = this.topDepartments().filter((d) => d.averageScore !== null);
    if (!scored.length) return null;
    return scored.reduce((best, d) => ((d.averageScore ?? 0) > (best.averageScore ?? 0) ? d : best));
  });

  percent(row: DepartmentRow): number {
    return row.staffCount ? Math.round((row.managerReviewCount / row.staffCount) * 100) : 0;
  }

  unitNameOf(r: Review): string {
    return r.unit && typeof r.unit !== 'string' ? r.unit.name : '';
  }

  reviewStateText(r: Review): string {
    return r.status === 'SELF_REVIEW_SUBMITTED' ? 'Submitted' : r.status === 'HR_VALIDATED' ? 'Validated' : 'Reviewed';
  }

  private loadForRole(cycle: Cycle | null): void {
    this.departments.set([]);
    this.employees.set([]);
    this.managers.set([]);
    this.submissions.set([]);
    this.pendingReviews.set(0);
    if (!cycle) return;

    const swallow = (e: unknown) => this.error.set(errorText(e));

    if (this.roleService.hasRole('manager')) {
      this.api.teamReviews({ performanceCycleId: cycle._id, status: 'SELF_REVIEW_SUBMITTED' }).subscribe({
        next: (list) => this.pendingReviews.set(list.length),
        error: swallow,
      });
    }
    if (this.roleService.hasRole('hr') || this.roleService.hasRole('executive')) {
      this.api.departments(cycle._id).subscribe({ next: (d) => this.departments.set(d), error: swallow });
    }
    if (this.roleService.hasRole('hr')) {
      this.api.employees(cycle._id).subscribe({ next: (e) => this.employees.set(e), error: swallow });
      this.api.reviews({ performanceCycleId: cycle._id }).subscribe({
        next: (r) => this.submissions.set(r),
        error: swallow,
      });
    }
    if (this.roleService.hasRole('executive')) {
      this.api.managers(cycle._id).subscribe({ next: (m) => this.managers.set(m), error: swallow });
    }
  }

 goToElevate() {
  const role = this.roleService.getRole();

  if (role === 'manager') {
    this.router.navigate(['/elevate/manager-elevate']);
  } else {
    this.router.navigate(['/elevate/user-elevate']);
  }
}

goToMyActivities() {
  this.router.navigate(['/activities-layout/my-activities']);
}

  goToDepartmentDetails(row: DepartmentRow) {
    this.router.navigate(['/hr/departments', row.unit._id], { queryParams: { cycle: this.cycle()?._id } });
  }

  goToSubmission(r: Review) {
    const unitId = r.unit && typeof r.unit !== 'string' ? r.unit._id : r.unit;
    this.router.navigate(['/hr/departments', unitId, 'employee', r._id], { queryParams: { cycle: this.cycle()?._id } });
  }

  goToPerformanceCycles(){
    this.router.navigate(['/hr/performance-cycles'])
  }

  notificationsOpen = false;

toggleNotifications(): void {
  this.notificationsOpen = !this.notificationsOpen;
}

/** Opens the team's reviews that are waiting for this manager. */
reviewPending(): void {
  this.notificationsOpen = false;

  this.router.navigate(['/elevate/team-review']);
}

//executive dashboard

goToDepartmentPerformance() {
  this.router.navigate(['executives/department-performance'], { queryParams: { cycle: this.cycle()?._id } });
}

goToUnitManagers(unitId: string) {
  this.router.navigate(['executives/manager-performance'], {
    queryParams: { cycle: this.cycle()?._id, unit: unitId },
  });
}

goToManagerDetails(row: ManagerRow) {
  this.router.navigate(['executives/manager-performance', row.manager._id], {
    queryParams: { cycle: this.cycle()?._id, unit: row.unit?._id ?? row.manager.unit?._id },
  });
}

}
