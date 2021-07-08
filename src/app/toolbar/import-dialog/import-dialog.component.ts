import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PortData } from 'src/app/sandbox/+state/sandbox.model';
import { correctPortData, requiredFileType } from './import-dialog.validators';
import { Validators } from '@angular/forms';
interface ControlData {
  result: PortData;
  file: File;
}

@Component({
  selector: 'app-import-dialog',
  template: `
    <div mat-dialog-content>
      <mat-icon>file_download</mat-icon>
      <p>
        Czy na pewno chcesz wczytać dane z pliku? Dotychczasowe dane zostaną
        usunięte.
      </p>
      <input type="file" />
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dismiss()">
        Anuluj
      </button>
      <button
        mat-button
        class="accept-btn"
        [mat-dialog-close]="formGroup.value.result"
        [disabled]="formGroup.invalid"
      >
        Wczytaj
      </button>
    </div>
  `,
  styleUrls: ['./import-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportDialogComponent implements OnInit {
  readonly formGroup = new FormGroup<ControlData>({
    result: new FormControl<PortData | undefined>(undefined, {
      validators: [correctPortData()]
    }),
    file: new FormControl<File | undefined>(undefined, {
      validators: [requiredFileType(), Validators.required]
    })
  });
  private readonly fileReader: FileReader = new FileReader();

  @HostListener('change', ['$event.target.files']) emitFiles(
    event: FileList
  ): void {
    const file = event?.item(0);
    this.formGroup.patchValue({ file });
    const isFileValid = this.formGroup.controls.file.valid;
    if (isFileValid) {
      this.fileReader.readAsText(file);
    }
  }

  constructor(
    readonly dialogRef: MatDialogRef<ImportDialogComponent>,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.handleFileReaderChanges();
  }

  dismiss(): void {
    this.dialogRef.close();
  }

  private handleFileReaderChanges(): void {
    this.fileReader.onloadend = () => {
      const data = JSON.parse(this.fileReader.result as string) as PortData;
      this.formGroup.patchValue({
        result: {
          links: data.links,
          nodes: data.nodes
        }
      });
      this.cdr.markForCheck();
    };
  }
}
