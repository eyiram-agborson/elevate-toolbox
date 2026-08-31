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
import { MyActivities } from './my-activities/my-activities/my-activities'; 
import { ActivitiesLayout } from './my-activities/activities-layout/activities-layout';
import { PreviousCycles } from './my-activities/previous-cycles/previous-cycles';
import { ExecutivepageLayout } from './executive/cto/executivepage-layout/executivepage-layout'; 
import { ManagerPerformance } from './executive/cto/manager-performance/manager-performance';
import { ManagerPreviouscyle } from './manager-previouscyle/manager-previouscyle';
import { elevateRedirectGuard } from './elevate-redirect.guard';
import { ElevateRedirect } from './elevate-redirect';


export const routes: Routes = [
  {
    path: '', component: PageLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: Dashboard},


  {
  path: 'elevate', component: Elevate,
     children: [
    { path: '', redirectTo: 'manager-elevate', pathMatch: 'full'},
    { path: 'user-elevate', loadComponent: () => import('./elevate/user-elevate/user-elevate').then(m => m.UserElevate)},
    { path: 'manager-elevate', loadComponent: () => import('./elevate/manager-elevate/manager-elevate').then(m => m.ManagerElevate)}
  ]
},


     {path: "activities-layout", component: ActivitiesLayout,
      children:[
        {path: "", redirectTo: "my-activities", pathMatch: "full"},
        {path: "my-activities", loadComponent: () => import ('./my-activities/my-activities/my-activities').then(m => m.MyActivities)},
        {path: "previous-cycles", loadComponent: () => import ('./my-activities/previous-cycles/previous-cycles').then(m => m.PreviousCycles)},
      ]
     },


      {path: "executivepage-layout", component: ExecutivepageLayout,
      children:[
        {path: "", redirectTo: "dashboard", pathMatch: "full"},
        {path: "dashboard", component: Dashboard },
        {path: "department-performance", loadComponent: () => import ('./executive/cto/department-performance/department-performance').then(m => m.DepartmentPerformance)},
        {path: "manager-performance", component: ManagerPerformance },
        {path: "dashboard", component: Dashboard },
      ]
     },



      {
        path: 'hr/departments', loadComponent: ()=> import('./hr/departments/departments').then(m => m.Departments),
        canActivate: [roleGuard], data: {role: 'hr'}
      },
      {
        path: 'hr/departments/:id', component: DepartmentDetails,
        canActivate: [roleGuard], data: {role: 'hr'}
      },
      {
        path: 'hr/departments/:id/employee/:employeeId', component: EmployeeReview,
        canActivate: [roleGuard], data: {role: 'hr'}
      },
      {
        path: 'hr/performance-cycles', loadComponent: () => import('./hr/performance-cycles/performance-cycles').then(m => m.PerformanceCycles),
        canActivate: [roleGuard], data: {role: 'hr'}
      },
      {
        path: 'hr/kpi-templates', loadComponent: ()=> import('./hr/kpi-templates/kpi-templates').then(m => m.KpiTemplates),
        canActivate: [roleGuard], data: {role: 'hr'}
      },
      {
        path: 'hr/validation', loadComponent: ()=> import('./hr/validation/validation').then(m => m.Validation),
        canActivate: [roleGuard], data: {role: 'hr'}
      }
    ]
  },
  {
    path: '**', redirectTo: 'dashboard'
  }
];

