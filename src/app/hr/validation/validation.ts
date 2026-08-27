import { Component } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [NzDropDownModule, NzMenuModule ],
  templateUrl: './validation.html',
  styleUrl: './validation.css'
})
export class Validation {

  showValidateModal = false;

  selectedScore: number | null = null;

  openValidateModal(): void {
    this.selectedScore = null;
    this.showValidateModal = true;
    console.log('Validate modal clicked')
  }

  closeValidateModal(): void {
    this.showValidateModal = false;
    this.selectedScore = null;
  }

  saveValidation(): void {
    if (this.selectedScore === null) {
      return;
    }

    console.log('Selected validation score:', this.selectedScore);

    this.closeValidateModal();
  }
}