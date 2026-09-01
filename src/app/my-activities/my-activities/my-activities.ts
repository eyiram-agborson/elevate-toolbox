import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../services/role';

@Component({
  selector: 'app-my-activities',
  imports: [],
  templateUrl: './my-activities.html',
  styleUrl: './my-activities.css',
})
export class MyActivities {

  roleService = inject(Role);

  constructor(private router: Router) {}

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
    this.router.navigate(['/']);
  }

  goToElevate(): void {
    const role = this.roleService.getRole();

    switch (role) {
      case 'employee':
        this.router.navigate(['/elevate/user-elevate']);
        break;

      case 'manager':
        this.router.navigate(['/elevate/manager-elevate']);
        break;

      default:
        console.error('Unsupported role for Elevate:', role);
        break;
    }
  }
  

  goToPreviousCycle(): void {
    this.router.navigate(['/activities-layout/previous-cycles']);
  }
}