import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { Review } from '../../core/models';
import { fmtScore } from '../../core/format';

interface Row {
  title: string;
  weight: number;
  targets: string[];
  staffScore?: number;
  staffComments: string;
  rating: number | null;
  performance: number | null;
  score: number | null;
  managerComments: string;
}

// The manager rates one team member's submitted self-review.
@Component({
  selector: 'app-teamreview-totalscore',
  imports: [CommonModule, FormsModule],
  templateUrl: './teamreview-totalscore.html',
  styleUrl: './teamreview-totalscore.css',
})
export class TeamreviewTotalscore implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ElevateApi);
  private readonly auth = inject(AuthService);

  readonly pages = [1, 2, 3, 4, 5];
  readonly fmtScore = fmtScore;

  readonly review = signal<Review | null>(null);
  readonly rows = signal<Row[]>([]);
  overallComments = '';
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly notice = signal('');

  /** Rated already (by anyone): nothing can be edited. */
  readonly rated = computed(() => {
    const s = this.review()?.status;
    return s === 'MANAGER_REVIEWED' || s === 'HR_VALIDATED';
  });

  /** Only the review's manager can rate it, and only while it awaits a rating. */
  readonly canRate = computed(() => {
    const r = this.review();
    return !!r && r.status === 'SELF_REVIEW_SUBMITTED' && r.manager?._id === this.auth.me()?.uid;
  });

  get isReadOnly(): boolean {
    return !this.canRate();
  }

  readonly staffName = computed(() => {
    const s = this.review()?.staff;
    return s ? `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() : '';
  });

  readonly unitName = computed(() => {
    const u = this.review()?.unit;
    return u && typeof u !== 'string' ? u.name : '';
  });

  /** The result so far: final once rated, a live preview while rating. */
  readonly totalScore = computed(() => {
    const r = this.review();
    if (this.rated()) return r?.overallScore ?? 0;
    return (
      Math.round(
        this.rows().reduce((sum, k) => sum + ((k.rating ?? 0) / 5) * k.weight, 0) * 100,
      ) / 100
    );
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('No review selected.');
      this.loading.set(false);
      return;
    }
    this.api.review(id).subscribe({
      next: (review) => {
        this.apply(review);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load this review.'));
        this.loading.set(false);
      },
    });
  }

  private apply(review: Review): void {
    this.review.set(review);
    this.overallComments = review.managerReviewComments ?? '';
    this.rows.set(
      review.kpis.map((k) => ({
        title: k.title,
        weight: k.weight,
        targets: k.targets ?? [],
        staffScore: k.staffScore,
        staffComments: k.staffComments ?? '',
        rating: k.rating ?? null,
        performance: k.performance ?? null,
        score: k.score ?? null,
        managerComments: k.managerComments ?? '',
      })),
    );
  }

  goToTeamReviews(): void {
    this.router.navigate(['/elevate/team-review']);
  }

  selectRating(kpi: Row, rating: number): void {
    if (this.isReadOnly) return;
    kpi.rating = rating;
    this.rows.set([...this.rows()]); // refresh the live total
  }

  submitReview(): void {
    const review = this.review();
    if (!review || !this.canRate()) return;

    const unrated = this.rows().filter((r) => !r.rating);
    if (unrated.length) {
      this.error.set(`Rate every KPI before submitting. Missing: ${unrated.map((r) => r.title).join(', ')}.`);
      return;
    }

    this.busy.set(true);
    this.error.set('');
    this.api
      .managerReview(review._id, {
        comments: this.overallComments.trim() || undefined,
        kpis: this.rows().map((r) => ({
          title: r.title,
          rating: r.rating as number,
          managerComments: r.managerComments.trim() || undefined,
        })),
      })
      .subscribe({
        next: (updated) => {
          this.busy.set(false);
          this.apply(updated);
          this.notice.set('Review submitted. HR will validate the final score.');
        },
        error: (e) => {
          this.busy.set(false);
          this.error.set(errorText(e));
        },
      });
  }
}
