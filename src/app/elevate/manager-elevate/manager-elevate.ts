import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzCollapseModule} from 'ng-zorro-antd/collapse'

@Component({
  selector: 'app-manager-elevate',
  imports: [NzCollapseModule, NzStepsModule],
  templateUrl: './manager-elevate.html',
  styleUrl: './manager-elevate.css',
})
export class ManagerElevate {

  
  // isActiveTab = 'target';
  currentStep = 1;
  totalStep = 4
  message = ""
  coments = ""


current = 3;

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

isActiveTabs = 'target' 

// tabActives(tab: string){
//   this.isActiveTabs = tab
// }

  // readonly panels = [
  //   {
  //     active: true,
  //     name: 'This is panel header 1'
  //   },
  //   {
  //     active: false,
  //     name: 'This is panel header 2'
  //   },
  //   {
  //     active: false,
  //     name: 'This is panel header 3'
  //   }
  // ];










previousCycles = [
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


// go to my-activities
goToActivities(){
  this.router.navigate(["/my-activities"])
}

// Go to dashboard
  goToDashboard() {
    this.router.navigate(["/dashboard"])
  }








 readonly panels = [
    {
      active: true,
      name: 'This is panel header 1'
    },
    {
      active: false,
      name: 'This is panel header 2'
    },
    {
      active: false,
      name: 'This is panel header 3'
    }
  ];
  
}
