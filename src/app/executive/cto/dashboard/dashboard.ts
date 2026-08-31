import { Component, inject } from '@angular/core';
import { Role } from '../../../services/role'; 

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  roleService = inject(Role);
}
