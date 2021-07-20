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

    const rules = [
      +earliestFinish - +earliestStart === +duration,
      +latestFinish - +duration === +latestStart,
      +latestStart - +float === +earliestStart,
      earliestStart < earliestFinish,
      latestStart < latestFinish,
      latestStart >= earliestStart,
      latestFinish >= earliestFinish
    ];

    if (rules.every(r => !!r)) {
      return null;
    }
    return { incorrectValues: true };
  };
}
