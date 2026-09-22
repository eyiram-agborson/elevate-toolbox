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

  // route(id: number){
  //   this.router.navigate(["/elevate/teamreview-totalscore", id])
  // }
   route(id: number){
    this.router.navigate(["elevate/team-review", id])
    console.log("Team-review router Id", id)
  }

   goToDashboard(){
    this.router.navigate(["/elevate/dashboard"])
  }
}
