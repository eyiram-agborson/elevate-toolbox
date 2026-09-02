import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  ApexLegend
} from 'ng-apexcharts';

@Component({
  selector: 'app-department-performance',
  imports: [ChartComponent],
  templateUrl: './department-performance.html',
  styleUrl: './department-performance.css',
})
export class DepartmentPerformance {

  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToManagers() {
    this.router.navigate(['/manager-performance']);
  }

  goToDashboad() {
    this.router.navigate(['/dashboard']);
  }

  // AVERAGE SCORE CHART

  chartSeries: ApexAxisChartSeries = [
    {
      name: 'score',
      data: [96, 57, 69]
    }
  ];

  chart: ApexChart = {
    type: 'bar',
    height: 350,
    toolbar: {
      show: false
    }
  };

  xaxis: ApexXAxis = {
    categories: [
      'Technology',
      'Projects & Products',
      'Settlement'
    ],
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
  };

  yaxis: ApexYAxis = {
    min: 0,
    max: 100,
    tickAmount: 4,
    labels: {
      style: {
        fontSize: '13px'
      },
      formatter: (value: number) => `${value}`
    }
  };

  plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: '26%',
      borderRadius: 5,
      distributed: true
    }
  };

  dataLabels: ApexDataLabels = {
    enabled: false
  };

  grid: ApexGrid = {
    borderColor: '#E0E0E0',
    strokeDashArray: 0,
    padding: {
      left: 5,
      right: 5,
      top: 0,
      bottom: 0
    }
  };

  colors = [
    '#5AA4FF',
    '#ED7800',
    '#2F9E00'
  ];

  legend: ApexLegend = {
    show: false
  };

  tooltip: ApexTooltip = {
    y: {
      formatter: (value: number) => `${value}`
    }
  };
}