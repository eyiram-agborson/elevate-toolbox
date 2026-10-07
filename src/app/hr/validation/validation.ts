import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { Cycle, Review } from '../../core/models';
import { cycleName, fmtDateTime, fmtScore, personName } from '../../core/format';

interface Row {
  title: string;
  weight: number;
  targets: string[];
  staffScore?: number;
  staffComments?: string;
  rating?: number;
  managerComments?: string;
  /** HR's score for this KPI, 1–5. */
  validation: number | null;
}

// HR records the final score of a review once the manager has rated it.
// Each KPI is scored 1–5 and the final score is the weighted total out of 100.
@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './validation.html',
  styleUrl: './validation.css',
})
export class Validation implements OnInit {
  private readonly api = inject(ElevateApi);

  readonly cycles = signal<Cycle[]>([]);
  readonly cycleId = signal('');
  readonly reviews = signal<Review[]>([]);
  readonly search = signal('');
  readonly department = signal('');
  readonly loading = signal(true);
  readonly error = signal('');
  readonly notice = signal('');

  /** The review being validated or edited, and the modal state. */
  readonly active = signal<Review | null>(null);
  readonly mode = signal<'validate' | 'edit' | null>(null);
  readonly rows = signal<Row[]>([]);
  readonly comments = signal('');
  readonly busy = signal(false);
  readonly modalError = signal('');

  readonly pages = [1, 2, 3, 4, 5];
  readonly fmtScore = fmtScore;
  readonly fmtDateTime = fmtDateTime;
  readonly personName = personName;

  readonly departments = computed(() => {
    const names = this.reviews().map((r) => this.unitName(r)).filter(Boolean);
    return [...new Set(names)].sort();
  });

  readonly visible = computed(() => {
    const q = this.search().trim().toLowerCase();
    const dept = this.department();
    return this.reviews().filter(
      (r) =>
        (!q || personName(r.staff).toLowerCase().includes(q)) && (!dept || this.unitName(r) === dept),
    );
  });

  /** Weighted total of the scores picked so far, out of 100. */
  readonly finalScore = computed(
    () =>
      Math.round(
        this.rows().reduce((sum, k) => sum + (((k.validation ?? 0) / 5) * k.weight), 0) * 100,
      ) / 100,
  );

  readonly complete = computed(() => this.rows().length > 0 && this.rows().every((k) => !!k.validation));

  ngOnInit(): void {
    this.api.cycles().subscribe({
      next: (list) => {
        const sorted = [...list].sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        );
        this.cycles.set(sorted);
        const pick = sorted.find((c) => c.status === 'ACTIVE') ?? sorted[0];
        if (!pick) {
          this.loading.set(false);
          return;
        }
        this.cycleId.set(pick._id);
        this.load();
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

  unitName(r: Review): string {
    return r.unit && typeof r.unit !== 'string' ? r.unit.name : '';
  }

  onCycleChange(id: string): void {
    this.cycleId.set(id);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.reviews({ performanceCycleId: this.cycleId() }).subscribe({
      next: (list) => {
        this.reviews.set(
          list.filter((r) => r.status === 'MANAGER_REVIEWED' || r.status === 'HR_VALIDATED'),
        );
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load reviews.'));
        this.loading.set(false);
      },
    });
  }

  isValidated(r: Review): boolean {
    return r.status === 'HR_VALIDATED';
  }

  /** The manager's own score. Once validated, `overallScore` holds HR's final score instead. */
  managerScoreOf(r: Review): number | null {
    return (this.isValidated(r) ? r.hrValidation?.originalScore : r.overallScore) ?? null;
  }

  /** HR's validation score; none until validated. */
  scoreOf(r: Review): number | null {
    return this.isValidated(r) ? (r.hrValidation?.finalScore ?? null) : null;
  }

  open(review: Review, mode: 'validate' | 'edit'): void {
    this.active.set(review);
    this.mode.set(mode);
    this.modalError.set('');
    this.comments.set(review.hrValidation?.comments ?? '');
    this.rows.set(
      review.kpis.map((k) => ({
        title: k.title,
        weight: k.weight,
        targets: k.targets ?? [],
        staffScore: k.staffScore,
        staffComments: k.staffComments,
        rating: k.rating,
        managerComments: k.managerComments,
        validation: null,
      })),
    );
  }

  close(): void {
    this.active.set(null);
    this.mode.set(null);
    this.rows.set([]);
  }

  pick(row: Row, score: number): void {
    row.validation = score;
    this.rows.set([...this.rows()]); // refresh the live total
  }

  save(): void {
    const review = this.active();
    if (!review) return;
    if (!this.complete()) {
      this.modalError.set('Score every KPI from 1 to 5 before saving.');
      return;
    }
    this.busy.set(true);
    this.modalError.set('');
    this.api
      .validate(review._id, { finalScore: this.finalScore(), comments: this.comments().trim() || undefined })
      .subscribe({
        next: (updated) => {
          this.busy.set(false);
          this.reviews.update((list) =>
            list.map((r) =>
              r._id === review._id ? { ...r, ...updated, staff: r.staff, manager: r.manager, unit: r.unit } : r,
            ),
          );
          this.notice.set(`${personName(review.staff)}: validation saved (${fmtScore(this.finalScore())} / 100).`);
          this.close();
        },
        error: (e) => {
          this.busy.set(false);
          this.modalError.set(errorText(e));
        },
      });
  }
}
