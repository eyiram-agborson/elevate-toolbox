import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-activities',
  imports: [],
  templateUrl: './my-activities.html',
  styleUrl: './my-activities.css',
})
export class MyActivities {

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

  role = 'manager';

  previousCycleRole = 'manager';


  goBack(): void {
    this.router.navigate(['/']);
  }


  // goToElevate(): void {
  //   switch (this.role) {
  //     case 'employee':
  //       this.router.navigate(['/elevate/user-elevate']);
  //       break;

  //     case 'manager':
  //       this.router.navigate(['/elevate/manager-elevate']);
  //       break;

  //     default:
  //       console.error('Unknown role:', this.role);
  //       break;
  //   }
  // }

goToElevate(): void {
  this.router.navigate(['/elevate/manager-elevate']);
}
  goToPreviousCycle(): void {
    switch (this.previousCycleRole) {
      case 'employee':
        this.router.navigate(['/activities-layout/previous-cycles']);
        break;

      case 'manager':
        this.router.navigate(['/activities-layout/previous-cycles']);
        break;

      default:
        console.error('Unknown role:', this.previousCycleRole);
        break;
    }
  }

}