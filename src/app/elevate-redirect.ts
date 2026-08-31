
// import { Component, OnInit, inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { Role } from './services/role';

// @Component({
//   selector: 'app-elevate-redirect',
//   standalone: true,
//   template: ''
// })
// export class ElevateRedirect implements OnInit {

//   private roleService = inject(Role);
//   private router = inject(Router);

//   ngOnInit(): void {
//     const role = this.roleService.getRole();

//     if (role === 'manager') {
//       this.router.navigate(['/elevate/manager-elevate']);
//     } else {
//       this.router.navigate(['/elevate/user-elevate']);
//     }
//   }
// }


import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from './services/role';

@Component({
  selector: 'app-elevate-redirect',
  standalone: true,
  template: ''
})
export class ElevateRedirect implements OnInit {

  private roleService = inject(Role);
  private router = inject(Router);

  ngOnInit(): void {
    const role = this.roleService.getRole();

    if (role === 'manager') {
      this.router.navigate(['/elevate/manager-elevate'], {
        replaceUrl: true
      });
    } else {
      this.router.navigate(['/elevate/user-elevate'], {
        replaceUrl: true
      });
    }
  }
}



