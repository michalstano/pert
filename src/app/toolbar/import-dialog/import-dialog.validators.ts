import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidatorFn } from '@ngneat/reactive-forms';

export function requiredFileType(): ValidatorFn {
  const correctType = 'json';
  return (control: AbstractControl): ValidationErrors => {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (correctType.toLowerCase() !== extension.toLowerCase()) {
        return {
          requiredFileType: true
        };
      }

      return null;
    }

    return null;
  };
}

export function correctPortData(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors => {
    const result = control.value;
    if (result) {
      const areNodes = Array.isArray(result.nodes);
      const areLinks = Array.isArray(result.links);

      if (areNodes && areLinks) {
        return null;
      }

      return {
        incorrectData: true
      };
    }

    return null;
  };
}
