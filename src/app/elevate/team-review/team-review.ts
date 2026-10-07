import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { Cycle, ManagedUnit, Review, TeamMember } from '../../core/models';
import { fmtDate } from '../../core/format';

interface TeamRow {
  member: TeamMember;
  unitName: string;
  review: Review | null;
  state: 'in-progress' | 'submitted' | 'reviewed';
}

@Component({
  selector: 'app-team-review',
  imports: [],
  templateUrl: './team-review.html',
  styleUrl: './team-review.css',
})
export class TeamReview implements OnInit {
  private readonly router = inject(Router);
  private readonly api = inject(ElevateApi);

  readonly cycle = signal<Cycle | null>(null);
  readonly rows = signal<TeamRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly fmtDate = fmtDate;

  ngOnInit(): void {
    this.api
      .activeCycle()
      .pipe(
        switchMap((cycle) => {
          this.cycle.set(cycle);
          if (!cycle) return of(null);
          return forkJoin({
            team: this.api.team(),
            units: this.api.units(),
            reviews: this.api.teamReviews({ performanceCycleId: cycle._id }),
          });
        }),
      )
      .subscribe({
        next: (res) => {
          if (res) this.rows.set(this.buildRows(res.team, res.units, res.reviews));
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(errorText(e, 'Could not load your team.'));
          this.loading.set(false);
        },
      });
  }

  private buildRows(team: TeamMember[], units: ManagedUnit[], reviews: Review[]): TeamRow[] {
    const byStaff = new Map(reviews.map((r) => [r.staff._id, r]));
    const unitName = new Map(units.map((u) => [u._id, u.name]));
    return team.map((member) => {
      const review = byStaff.get(member._id) ?? null;
      const state: TeamRow['state'] =
        review?.status === 'MANAGER_REVIEWED' || review?.status === 'HR_VALIDATED'
          ? 'reviewed'
          : review?.status === 'SELF_REVIEW_SUBMITTED'
            ? 'submitted'
            : 'in-progress';
      return { member, unitName: (member.unit && unitName.get(member.unit)) || '', review, state };
    });
  }

  initials(m: TeamMember): string {
    return `${m.firstName?.[0] ?? ''}${m.lastName?.[0] ?? ''}`.toUpperCase();
  }

  route(reviewId: string): void {
    this.router.navigate(['elevate/team-review', reviewId]);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
