import { Component, inject } from '@angular/core';
import { Role } from '../services/role';
import { Router, RouterLink } from '@angular/router';

import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, NzStepsModule, NzProgressModule  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  roleService = inject(Role);

  constructor(private router: Router){}

  goToElevate() {
    this.router.navigate(['/elevate']);
  }

goToMyActivities() {
  this.router.navigate(['/activities-layout/my-activities']);
}

  go() {
    this.router.navigate(['/manager-performance']);
  }

  goToEmployeeReview() {
    this.router.navigate(['/employee-review']);
  }

  goToDepartmentDetails() {
    this.router.navigate(['hr/departments/:id']);
  }

  goToEmployeeDetails(){
    this.router.navigate(['/hr/departments/:id/employee/:employeeId'])
  }

  goToPerformanceCycles(){
    this.router.navigate(['/hr/performance-cycles'])
  }

  notificationsOpen = false;

hasTargetChange = true;

toggleNotifications(): void {
  this.notificationsOpen = !this.notificationsOpen;
}

reviewTargetChanges(): void {
  this.notificationsOpen = false;

  this.router.navigate(['/set-target']);
}

//executive dashboard

goToDepartmentPerformance() {
  this.router.navigate(['executives/department-performance']);
}

goToManagerPerformance() {
  this.router.navigate(['executives/manager-performance']);
}

goToEmployeePerformance() {
  this.router.navigate(['executives/employee-performance']);
}

}
