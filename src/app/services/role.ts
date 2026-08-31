import { Injectable } from '@angular/core';

export type UserRole = 'employee' | 'manager' | 'hr' | 'executive' | 'admin';

@Injectable({
  providedIn: 'root',
})
export class Role {

  private currentRole: UserRole = 'manager';

  getRole(): UserRole{
    return this.currentRole;
  }

  setRole(role: UserRole): void {
    this.currentRole = role;
  }

hasRole(roles: UserRole | UserRole[]): boolean {
  if (this.currentRole === 'admin') {
    return true;
  }

  if (Array.isArray(roles)) {
    return roles.includes(this.currentRole);
  }

  return this.currentRole === roles;
}

// hasRole(role: UserRole): boolean {
//   return this.currentRole === 'admin' || this.currentRole === role;
// }

}
