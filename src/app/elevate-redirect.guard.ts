
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from './services/role'; 

export const elevateRedirectGuard: CanActivateFn = () => {
  const roleService = inject(Role);
  const router = inject(Router);

  const role = roleService.getRole();

  console.log('Elevate role:', role);

  if (role === 'manager') {
    return router.createUrlTree(['/elevate/manager-elevate']);
  }

  if (role === 'employee') {
    return router.createUrlTree(['/elevate/user-elevate']);
  }

  // Default for other roles
  return router.createUrlTree(['/elevate/user-elevate']);
};





// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { Role } from './services/role';

// export const elevateRedirectGuard: CanActivateFn = () => {
//   const roleService = inject(Role);
//   const router = inject(Router);

//   console.log('Elevate guard running');
//   console.log('Current role:', roleService.getRole());

//   if (roleService.getRole() === 'manager') {
//     return router.createUrlTree(['/elevate/manager-elevate']);
//   }

//   if (roleService.getRole() === 'employee') {
//     return router.createUrlTree(['/elevate/user-elevate']);
//   }

//   return router.createUrlTree(['/elevate/user-elevate']);
// };






// // import { inject } from '@angular/core';
// // import { CanActivateFn, Router } from '@angular/router';
// // import { Role } from './services/role'; 

// // export const elevateRedirectGuard: CanActivateFn = () => {
// //   const role = inject(Role);
// //   const router = inject(Router);

// //   if (role.getRole() === 'manager') {
// //     return router.parseUrl('/elevate/manager-elevate');
// //   }

// //   return router.parseUrl('/elevate/user-elevate');
// // };
