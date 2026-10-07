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
import { elevateRedirectGuard } from './elevate-redirect.guard';
import { ElevateRedirect } from './elevate-redirect';
import { SetTarget } from './elevate/set-target/set-target';
import { TeamReview } from './elevate/team-review/team-review';
import { ManagerPerformance } from './executives/manager-performance/manager-performance';
import { TeamreviewTotalscore } from './elevate/teamreview-totalscore/teamreview-totalscore';
import { Login } from './login/login';
import { authGuard, loginRedirectGuard } from './core/auth.guard';


export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [loginRedirectGuard] },
  {
    path: '', component: PageLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { 
        path: 'dashboard', component: Dashboard
      },


      { path: 'elevate/user-elevate', loadComponent: () => import('./elevate/user-elevate/user-elevate').then(m => m.UserElevate), 
        canActivate: [roleGuard], data: {role:['employee', 'hr']  }
      },
      { path: 'elevate/manager-elevate', loadComponent: () => import('./elevate/manager-elevate/manager-elevate').then(m => m.ManagerElevate),
        canActivate: [roleGuard], data: { role: 'manager' }
      },



     {path: "activities-layout", component: ActivitiesLayout,
      children:[
        {path: "", redirectTo: "my-activities", pathMatch: "full"},
        {path: "my-activities", loadComponent: () => import ('./my-activities/my-activities/my-activities').then(m => m.MyActivities)},
        // Past cycles open on the same "my cycle" screen as the current one (see MyActivities.view).
        {path: "previous-cycles", redirectTo: "my-activities", pathMatch: "full"},
      ]
     },


     {path: "set-target", loadComponent: () => import("./elevate/set-target/set-target").then(m => m.SetTarget),
      canActivate: [roleGuard], data: { role: 'manager' } },
     {path: "elevate/team-review", loadComponent: () => import ("./elevate/team-review/team-review").then(m => m.TeamReview),
      canActivate: [roleGuard], data: { role: 'manager' } },
    {path: "elevate/team-review/:id", loadComponent: () => import ("./elevate/teamreview-totalscore/teamreview-totalscore").then( m => m.TeamreviewTotalscore),
      canActivate: [roleGuard], data: { role: 'manager' } },



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
        path: 'hr/performance-cycles', loadComponent: () => import('./hr/departments/performance-cycles/performance-cycles').then(m => m.PerformanceCycles),
        canActivate: [roleGuard], data: {role: 'hr'}
      },
      {
        path: 'hr/kpi-templates', loadComponent: ()=> import('./hr/kpi-templates/kpi-templates').then(m => m.KpiTemplates),
        canActivate: [roleGuard], data: {role: 'hr'}
      },
      {
        path: 'hr/validation', loadComponent: ()=> import('./hr/validation/validation').then(m => m.Validation),
        canActivate: [roleGuard], data: {role: 'hr'}
      },
      {
        path: 'executives/department-performance', loadComponent: () => import('./executives/department-performance/department-performance').then(m =>m.DepartmentPerformance),
        canActivate: [roleGuard], data: {role: 'executive'}
      },
      {
        path: 'executives/employee-performance', loadComponent: () => import('./executives/employee-performance/employee-performance').then(m => m.EmployeePerformance),
        canActivate: [roleGuard], data: {role: 'executive'}
      },
      {
        path: 'executives/manager-performance', loadComponent: () => import('./executives/manager-performance/manager-performance').then(m => m.ManagerPerformance),
        canActivate: [roleGuard], data: {role: 'executive'}
      },
      {
        path: 'executives/manager-performance/:id', loadComponent: () => import('./executives/manager-details/manager-details').then(m => m.ManagerDetails),
        canActivate: [roleGuard], data: {role: 'executive'}
      }
    ]
  },
  {
    path: '**', redirectTo: 'dashboard'
  }
];

