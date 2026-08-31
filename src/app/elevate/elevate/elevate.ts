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


current = 3;

  role = 'manager'


      constructor(private router: Router){}


      ngOnInit(){
        
      }


  
}
