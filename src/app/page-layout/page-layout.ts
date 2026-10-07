import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { Role, UserRole } from '../services/role';
import { AuthService } from '../core/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';

const ROLE_LABELS: Record<UserRole, string> = {
  employee: 'Employee',
  manager: 'Manager',
  hr: 'HR',
  executive: 'Executive',
  admin: 'Administrator',
};

@Component({
  selector: 'app-page-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NzButtonModule, NzDrawerModule, NzDropdownModule],
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.css',
})
export class PageLayout {
  roleService = inject(Role);
  private readonly auth = inject(AuthService);

  isLogoutModal = false;
  isSideNav = false;

  readonly roleLabels = ROLE_LABELS;

  readonly fullName = computed(() => {
    const m = this.auth.me();
    return m ? `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim() : '';
  });
  readonly jobTitle = computed(() => this.auth.me()?.jobTitle ?? '');
  readonly initial = computed(() => (this.fullName()[0] ?? '?').toUpperCase());

  openSideNav(): void {
    this.isSideNav = true;
  }

  close(): void {
    this.isSideNav = false;
  }

  openLogoutModal(): void {
    this.isLogoutModal = true;
  }

  closeLogoutModal(): void {
    this.isLogoutModal = false;
  }

  /** The "viewing as" selector, shown only to people who hold more than one role. */
  switchRole(role: string): void {
    this.roleService.setRole(role as UserRole);
  }

  logout(): void {
    this.isLogoutModal = false;
    this.close();
    this.auth.logout();
  }
}
