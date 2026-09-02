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

  goToEmployeePerformance() {
    this.router.navigate(['executives/employee-performance']);
  }

goToManagerDetails() {
  this.router.navigate(['executives/manager-details']);
}

}
