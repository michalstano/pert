import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@ngneat/reactive-forms/lib/types';
import { AoNData } from '../+state/sandbox.model';

export function correctNodeValidator(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const {
      earliestStart,
      duration,
      earliestFinish,
      latestStart,
      float,
      latestFinish
    }: AoNData = form.value;

    const firstRule = +earliestFinish - +earliestStart === +duration;
    const secondRule = +latestFinish - +duration === +latestStart;
    const thirdRule = +latestStart - +float === +earliestStart;

    if (firstRule && secondRule && thirdRule) {
      return null;
    }
    return { incorrectValues: true };
  };
}
