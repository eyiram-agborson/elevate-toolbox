import { Component } from '@angular/core';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-departments',
  imports: [NzStepsModule, NzProgressModule, FormsModule, CommonModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments {
    constructor(private router: Router){}

  goToDepartmentDetails(){
    this.router.navigate(['hr/departments/:id'])
  }

selectedCycle = 'Q1';

cycles = [
    { value: 'Q1', label: 'ELEVATE – Q1 (January – March 2026)' },
    { value: 'Q2', label: 'ELEVATE – Q2 (April – June 2026)' },
    { value: 'Q3', label: 'ELEVATE – Q3 (July – September 2026)' },
    { value: 'Q4', label: 'ELEVATE – Q4 (October – December 2026)' }
];

onCycleChange(): void {
    console.log('Selected cycle:', this.selectedCycle);
}

}
