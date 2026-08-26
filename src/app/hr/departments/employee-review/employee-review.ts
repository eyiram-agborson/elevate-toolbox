import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'app-employee-review',
  imports: [RouterLink, NzCollapseModule],
  templateUrl: './employee-review.html',
  styleUrl: './employee-review.css',
})
export class EmployeeReview {}
