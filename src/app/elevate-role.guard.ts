
import { inject } from '@angular/core';
import { CanMatchFn, Route, Router } from '@angular/router';
import { Role } from './services/role';

export const managerElevateGuard: CanMatchFn = () => {
  const roleService = inject(Role);

  return roleService.getRole() === 'manager';
};

export const employeeElevateGuard: CanMatchFn = () => {
  const roleService = inject(Role);

  return roleService.getRole() === 'employee';
};

