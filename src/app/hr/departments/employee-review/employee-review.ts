import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'app-employee-review',
  imports: [RouterLink, NzCollapseModule],
  templateUrl: './employee-review.html',
  styleUrl: './employee-review.css',
})
export class EmployeeReview implements OnInit {

  // DEMO (TESTING THE HISTORICAL VIEW)

  // selectedCycle = 'Q2';
  // isHistoricalCycle = false;

  // ngOnInit(): void {
  //   this.selectedCycle = 'Q2';

  //   this.isHistoricalCycle =
  //     this.selectedCycle === 'Q1' ||
  //     this.selectedCycle === 'Q2';
  // }

constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  selectedCycle = 'Q3';
  isHistoricalCycle = false;

  ngOnInit(): void {
    this.selectedCycle =
      this.route.snapshot.queryParamMap.get('cycle') ?? 'Q3';

    this.isHistoricalCycle =
      this.selectedCycle === 'Q1' ||
      this.selectedCycle === 'Q2';
  }
 

}