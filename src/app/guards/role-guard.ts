import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role, UserRole } from '../services/role';

export const roleGuard: CanActivateFn = (route) => {
  const roleService = inject(Role);
  const router = inject(Router);

  const requiredRole = route.data['role'] as UserRole;

  if (roleService.hasRole(requiredRole)) {
    return true;
  }

  return router.parseUrl('/dashboard');
};