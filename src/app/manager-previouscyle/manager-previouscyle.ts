import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzCollapseModule} from 'ng-zorro-antd/collapse'
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-manager-previouscyle',
  imports: [NzAvatarModule, NzCollapseModule, NzStepsModule],
  templateUrl: './manager-previouscyle.html',
  styleUrl: './manager-previouscyle.css',
})
export class ManagerPreviouscyle {

  
      // activeTab = 'target';
      isActiveTab = 'target';
      currentStep = 1;
      message = ""
      isActive = false;


      constructor(private router: Router){}


      ngOnInit(){
        
      }

      // roleService = inject(Role);

  




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
    this.router.navigate(["/my-activities"])
  }



  toggleActive() {
    this.isActive = !this.isActive;
  }


  // move to next step //
nextStep() {
  if (this.currentStep < 3) {
    this.currentStep++;
  }
}



isActiveTabs = 'complete' 

tabActive(tab: string){
  this.isActiveTabs = tab
}

}
