import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teamreview-totalscore',
  imports: [CommonModule, FormsModule],
  templateUrl: './teamreview-totalscore.html',
  styleUrl: './teamreview-totalscore.css',
})
export class TeamreviewTotalscore {

  pages = [1, 2, 3, 4, 5];

  // DEMO STATE
  // false = Submitted / manager can review
  // true  = Reviewed / read-only
  isReadOnly = false;

  kpis = [
    {
      title: 'Application Development & Delivery',
      weight: 60,
      targets: [
        'Deliver 100% of assigned tasks within agreed sprint timelines.',
        'Maintain agreed quality standards across all deliverables.'
      ],
      performance: null as number | null,
      rating: null as number | null,
      score: null as number | null,
      staffComments: 'I delivered 100% of assigned tasks within agreed sprint timelines.',
      managerComments: ''
    },
    {
      title: 'Operational Efficiency & Code Quality',
      weight: 20,
      targets: [
        'Maintain agreed code quality standards across all deliverables.',
        'Complete assigned development tasks within agreed timelines.'
      ],
      performance: null as number | null,
      rating: null as number | null,
      score: null as number | null,
      staffComments: 'Employee comments will appear here.',
      managerComments: ''
    },
    {
      title: 'Learning & Development',
      weight: 20,
      targets: [
        'Complete relevant professional development activities during the review cycle.',
        'Apply newly acquired skills to assigned responsibilities.'
      ],
      performance: null as number | null,
      rating: null as number | null,
      score: null as number | null,
      staffComments: 'Employee comments will appear here.',
      managerComments: ''
    }
  ];

  constructor(private router: Router) {}

  goToTeamReviews() {
    this.router.navigate(['/team-review']);
  }

  selectRating(kpi: any, rating: number) {
    if (this.isReadOnly) {
      return;
    }

    kpi.rating = rating;
  }

  getTotalScore(): number {
    if (!this.isReadOnly) {
      return 0;
    }

    return this.kpis.reduce(
      (total, kpi) => total + (kpi.score ?? 0),
      0
    );
  }

  saveDraft() {
    console.log('Saving review draft:', this.kpis);
  }

  submitReview() {
    console.log('Submitting review:', this.kpis);
  }
}