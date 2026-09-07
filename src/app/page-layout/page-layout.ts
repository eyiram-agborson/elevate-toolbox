import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { Role } from '../services/role';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import {NzDropdownModule} from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-page-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NzButtonModule, NzDrawerModule, NzDropdownModule],
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.css',
})
export class PageLayout {
  roleService = inject(Role);
  
  constructor(private router: Router){}

  readonly visible = signal(false);

  isSideNav = false;

  openSideNav(): void {
    this.isSideNav = true;
  }

  close():void {
    this.isSideNav = false;
  }

  backToToolbox(): void {
  this.close();
  this.router.navigate(['/toolbox']);
}

// logout(): void {
//   this.close();
//   this.authService.logout();
// }
}
