import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { UserElevate } from '../user-elevate/user-elevate';

// A manager is also an employee: their own targets, self-review and result use the
// same screen as everyone else's. (The "automatically calculated" team KPI and the
// executive's rating of a manager are planned for a later phase.)
@Component({
  selector: 'app-manager-elevate',
  imports: [
    NzSegmentedModule,
    NzAvatarModule,
    NzStepsModule,
    NzProgressModule,
    NzButtonModule,
    CommonModule,
    FormsModule,
    NzCollapseModule,
  ],
  templateUrl: '../user-elevate/user-elevate.html',
  styleUrl: '../user-elevate/user-elevate.css',
})
export class ManagerElevate extends UserElevate {
  override goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
