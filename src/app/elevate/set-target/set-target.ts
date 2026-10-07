import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of, switchMap, catchError } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { Cycle, ManagedUnit, Target, TeamMember } from '../../core/models';
import { fmtRange } from '../../core/format';

interface KpiRow {
  title: string;
  weight: number;
  targetsText: string;
}

@Component({
  selector: 'app-set-targets',
  imports: [FormsModule],
  templateUrl: './set-target.html',
  styleUrl: './set-target.css',
})
export class SetTarget implements OnInit {
  private readonly api = inject(ElevateApi);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly me = this.auth.me;
  readonly fmtRange = fmtRange;

  readonly units = signal<ManagedUnit[]>([]);
  readonly team = signal<TeamMember[]>([]);
  readonly cycle = signal<Cycle | null>(null);
  readonly rows = signal<KpiRow[]>([]);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly templateMissing = signal(false);

  unitId = '';
  staffId = ''; // '' = all team members

  readonly unit = computed(() => this.units().find((u) => u._id === this.unitId) ?? null);

  readonly windowOpen = computed(() => {
    const c = this.cycle();
    if (!c?.targetStartDate || !c.targetEndDate) return !!c; // legacy cycle: not limited
    const end = new Date(c.targetEndDate);
    end.setUTCHours(23, 59, 59, 999);
    const now = new Date();
    return now >= new Date(c.targetStartDate) && now <= end;
  });

  readonly totalWeight = computed(() =>
    this.rows().reduce((sum, r) => sum + (Number(r.weight) || 0), 0),
  );

  // edit-KPI modal
  showEditModal = false;
  private editIndex = -1;
  selectedKpi = { name: '', weight: 0 };

  ngOnInit(): void {
    forkJoin({
      units: this.api.units(),
      cycle: this.api.activeCycle(),
    }).subscribe({
      next: ({ units, cycle }) => {
        this.cycle.set(cycle);
        this.units.set(units);
        const mine = units.find((u) => u.unitHead === this.me()?.uid) ?? units[0];
        this.loading.set(false);
        if (mine) {
          this.unitId = mine._id;
          this.onUnitChange();
        }
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load your units.'));
        this.loading.set(false);
      },
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  onUnitChange(): void {
    this.staffId = '';
    this.team.set([]);
    this.rows.set([]);
    this.templateMissing.set(false);
    this.error.set('');
    this.notice.set('');
    if (!this.unitId) return;

    this.api.team(this.unitId).subscribe({
      next: (t) => this.team.set(t),
      error: (e) => this.error.set(errorText(e)),
    });
    this.loadKpis();
  }

  onStaffChange(): void {
    this.loadKpis();
  }

  // Start from what is already saved for this person/unit, else from the unit's template.
  private loadKpis(): void {
    const cycle = this.cycle();
    if (!this.unitId) return;

    const saved$ = cycle
      ? this.api
          .targets({
            unitId: this.unitId,
            performanceCycleId: cycle._id,
            staffId: this.staffId || undefined,
          })
          .pipe(catchError(() => of([] as Target[])))
      : of([] as Target[]);

    saved$
      .pipe(
        switchMap((saved) => {
          const existing = saved.find((t) => t.kpis?.length);
          if (existing) {
            return of({ rows: this.fromTarget(existing), missing: false });
          }
          return this.api.templateForUnit(this.unitId).pipe(
            switchMap((tpl) =>
              of({
                rows: tpl.criteria.map((c) => ({ title: c.title, weight: c.weight, targetsText: '' })),
                missing: false,
              }),
            ),
            catchError(() => of({ rows: [] as KpiRow[], missing: true })),
          );
        }),
      )
      .subscribe(({ rows, missing }) => {
        this.rows.set(rows);
        this.templateMissing.set(missing);
      });
  }

  private fromTarget(t: Target): KpiRow[] {
    return t.kpis.map((k) => ({
      title: k.title,
      weight: k.weight,
      targetsText: (k.targets ?? []).join('\n'),
    }));
  }

  // ---- edit KPI name / weight ------------------------------------------------
  openEditKpi(index: number): void {
    const row = this.rows()[index];
    this.editIndex = index;
    this.selectedKpi = { name: row.title, weight: row.weight };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveKpi(): void {
    const rows = this.rows().slice();
    if (rows[this.editIndex]) {
      rows[this.editIndex] = {
        ...rows[this.editIndex],
        title: this.selectedKpi.name.trim() || rows[this.editIndex].title,
        weight: Number(this.selectedKpi.weight) || 0,
      };
      this.rows.set(rows);
    }
    this.showEditModal = false;
  }

  // ---- saving ----------------------------------------------------------------------
  private validate(): string | null {
    if (!this.cycle()) return 'There is no active performance cycle.';
    if (!this.windowOpen()) return 'The target setting window is not open.';
    if (this.rows().length === 0) return 'There are no KPIs to set. Ask HR to create a template for this unit.';
    if (Math.abs(this.totalWeight() - 100) > 0.01) {
      return `The KPI weights must add up to 100% (now ${this.totalWeight()}%).`;
    }
    const missing = this.rows().filter((r) => this.targetList(r).length === 0);
    if (missing.length) {
      return `Add at least one target for: ${missing.map((r) => r.title).join(', ')}.`;
    }
    return null;
  }

  private targetList(r: KpiRow): string[] {
    return r.targetsText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  private save(publish: boolean): void {
    const problem = this.validate();
    if (problem) {
      this.error.set(problem);
      this.notice.set('');
      return;
    }

    this.busy.set(true);
    this.error.set('');
    this.notice.set('');

    this.api
      .setTargets({
        unitId: this.unitId,
        performanceCycleId: this.cycle()!._id,
        staffId: this.staffId || undefined,
        kpis: this.rows().map((r) => ({
          title: r.title,
          weight: Number(r.weight),
          targets: this.targetList(r),
        })),
      })
      .pipe(
        switchMap((res) => {
          if (!publish) return of({ saved: res.data.length, published: 0, skipped: res.skipped.length });
          const toApprove = res.data.filter((t) => t.status !== 'SUBMITTED');
          return (toApprove.length
            ? forkJoin(toApprove.map((t) => this.api.approveTarget(t._id)))
            : of([])
          ).pipe(
            switchMap((done) =>
              of({ saved: res.data.length, published: done.length, skipped: res.skipped.length }),
            ),
          );
        }),
      )
      .subscribe({
        next: (r) => {
          this.busy.set(false);
          const skipped = r.skipped ? ` ${r.skipped} already-approved target(s) were left as they are.` : '';
          this.notice.set(
            publish
              ? `Published targets for ${r.published} staff member(s).${skipped}`
              : `Draft saved for ${r.saved} staff member(s). Staff only see targets once you publish.${skipped}`,
          );
        },
        error: (e) => {
          this.busy.set(false);
          this.error.set(errorText(e));
        },
      });
  }

  saveDraft(): void {
    this.save(false);
  }

  publish(): void {
    this.save(true);
  }
}
