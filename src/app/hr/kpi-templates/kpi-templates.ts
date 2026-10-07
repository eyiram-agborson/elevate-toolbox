import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { ManagedUnit, Template } from '../../core/models';
import { fmtDate } from '../../core/format';

interface KpiRow {
  title: string;
  weight: number;
  description: string;
}

@Component({
  selector: 'app-kpi-templates',
  imports: [FormsModule, RouterLink],
  templateUrl: './kpi-templates.html',
  styleUrl: './kpi-templates.css',
})
export class KpiTemplates implements OnInit {
  private readonly api = inject(ElevateApi);

  readonly templates = signal<Template[]>([]);
  readonly units = signal<ManagedUnit[]>([]);
  readonly loading = signal(true);
  readonly pageError = signal('');
  readonly notice = signal('');
  readonly search = signal('');
  readonly unitFilter = signal('');
  readonly fmtDate = fmtDate;

  readonly visible = computed(() => {
    const q = this.search().trim().toLowerCase();
    const unit = this.unitFilter();
    return this.templates().filter((t) => {
      const name = `${t.name} ${this.unitName(t)}`.toLowerCase();
      return (!q || name.includes(q)) && (!unit || this.unitId(t) === unit);
    });
  });

  // modal
  isEditKpi = false;
  editingId: string | null = null;
  unit = '';
  name = '';
  description = '';
  kpis: KpiRow[] = [];
  readonly saving = signal(false);
  readonly formError = signal('');

  ngOnInit(): void {
    this.api.units().subscribe({ next: (u) => this.units.set(u), error: () => undefined });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.templates().subscribe({
      next: (list) => {
        this.templates.set(list);
        this.loading.set(false);
      },
      error: (e) => {
        this.pageError.set(errorText(e, 'Could not load the KPI templates.'));
        this.loading.set(false);
      },
    });
  }

  unitId(t: Template): string {
    return typeof t.unit === 'string' ? t.unit : t.unit?._id;
  }

  unitName(t: Template): string {
    if (t.unit && typeof t.unit !== 'string') return t.unit.name;
    return this.units().find((u) => u._id === t.unit)?.name ?? '—';
  }

  get totalWeight(): number {
    return this.kpis.reduce((sum, k) => sum + (Number(k.weight) || 0), 0);
  }

  get weightOk(): boolean {
    return Math.abs(this.totalWeight - 100) < 0.01;
  }

  private blankKpi(): KpiRow {
    return { title: '', weight: 0, description: '' };
  }

  openAddTemplate(): void {
    this.editingId = null;
    this.formError.set('');
    this.unit = '';
    this.name = '';
    this.description = '';
    this.kpis = [this.blankKpi(), this.blankKpi()];
    this.isEditKpi = true;
  }

  openEditKpi(t: Template): void {
    this.editingId = t._id;
    this.formError.set('');
    this.unit = this.unitId(t);
    this.name = t.name;
    this.description = t.description ?? '';
    this.kpis = t.criteria.map((c) => ({
      title: c.title,
      weight: c.weight,
      description: c.description ?? '',
    }));
    this.isEditKpi = true;
  }

  closeEditKpi(): void {
    this.isEditKpi = false;
  }

  addKpi(): void {
    this.kpis.push(this.blankKpi());
  }

  removeKpi(index: number): void {
    this.kpis.splice(index, 1);
  }

  saveTemplate(): void {
    if (!this.unit) return this.formError.set('Choose the department this template is for.');
    if (!this.name.trim()) return this.formError.set('Give the template a name.');
    if (this.kpis.length === 0 || this.kpis.some((k) => !k.title.trim())) {
      return this.formError.set('Every KPI needs a name.');
    }
    if (!this.weightOk) {
      return this.formError.set(`The weights must add up to 100% (now ${this.totalWeight}%).`);
    }

    const body = {
      unit: this.unit,
      name: this.name.trim(),
      description: this.description.trim() || undefined,
      criteria: this.kpis.map((k) => ({
        title: k.title.trim(),
        weight: Number(k.weight),
        description: k.description.trim() || undefined,
      })),
    };

    this.saving.set(true);
    this.formError.set('');
    const editing = !!this.editingId;
    const request = this.editingId
      ? this.api.updateTemplate(this.editingId, body)
      : this.api.createTemplate(body);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.isEditKpi = false;
        this.notice.set(editing ? 'Template updated.' : 'Template created.');
        this.load();
      },
      error: (e) => {
        this.saving.set(false);
        this.formError.set(errorText(e));
      },
    });
  }
}
