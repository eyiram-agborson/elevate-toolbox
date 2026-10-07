import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { ElevateApi, errorText } from '../../../core/elevate-api.service';
import { Review } from '../../../core/models';
import { fmtDate, fmtScore, personName } from '../../../core/format';

// HR: one employee's review — self ratings, manager ratings and the final score.
// The route's last segment is the review's id.
@Component({
  selector: 'app-employee-review',
  imports: [RouterLink, NzCollapseModule],
  templateUrl: './employee-review.html',
  styleUrl: './employee-review.css',
})
export class EmployeeReview implements OnInit {
  private readonly api = inject(ElevateApi);
  private readonly route = inject(ActivatedRoute);

  readonly review = signal<Review | null>(null);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly notice = signal('');

  readonly fmtScore = fmtScore;
  readonly fmtDate = fmtDate;
  readonly personName = personName;

  readonly cycleId = this.route.snapshot.queryParamMap.get('cycle') ?? '';
  readonly unitId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly validated = computed(() => this.review()?.status === 'HR_VALIDATED');
  readonly awaitingValidation = computed(() => this.review()?.status === 'MANAGER_REVIEWED');
  readonly managerDone = computed(() => {
    const s = this.review()?.status;
    return s === 'MANAGER_REVIEWED' || s === 'HR_VALIDATED';
  });

  readonly unitName = computed(() => {
    const u = this.review()?.unit;
    return u && typeof u !== 'string' ? u.name : '';
  });

  /** The score of record: HR's final score once validated, otherwise the manager-rated score. */
  readonly totalScore = computed(() => {
    const r = this.review();
    if (!r || !this.managerDone()) return null;
    return r.hrValidation?.finalScore ?? r.overallScore ?? null;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('employeeId');
    if (!id) {
      this.error.set('No review selected.');
      this.loading.set(false);
      return;
    }
    this.api.review(id).subscribe({
      next: (r) => {
        this.review.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load this review.'));
        this.loading.set(false);
      },
    });
  }

  /** Accept the manager's score as the final one. (Adjusting the score is done on the Validation page.) */
  approveReview(): void {
    const r = this.review();
    if (!r || !this.awaitingValidation()) return;
    this.busy.set(true);
    this.error.set('');
    this.api.validate(r._id, {}).subscribe({
      next: (updated) => {
        this.busy.set(false);
        this.review.update((old) => (old ? { ...old, ...updated, staff: old.staff, manager: old.manager } : updated));
        this.notice.set('Review validated.');
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(errorText(e));
      },
    });
  }
}
