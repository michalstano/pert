import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chart-dialog',
  template: `
    <div mat-dialog-content>
      Test
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dismiss()">
        Zamknij
      </button>
    </div>
  `,
  styleUrls: ['./chart-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartDialogComponent {
  constructor(readonly dialogRef: MatDialogRef<ChartDialogComponent>) {}

  dismiss(): void {
    this.dialogRef.close();
  }
}
