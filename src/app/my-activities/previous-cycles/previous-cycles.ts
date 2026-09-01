import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Role } from '../../services/role';

@Component({
  selector: 'app-previous-cycles',
  imports: [
    NzStepsModule,
    NzCollapseModule,
    NzAvatarModule,
    NzProgressModule,
    NzButtonModule,
    CommonModule,
    FormsModule,
    NzSegmentedModule,
    NzDividerModule
  ],
  templateUrl: './previous-cycles.html',
  styleUrl: './previous-cycles.css',
})
export class PreviousCycles {


  roleService = inject(Role);
  
  isActiveTab = 'targets';
  currentStep = 1;
  message = '';
  isActive = false;

  isActiveTabs = 'completed';

  constructor(private router: Router) {}

    goToActivities(): void {
    this.router.navigate(['/my-activities']);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }


  // ELEVATE

<<<<<<< HEAD

      ngOnInit(){
        
      }

      roleService = inject(Role);

  




   // ELEVATE //
   currentCycle = {
=======
  currentCycle = {
>>>>>>> eyiram
    name: '',
    targets: 'TARGET',
    performance: ''
  };

  previousCycles = [
    {
      weight: 'Weight: 60%',
      application: 'Application Development & Delivery',
      name: 'TARGE',
      targets: 'Deliver 100% of assigned tasks within agreed sprint timeline',
      performance: 'Deliver 100% of assigned tasks within agreed sprint timeline'
    },
    {
      weight: 'Weight: 60%',
      application: 'Application Development & Delivery',
      name: 'TARGE',
      targets: 'Deliver 100% of assigned tasks within agreed sprint timeline',
      performance: 'Deliver 100% of assigned tasks within agreed sprint timeline'
    },
    {
      weight: 'Weight: 60%',
      application: 'Application Development & Delivery',
      name: 'TARGE',
      targets: 'Deliver 100% of assigned tasks within agreed sprint timeline',
      performance: 'Deliver 100% of assigned tasks within agreed sprint timeline'
    }
  ];

  currentCycles = {
    name: 'ELEVATE - Q3 (July - September 2026)',
    targets: '22 Jul - 30 Jul 2026',
    performance: '29 Sept - 7 Oct 2026'
  };

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

  goBack(): void {
    this.router.navigate(['/my-activities']);
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
  }


  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }


  tabActive(tab: string): void {
    this.isActiveTabs = tab;
  }

}