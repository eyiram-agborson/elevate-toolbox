import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'app-department-details',
  imports: [NzStepsModule, NzProgressModule],
  templateUrl: './department-details.html',
  styleUrl: './department-details.css',
})
export class DepartmentDetails implements OnInit {

  // DEMO (TESTING THE HISTORICAL ROUTE)
  
//   selectedCycle = 'Q2'; //demo purposes

//  ngOnInit(): void {
//   this.selectedCycle = 'Q2';

//   this.isHistoricalCycle =
//     this.selectedCycle === 'Q1' ||
//     this.selectedCycle === 'Q2';
// }

  selectedCycle = 'Q3';

  isHistoricalCycle = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}



ngOnInit(): void {
  this.selectedCycle =
    this.route.snapshot.queryParamMap.get('cycle') ?? 'Q3';

  this.isHistoricalCycle =
    this.selectedCycle === 'Q1' ||
    this.selectedCycle === 'Q2';
}

  goToEmployeeReview(): void {
    this.router.navigate(
      ['hr/departments/:id/employee/:employeeId'],
      {
        queryParams: {
          cycle: this.selectedCycle
        }
      }
    );
  }
}