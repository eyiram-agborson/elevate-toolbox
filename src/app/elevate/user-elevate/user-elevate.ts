import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { FormsModule } from '@angular/forms';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { Role } from '../../services/role';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { Cycle, Kpi, Review, Target } from '../../core/models';
import { fmtRange, fmtScore } from '../../core/format';

type Tab = 'targets' | 'self-review' | 'completed';

interface Row {
  title: string;
  weight: number;
  targets: string[];
  staffScore: number | null;
  staffComments: string;
  managerComments?: string;
  rating?: number;
  score?: number;
}

// "My cycle": my approved targets, my self-review, and the finished review.
// The manager's own page (ManagerElevate) uses this same screen.
@Component({
  selector: 'app-user-elevate',
  imports: [
    NzSegmentedModule,
    NzAvatarModule,
    NzStepsModule,
    NzProgressModule,
    NzButtonModule,
    CommonModule,
    FormsModule,
    NzCollapseModule,
  ],
  templateUrl: './user-elevate.html',
  styleUrl: './user-elevate.css',
})
export class UserElevate implements OnInit {
  roleService = inject(Role);
  protected readonly api = inject(ElevateApi);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  readonly cycle = signal<Cycle | null>(null);
  readonly target = signal<Target | null>(null);
  readonly review = signal<Review | null>(null);
  readonly rows = signal<Row[]>([]);
  readonly activeTab = signal<Tab>('targets');
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly notice = signal('');

  readonly pages = [1, 2, 3, 4, 5];
  readonly fmtRange = fmtRange;
  readonly fmtScore = fmtScore;

  readonly targetApproved = computed(() => this.target()?.status === 'SUBMITTED');

  readonly selfReviewSubmitted = computed(() => {
    const r = this.review();
    return !!r && r.status !== 'DRAFT';
  });

  readonly managerReviewCompleted = computed(() => {
    const s = this.review()?.status;
    return s === 'MANAGER_REVIEWED' || s === 'HR_VALIDATED';
  });

  readonly reviewWindowOpen = computed(() => {
    const c = this.cycle();
    if (!c) return false;
    if (!c.reviewStartDate || !c.reviewEndDate) return true; // legacy cycle: not limited
    const end = new Date(c.reviewEndDate);
    end.setUTCHours(23, 59, 59, 999);
    const now = new Date();
    return now >= new Date(c.reviewStartDate) && now <= end;
  });

  /** The form can be filled in: approved targets, window open, nothing submitted yet. */
  readonly selfReviewOpen = computed(
    () => this.targetApproved() && this.reviewWindowOpen() && !this.selfReviewSubmitted(),
  );

  readonly stepIndex = computed(() =>
    this.managerReviewCompleted() ? 2 : this.selfReviewSubmitted() || this.selfReviewOpen() ? 1 : 0,
  );

  readonly totalScore = computed(() => this.review()?.overallScore ?? 0);

  ngOnInit(): void {
    const cycleId = this.route.snapshot.queryParamMap.get('cycle');
    const cycle$ = cycleId
      ? this.api.cycles().pipe(map((list) => list.find((c) => c._id === cycleId) ?? null))
      : this.api.activeCycle();

    cycle$
      .pipe(
        switchMap((cycle) =>
          cycle
            ? forkJoin({
                targets: this.api.myTargets({ performanceCycleId: cycle._id }),
                reviews: this.api.myReviews({ performanceCycleId: cycle._id }),
              }).pipe(map((r) => ({ cycle, ...r })))
            : of({ cycle, targets: [] as Target[], reviews: [] as Review[] }),
        ),
      )
      .subscribe({
        next: ({ cycle, targets, reviews }) => {
          this.cycle.set(cycle);
          this.target.set(targets[0] ?? null);
          this.review.set(reviews[0] ?? null);
          this.rows.set(this.buildRows());
          this.activeTab.set(
            this.managerReviewCompleted()
              ? 'completed'
              : this.selfReviewSubmitted() || this.selfReviewOpen()
                ? 'self-review'
                : 'targets',
          );
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(errorText(e, 'Could not load your Elevate cycle.'));
          this.loading.set(false);
        },
      });
  }

  /** Rows come from the review once it exists (it carries both sides), else from the targets. */
  private buildRows(): Row[] {
    const review = this.review();
    const source: Kpi[] = review?.kpis?.length ? review.kpis : (this.target()?.kpis ?? []);
    return source.map((k) => ({
      title: k.title,
      weight: k.weight,
      targets: k.targets ?? [],
      staffScore: k.staffScore ?? null,
      staffComments: k.staffComments ?? '',
      managerComments: k.managerComments,
      rating: k.rating,
      score: k.score,
    }));
  }

  myactivities(): void {
    this.router.navigate(['/activities-layout', 'my-activities']);
  }

  goToActivities(): void {
    this.myactivities();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  tabsActive(tab: string): void {
    if (tab === 'completed' && !this.managerReviewCompleted()) return;
    this.activeTab.set(tab as Tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToSelfReviewPage(): void {
    if (!this.selfReviewOpen() && !this.selfReviewSubmitted()) return;
    this.activeTab.set('self-review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  rate(row: Row, score: number): void {
    if (!this.selfReviewOpen()) return;
    row.staffScore = score;
  }

  submitSelfReview(): void {
    const target = this.target();
    if (!target || !this.selfReviewOpen()) return;

    const unrated = this.rows().filter((r) => !r.staffScore);
    if (unrated.length) {
      this.error.set(`Rate every KPI before submitting. Missing: ${unrated.map((r) => r.title).join(', ')}.`);
      return;
    }

    this.busy.set(true);
    this.error.set('');
    this.api
      .selfReview({
        targetId: target._id,
        kpis: this.rows().map((r) => ({
          title: r.title,
          staffScore: r.staffScore as number,
          staffComments: r.staffComments.trim() || undefined,
        })),
      })
      .subscribe({
        next: (review) => {
          this.review.set(review);
          this.rows.set(this.buildRows());
          this.busy.set(false);
          this.notice.set('Your self-review has been submitted.');
          this.activeTab.set('self-review');
        },
        error: (e) => {
          this.busy.set(false);
          this.error.set(errorText(e));
        },
      });
  }

  completeManagerReview(): void {
    if (this.managerReviewCompleted()) this.activeTab.set('completed');
  }
}
