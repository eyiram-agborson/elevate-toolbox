import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { Role } from '../../services/role';

@Component({
  selector: 'app-manager-elevate',
  imports: [
    NzCollapseModule,
    NzStepsModule,
    NzSegmentedModule,
    NzAvatarModule,
    NzDividerModule,
    NzProgressModule,
    NzButtonModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './manager-elevate.html',
  styleUrl: './manager-elevate.css',
})
export class ManagerElevate {

  roleService = inject(Role);

  constructor(private router: Router) {}


  currentStep = 1;
  totalStep = 3;

  message = '';
  comments = '';

  current = 3;

  role = 'manager';

  isActiveTab = 'targets';
  isActiveTabs = 'targets';


  // Lifecycle

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }


  // Navigation

  myactivities(): void {
    this.router.navigate(['/my-activities']);
  }

  goToActivities(): void {
    this.router.navigate(['/my-activities']);
  }

  goToElevate(): void {
    this.router.navigate(['/elevate']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }


  // Evaluation stage tabs

  tabsActive(tab: string): void {
    this.isActiveTab = tab;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  tabActive(tab: string): void {
    this.isActiveTab = tab;

    switch (tab) {
      case 'targets':
        this.currentStep = 1;
        break;

      case 'self-review':
        this.currentStep = 2;
        break;

      case 'completed':
        this.currentStep = 3;
        break;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  // KPI data

  previousCycles = [
    {
      weight: 'Weight: 60%',
      application: 'Application Development & Delivery',
      name: 'TARGE',
      targets: 'Deliver 100% of assigned tasks within agreed sprint timeline',
      performance: 'Deliver 100% of assigned tasks within agreed sprint timeline'
    }
  ];


  // Current cycle

  currentCycles = {
    name: 'ELEVATE - Q3 (July - September 2026)',
    targets: '22 Jul - 30 Jul 2026',
    performance: '29 Sept - 7 Oct 2026'
  };


  // Previous cycles

  previousCycle = [
    {
      name: 'ELEVATE - Q3 (July-September 2026)',
      targets: '22 Jul - 30 Jul 2026',
      performance: '29 Sept - 7 Oct 2026'
    },
    {
      name: 'ELEVATE - Q3 (July-September 2026)',
      targets: '22 Jul - 30 Jul 2026',
      performance: '29 Sept - 7 Oct 2026'
    },
    {
      name: 'ELEVATE - Q3 (July-September 2026)',
      targets: '22 Jul - 30 Jul 2026',
      performance: '29 Sept - 7 Oct 2026'
    }
  ];

}