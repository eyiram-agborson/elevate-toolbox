import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-performance',
  imports: [],
  templateUrl: './department-performance.html',
  styleUrl: './department-performance.css',
})
export class DepartmentPerformance {

  
  constructor(private router: Router){}

  goToDashboard(){
    this.router.navigate(["/dashboard"])
  }

  goToManagers(){
    this.router.navigate(["/manager-performance"])
  }

  goToDashboad(){
    this.router.navigate(["/dashboard"])
  }

}
