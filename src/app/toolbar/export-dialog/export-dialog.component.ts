import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@ngneat/reactive-forms';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-export-dialog',
  template: `
    <div mat-dialog-content>
      <mat-icon>file_upload</mat-icon>
      <p>
        Czy na pewno chcesz zapisać dane do pliku? Jeśli tak, to podaj nazwę
        pliku.
      </p>
      <mat-form-field class="example-full-width" appearance="fill">
        <mat-label>Nazwa pliku</mat-label>
        <input
          type="text"
          matInput
          cdkFocusInitial
          max-length="10"
          [formControl]="control"
        />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dismiss()">
        Anuluj
      </button>
      <button
        mat-button
        class="accept-btn"
        [mat-dialog-close]="control.value"
        [disabled]="control.invalid"
      >
        Zapisz
      </button>
    </div>
  `,
  styleUrls: ['./export-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportDialogComponent {
  readonly control = new FormControl<string>('', {
    validators: [Validators.required]
  });

  constructor(
    readonly dialogRef: MatDialogRef<ExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: DialogData
  ) {}

  dismiss(): void {
    this.dialogRef.close();
  }
}
