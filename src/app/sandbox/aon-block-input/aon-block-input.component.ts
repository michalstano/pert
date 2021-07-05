import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';

@Component({
  selector: '[aon-block-input]',
  template: `
    <input
      *ngIf="!isTextField"
      #input
      digitOnly
      maxlength="3"
      [formControl]="control"
      [readonly]="!isBeingEdited"
      [disableControl]="!isBeingEdited && !isFirstItem"
      [class.invalid]="control.invalid"
      (focusout)="removeSelection()"
    />
    <input
      *ngIf="isTextField"
      #input
      maxlength="10"
      [formControl]="control"
      [readonly]="!isBeingEdited"
      [disableControl]="!isBeingEdited && !isFirstItem"
      [class.invalid]="control.invalid"
      (focusout)="removeSelection()"
    />
  `,
  styleUrls: ['./aon-block-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AonBlockInputComponent {
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @Input() control: FormControl<string | number>;
  @Input() isBeingEdited: boolean;
  @Input() isFirstItem: boolean = false;
  @Input() isTextField: boolean = false;

  focus(): void {
    this.input.nativeElement.focus();
  }

  removeSelection(): void {
    window.getSelection().empty();
  }
}
