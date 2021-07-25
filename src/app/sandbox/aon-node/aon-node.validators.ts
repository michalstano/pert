import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@ngneat/reactive-forms/lib/types';
import { AoNData } from '../+state/sandbox.model';
import { convertAoNData } from './aon-node.utils';

export function correctNodeValidator(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const {
      earliestStart,
      duration,
      earliestFinish,
      latestStart,
      float,
      latestFinish
    }: AoNData = convertAoNData(form.value);

    const rules = [
      earliestStart + duration === earliestFinish,
      latestFinish - duration === latestStart,
      latestFinish - float === earliestFinish,
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
