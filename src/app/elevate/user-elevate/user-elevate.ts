import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { FormsModule } from '@angular/forms';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-user-elevate',
  imports: [NzSegmentedModule, NzAvatarModule, NzStepsModule, NzProgressModule, NzButtonModule, CommonModule, FormsModule],
  templateUrl: './user-elevate.html',
  styleUrl: './user-elevate.css',
})
export class UserElevate {

  
  // isActiveTab = 'target';
  currentStep = 1;
  totalStep = 4
  message = ""
  coments = ""

  current =1

  role = 'manager'


      constructor(private router: Router){}


      ngOnInit(){
        
      }

         
    
      myactivities(){
        this.router.navigate(["/my-activities"])
      }


    goToElevate() {
      this.router.navigate(["/elevate"])
    }



//  currentSteps = signal(0);

// Steps progress //
isActiveTab = 'target'

tabsActive(tab: string){
  this.isActiveTab = tab
}

//  pagination buttons //
pages = [1, 2, 3, 4, 5];
currentPage = 1;

goToPage(page: number): void {
  this.currentPage = page;

  // Load/update your data here
}




// tabActives(tab: string){
//   this.isActiveTabs = tab
// }









previousCycles = [
    {
      weight: 'Weight: 60%',
      application: 'Application Development & Delivery',
      name: 'TARGE',
      targets: 'Deliver 100% of assigned tasks within agreed sprint timeline',
      performance: 'Deliver 100% of assigned tasks within agreed sprint timeline'
    },
   
  ];


  // MAGER //
  //  previousCycles = [
  //   {
  //     weight: 'Weight: 60%',
  //     application: 'Application Development & Delivery',
  //     name: 'TARGE',
  //     targets: 'Deliver 100% of assigned tasks within agreed sprint timeline',
  //     performance: 'Deliver 100% of assigned tasks within agreed sprint timeline'
  //   },
    
  // ];


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

 
// top tab
  tabActive(tab: string) {
  this.isActiveTab = tab;

  switch (tab) {
    case 'target':
      this.currentStep = 1;
      break;

    case 'self-review':
      this.currentStep = 2;
      break;

    case 'manager-review':
      this.currentStep = 3;
      break;

    case 'complete':
      this.currentStep = 4;
      break;
  }
  
}



goToActivities(){
  this.router.navigate(["/my-activities"])
}

  goToDashboard() {
    this.router.navigate(["/dashboard"])
  }





  //   options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  // handleValueChange(e: string | number): void {
  //   console.log(e);
  // }
 isActiveTabss: 'target' | 'complete' = 'target';

  options = [
    {
      label: 'Target',
      value: 'target'
    },
    {
      label: 'Complete',
      value: 'complete'
    }
  ];

  tabsActives(tab: string): void {
    this.isActiveTab = tab as 'target' | 'complete';
  }
  
}
