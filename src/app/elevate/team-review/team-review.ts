import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-review',
  imports: [],
  templateUrl: './team-review.html',
  styleUrl: './team-review.css',
})
export class TeamReview {

  constructor(private router: Router){}

  route(){
    this.router.navigate(["/elevate/teamreview-totalscore"])
  }

   goToDashboard(){
    this.router.navigate(["/elevate/dashboard"])
  }
}
