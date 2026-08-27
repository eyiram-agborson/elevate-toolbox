import { Component } from '@angular/core';

@Component({
  selector: 'app-validation',
  imports: [],
  templateUrl: './validation.html',
  styleUrl: './validation.css',
})
export class Validation {
showValidateModal = false;
selectedValidationScore: number | null = null;

validationScores = [1, 2, 3, 4, 5];

openValidateModal(): void {
  this.selectedValidationScore = null;
  this.showValidateModal = true;
}

closeValidateModal(): void {
  this.showValidateModal = false;
  this.selectedValidationScore = null;
}

selectValidationScore(score: number): void {
  this.selectedValidationScore = score;
}

saveValidationScore(): void {
  if (this.selectedValidationScore === null) {
    return;
  }

  console.log('Validation score:', this.selectedValidationScore);

  this.closeValidateModal();
}


}
