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
      [attr.disabled]="(!isBeingEdited && !isFirstItem) || null"
      [class.invalid]="control.invalid"
      (focusout)="removeSelection()"
    />
    <!-- type submit is required in e2e tests -->
    <input
      *ngIf="isTextField"
      #input
      maxlength="10"
      [attr.type]="isBeingEdited ? 'text' : 'submit'"
      [formControl]="control"
      [readonly]="!isBeingEdited"
      [attr.disabled]="(!isBeingEdited && !isFirstItem) || null"
      [class.invalid]="control.invalid"
      [attr.value]="control.value"
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
  @Input() isFirstItem = false;
  @Input() isTextField = false;

  focus(): void {
    this.input.nativeElement.focus();
  }

  removeSelection(): void {
    window.getSelection().empty();
  }
}
