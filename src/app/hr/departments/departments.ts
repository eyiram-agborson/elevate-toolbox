import { Component } from '@angular/core';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { Router } from '@angular/router';

@Component({
  selector: 'app-departments',
  imports: [NzStepsModule, NzProgressModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments {
    constructor(private router: Router){}

  goToDepartmentDetails(){
    this.router.navigate(['hr/departments/:id'])
  }
}
