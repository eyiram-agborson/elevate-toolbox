import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { PageLayout } from './page-layout/page-layout';
import { Elevate } from './elevate/elevate';

export const routes: Routes = [
  {
    path: '', component: PageLayout,
    children: [
      {
        path: 'dashboard', component: Dashboard
      },
      {
        path: 'elevate', component: Elevate
      }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**', redirectTo: 'dashboard'
  }
];



// {
//   path: 'elevate',
//   component: Elevate,
//   canActivate: [roleGuard],
//   data: { role: 'manager' }
// }