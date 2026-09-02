import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teamreview-totalscore',
  imports: [CommonModule],
  templateUrl: './teamreview-totalscore.html',
  styleUrl: './teamreview-totalscore.css',
})
export class TeamreviewTotalscore {

  pages = [1, 2, 3, 4, 5];
  currentPage = 1;

  constructor(private router: Router) {}

  goToTeamReviews() {
    this.router.navigate(['/team-review']);
  }
}
