import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'app-department-details',
  imports: [NzStepsModule, NzProgressModule ],
  templateUrl: './department-details.html',
  styleUrl: './department-details.css',
})
export class DepartmentDetails {
  
  constructor(private router: Router){}

  goToEmployeeReview(){
    this.router.navigate(['hr/departments/:id/employee/:employeeId'])
  }
}
