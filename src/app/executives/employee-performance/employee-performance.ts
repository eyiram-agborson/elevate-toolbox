import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-performance',
  imports: [],
  templateUrl: './employee-performance.html',
  styleUrl: './employee-performance.css',
})
export class EmployeePerformance {

   constructor(private router: Router){}

   goToDashboad(){
    this.router.navigate(["/dashboard"])
  }
}
