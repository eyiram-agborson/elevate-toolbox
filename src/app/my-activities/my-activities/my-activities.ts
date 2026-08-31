import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../services/role';

@Component({
  selector: 'app-my-activities',
  imports: [],
  templateUrl: './my-activities.html',
  styleUrl: './my-activities.css',
})
export class MyActivities {

  
      activeTab = 'target';
      isActiveTab = 'target';
      currentStep = 1;
      message = ""



  constructor(private router: Router){}

  
      ngOnInit(){
        
      }

      // first toggle //
  // setTab(tab: string) {
  //   this.activeTab = tab;
  // }

  //  second toggle //
  // tabActive(tab: string){ 
  //   this.isActiveTab = tab
  // }


   // ELEVATE //
   currentCycle = {
    name: '',
    targets: 'TARGET',
    performance: ''
  };

  previousCycles = [
    {
      weight: 'Weight: 60%',
      application: 'Application Development & Delivery',
      name: 'TARGE',
      targets: 'Deliver 100% of assigned tasks within agreed sprint timeline',
      performance: 'Deliver 100% of assigned tasks within agreed sprint timeline'
    },
    {
      weight: 'Weight: 60%',
      application: 'Application Development & Delivery',
      name: 'TARGE',
      targets: 'Deliver 100% of assigned tasks within agreed sprint timeline',
      performance: 'Deliver 100% of assigned tasks within agreed sprint timeline'
    },
    {
      weight: 'Weight: 60%',
      application: 'Application Development & Delivery',
      name: 'TARGE',
      targets: 'Deliver 100% of assigned tasks within agreed sprint timeline',
      performance: 'Deliver 100% of assigned tasks within agreed sprint timeline'
    },
  ];


   currentCycles = {
    name: 'ELEVATE - Q3 (July - September 2026)',
    targets: '22 Jul - 30 Jul 2026',
    performance: '29 Sept - 7 Oct 2026'
  };

  previousCycle = [
    {
      name: 'ELEVATE - Q3 (July-September 2026)',
      targets: '22 Jul - 30 Jul 2026',
      performance: '29 Sept - 7 Oct 2026'
    },
    {
      name: 'ELEVATE - Q3 (July-September 2026)',
      targets: '22 Jul - 30 Jul 2026',
      performance: '29 Sept - 7 Oct 2026'
    },
    {
      name: 'ELEVATE - Q3 (July-September 2026)',
      targets: '22 Jul - 30 Jul 2026',
      performance: '29 Sept - 7 Oct 2026'
    }
  ];

 

  goBack() {
    this.router.navigate(["/"])
  }




// elevate = "user"
// role = 'user'
// previoursCycle = 'user' 

// /elevate/manager-elevate
// /elevate/user-elevate

  roleService = inject(Role);

  // MANAGER
    goToElevate(){
    if (this.roleService.hasRole(['manager'])) {
      this.router.navigate(['elevate/manager-elevate']); 
    } else {
      if (this.roleService.hasRole(['employee'])) {
      this.router.navigate(['elevate/user-elevate']); 
      }
    }
  }
  


// goToElevate(): void {
//   const role = this.roleService.getRole();

//   if (role === 'manager') {
//     this.router.navigate(['/elevate/manager-elevate']);
//   } else if (role === 'employee') {
//     this.router.navigate(['/elevate/user-elevate']);
//   }
// }



  goToPrevioursCycle() {
    // if (this.roleService.hasRole(['manager'])) {
    //   this.router.navigate(['/activities-layout/previous-cycles']);
    // } else {
    //   if (this.roleService.hasRole(['employee'])) {
      this.router.navigate(['/activities-layout/previous-cycles']);
    //   }
    // }
  }



    // Table button //
    // goToPrevioursCycle(){
    //   switch(this.previoursCycle){

    //     case 'user':
    //     this.router.navigate(["/activities-layout/previous-cycles"])
    //     break

    //     case 'manager':
    //     this.router.navigate(["/activities-layout/previous-cycles"])
    //     break
    //   }
      
    // }
}
