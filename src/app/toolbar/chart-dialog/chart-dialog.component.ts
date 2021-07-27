import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ChartItem } from '../../sandbox/+state/sandbox.model';

@Component({
  selector: 'app-chart-dialog',
  template: `
    <div mat-dialog-content>
      <ngx-charts-bar-horizontal-stacked
        [scheme]="colorScheme"
        [results]="data.results"
        [gradient]="false"
        [xAxis]="true"
        [yAxis]="true"
        [legend]="false"
        [showXAxisLabel]="true"
        [showYAxisLabel]="false"
        [xAxisLabel]="'Czas'"
        [yAxisLabel]="'Zadania'"
        [xScaleMax]="10"
        [tooltipDisabled]="true"
      >
      </ngx-charts-bar-horizontal-stacked>
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
  LegendPosition = LegendPosition;

  readonly colorScheme = {
    domain: ['transparent', 'var(--primary-color)', 'var(--secondary-color)']
  };

  constructor(
    readonly dialogRef: MatDialogRef<ChartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: { results: ChartItem[] }
  ) {}

  dismiss(): void {
    this.dialogRef.close();
  }
}
