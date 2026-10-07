import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { ManagerDetails as ManagerDetailsData, ReviewStatus } from '../../core/models';
import { fmtScore, initials, personName } from '../../core/format';

// Executives: one manager's team and where each review stands. Read-only in phase 1.
@Component({
  selector: 'app-manager-details',
  imports: [],
  templateUrl: './manager-details.html',
  styleUrl: './manager-details.css',
})
export class ManagerDetails implements OnInit {
  private readonly api = inject(ElevateApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly cycleId = this.route.snapshot.queryParamMap.get('cycle') ?? '';
  private readonly unitId = this.route.snapshot.queryParamMap.get('unit') ?? '';

  readonly data = signal<ManagerDetailsData | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly fmtScore = fmtScore;
  readonly personName = personName;
  readonly initials = initials;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || !this.cycleId) {
      this.error.set('Choose a manager from the Managers page.');
      this.loading.set(false);
      return;
    }
    this.api.managerDetails(id, this.cycleId).subscribe({
      next: (d) => {
        this.data.set(d);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load this manager.'));
        this.loading.set(false);
      },
    });
  }

  statusText(status: ReviewStatus, reviewId: string | null): string {
    if (!reviewId) return 'Not started';
    switch (status) {
      case 'HR_VALIDATED':
        return 'Validated';
      case 'MANAGER_REVIEWED':
        return 'Manager reviewed';
      case 'SELF_REVIEW_SUBMITTED':
        return 'Self-review submitted';
      default:
        return 'In progress';
    }
  }

  goToManagerPerformance(): void {
    this.router.navigate(['/executives/manager-performance'], {
      queryParams: { cycle: this.cycleId, unit: this.unitId || undefined },
    });
  }

  /** Open a team member's review on the employee performance page. */
  openReview(reviewId: string | null): void {
    if (!reviewId) return;
    this.router.navigate(['/executives/employee-performance'], {
      queryParams: { cycle: this.cycleId, unit: this.unitId || undefined, open: reviewId },
    });
  }
}
