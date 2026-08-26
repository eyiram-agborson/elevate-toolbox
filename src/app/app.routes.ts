import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { PageLayout } from './page-layout/page-layout';
import { Elevate } from './elevate/elevate/elevate'; 
import { Departments } from './hr/departments/departments';
import { roleGuard } from './guards/role-guard';
import { DepartmentDetails } from './hr/departments/department-details/department-details';
import { EmployeeReview } from './hr/departments/employee-review/employee-review';
import { ManagerElevate } from './elevate/manager-elevate/manager-elevate';
import { UserElevate } from './elevate/user-elevate/user-elevate';

export const routes: Routes = [
  {
    path: '', component: PageLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard', component: Dashboard
      },

      
      // {
      //   path: 'elevate', component: Elevate
      // },

      {path: "elevate", component: Elevate,
        children:[
            {path: "", redirectTo: 'user-elevate', pathMatch: 'full'},
            {path: "user-elevate", component: UserElevate},
            {path: "manager-elevate", component: ManagerElevate},
        ]
     },



      {
        path: 'hr/departments', component: Departments,
        canActivate: [roleGuard], data: {role: 'hr'}
      },
      {
        path: 'hr/departments/:id', component: DepartmentDetails,
        canActivate: [roleGuard], data: {role: 'hr'}
      },
      {
        path: 'hr/departments/:id/employee/:employeeId', component: EmployeeReview,
        canActivate: [roleGuard], data: {role: 'hr'}
      }
    ]
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