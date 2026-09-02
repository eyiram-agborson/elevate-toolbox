import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manager-details',
  imports: [CommonModule],
  templateUrl: './manager-details.html',
  styleUrl: './manager-details.css',
})
export class ManagerDetails {


  pages = [1, 2, 3, 4, 5];
  currentPage = 1;

  constructor(private router: Router) {}

goToManagerPerformance() {
  this.router.navigate(['/executives/manager-performance']);

}
}
