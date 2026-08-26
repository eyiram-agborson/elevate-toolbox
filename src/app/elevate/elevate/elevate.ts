import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-elevate',
  imports: [RouterOutlet],
  templateUrl: './elevate.html',
  styleUrl: './elevate.css',
})
export class Elevate {

  
  // isActiveTab = 'target';
  currentStep = 1;
  totalStep = 4
  message = ""
  coments = ""

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

  
}
