import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexGrid,
  ApexTooltip,
  ApexLegend,
  ApexResponsive
} from 'ng-apexcharts';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { Cycle, DepartmentRow } from '../../core/models';
import { newestFirst, pickCycle } from '../../core/cycle-context';
import { cycleName, fmtScore, personName } from '../../core/format';

@Component({
  selector: 'app-department-performance',
  standalone: true,
  imports: [ChartComponent, FormsModule],
  templateUrl: './department-performance.html',
  styleUrl: './department-performance.css'
})
export class DepartmentPerformance implements OnInit {
  private readonly api = inject(ElevateApi);
  private readonly route = inject(ActivatedRoute);

  constructor(private router: Router) {}

  readonly cycles = signal<Cycle[]>([]);
  readonly cycleId = signal('');
  readonly rows = signal<DepartmentRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly fmtScore = fmtScore;
  readonly personName = personName;

  label(c: Cycle): string {
    return c.name || cycleName(c.period, c.startDate);
  }

  ngOnInit(): void {
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

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.departments(this.cycleId()).subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load departments.'));
        this.loading.set(false);
      },
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToManagers(row: DepartmentRow): void {
    this.router.navigate(['executives/manager-performance'], {
      queryParams: { cycle: this.cycleId(), unit: row.unit._id },
    });
  }

  // AVERAGE SCORE CHART

  readonly chartSeries = computed<ApexAxisChartSeries>(() => [
    { name: 'score', data: this.rows().map((r) => r.averageScore ?? 0) },
  ]);

  readonly xaxis = computed<ApexXAxis>(() => ({
    categories: this.rows().map((r) => r.unit.name),
    labels: {
      style: {
        fontSize: '13px',
        fontWeight: 400
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  }));

  readonly colors = computed<string[]>(() => {
    const palette = ['#5AA4FF', '#ED7800', '#2F9E00', '#B57AE8', '#E5484D'];
    return this.rows().map((_, i) => palette[i % palette.length]);
  });

  chart: ApexChart = {
    type: 'bar',
    height: 350,
    width: '100%',
    toolbar: {
      show: false
    }
  };

  yaxis: ApexYAxis = {
    min: 0,
    max: 100,
    tickAmount: 4,
    labels: {
      style: {
        fontSize: '13px'
      },
      formatter: (value: number): string => `${value}`
    }
  };

  // DEFAULT/DESKTOP SETTINGS
  plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: '30%',
      borderRadius: 5,
      distributed: true
    }
  };

  // SMALL-SCREEN OVERRIDES
  responsive: ApexResponsive[] = [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 300
        },
        plotOptions: {
          bar: {
            columnWidth: '26%',
            borderRadius: 3
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 280
        },
        plotOptions: {
          bar: {
            columnWidth: '40%',
            borderRadius: 3
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '11px'
            }
          }
        }
      }
    }
  ];

  dataLabels: ApexDataLabels = {
    enabled: false
  };

  grid: ApexGrid = {
    borderColor: '#E0E0E0',
    strokeDashArray: 0,
    padding: {
      left: 5,
      right: 0,
      top: 0,
      bottom: 0
    }
  };

  legend: ApexLegend = {
    show: false
  };

  tooltip: ApexTooltip = {
    y: {
      formatter: (value: number): string => `${value}`
    }
  };
}
