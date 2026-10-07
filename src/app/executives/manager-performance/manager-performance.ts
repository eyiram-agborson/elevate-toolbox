import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { Cycle, ManagedUnit, ManagerRow } from '../../core/models';
import { newestFirst, pickCycle } from '../../core/cycle-context';
import { cycleName, fmtScore, initials, personName } from '../../core/format';

// Executives: every manager's review completion and team score for one cycle (optionally one department).
@Component({
  selector: 'app-manager-performance',
  imports: [FormsModule],
  templateUrl: './manager-performance.html',
  styleUrl: './manager-performance.css',
})
export class ManagerPerformance implements OnInit {
  private readonly api = inject(ElevateApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly cycles = signal<Cycle[]>([]);
  readonly units = signal<ManagedUnit[]>([]);
  readonly cycleId = signal('');
  readonly unitId = signal('');
  readonly rows = signal<ManagerRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly fmtScore = fmtScore;
  readonly personName = personName;
  readonly initials = initials;

  readonly unitName = computed(() => this.units().find((u) => u._id === this.unitId())?.name ?? '');

  label(c: Cycle): string {
    return c.name || cycleName(c.period, c.startDate);
  }

  ngOnInit(): void {
    this.unitId.set(this.route.snapshot.queryParamMap.get('unit') ?? '');
    this.api.units().subscribe({ next: (u) => this.units.set(u) });
    this.api.cycles().subscribe({
      next: (list) => {
        const sorted = newestFirst(list);
        this.cycles.set(sorted);
        const pick = pickCycle(sorted, this.route.snapshot.queryParamMap.get('cycle'));
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
    this.api.managers(this.cycleId(), this.unitId() || undefined).subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load managers.'));
        this.loading.set(false);
      },
    });
  }

  goToDepartmentPerformance(): void {
    this.router.navigate(['executives/department-performance'], { queryParams: { cycle: this.cycleId() } });
  }

  goToManagerDetails(row: ManagerRow): void {
    this.router.navigate(['executives/manager-performance', row.manager._id], {
      queryParams: { cycle: this.cycleId(), unit: this.unitId() || row.unit?._id || row.manager.unit?._id },
    });
  }

  unitOf(row: ManagerRow): string {
    return row.unit?.name ?? row.manager.unit?.name ?? '';
  }
}
