import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-performance',
  imports: [],
  templateUrl: './manager-performance.html',
  styleUrl: './manager-performance.css',
})
export class ManagerPerformance {

  constructor(private router: Router) {}

  goToDepartmentPerformance() {
    this.router.navigate(['executives/department-performance']);
  }

  goToManagerDetails() {
    this.router.navigate(['executives/manager-performance/:id']);
  }

  goToEmployeePerformance() {
    this.router.navigate(['executives/employee-performance']);
  }


}
