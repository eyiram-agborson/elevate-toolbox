import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzCollapseModule } from "ng-zorro-antd/collapse";

@Component({
  selector: 'app-employee-performance',
  imports: [NzCollapseModule],
  templateUrl: './employee-performance.html',
  styleUrl: './employee-performance.css',
})
export class EmployeePerformance {

   constructor(private router: Router){}


   goToDashboard(){
    this.router.navigate(["/dashboard"])
  }

  goToManagerPerformance(){
    this.router.navigate(["executives/manager-performance"])
  }

  showEmployeeModal = false;

  isStatusNotSubmitted = true;


openEmployeeDetails(employeeName: string): void {
  // later this will select the actual employee from your API data
  this.showEmployeeModal = true;
}

closeEmployeeDetails(): void {
  this.showEmployeeModal = false;
}
}
