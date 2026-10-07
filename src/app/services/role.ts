import { Injectable, signal } from '@angular/core';

export type UserRole = 'employee' | 'manager' | 'hr' | 'executive' | 'admin';

const ROLE_KEY = 'elevate.role';

// The role the screens use is the one the person is "viewing as". The levels they
// may choose from come from the backend (GET /elevate/me); nothing is decided here.
@Injectable({
  providedIn: 'root',
})
export class Role {
  private readonly currentRole = signal<UserRole>('employee');
  private readonly available = signal<UserRole[]>(['employee']);

  /** Roles this person may switch between (just employee until /elevate/me has loaded). */
  readonly availableRoles = this.available.asReadonly();
  readonly role = this.currentRole.asReadonly();

  getRole(): UserRole {
    return this.currentRole();
  }

  setRole(role: UserRole): void {
    if (!this.available().includes(role)) return;
    this.currentRole.set(role);
    try {
      localStorage.setItem(ROLE_KEY, role);
    } catch {
      /* storage unavailable */
    }
  }

  /** Called with the levels from GET /elevate/me. */
  applyLevels(levels: string[]): void {
    const has = (l: string) => levels.includes(l);
    const roles: UserRole[] = [];
    // Someone with every level is the organisation head: they see everything.
    if (has('employee') && has('manager') && has('hr') && has('executive')) roles.push('admin');
    if (has('executive')) roles.push('executive');
    if (has('hr')) roles.push('hr');
    if (has('manager')) roles.push('manager');
    roles.push('employee');
    this.available.set(roles);

    let saved: string | null = null;
    try {
      saved = localStorage.getItem(ROLE_KEY);
    } catch {
      /* storage unavailable */
    }
    this.currentRole.set(roles.includes(saved as UserRole) ? (saved as UserRole) : roles[0]);
  }

  reset(): void {
    this.available.set(['employee']);
    this.currentRole.set('employee');
    try {
      localStorage.removeItem(ROLE_KEY);
    } catch {
      /* storage unavailable */
    }
  }

  hasRole(roles: UserRole | UserRole[]): boolean {
    const current = this.currentRole();
    if (current === 'admin') {
      return true;
    }

    if (Array.isArray(roles)) {
      return roles.includes(current);
    }

    return current === roles;
  }
}
