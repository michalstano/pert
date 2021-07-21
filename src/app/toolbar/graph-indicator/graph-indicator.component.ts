import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-graph-indicator',
  template: `
    <ng-container [ngSwitch]="isGraphCorrect">
      <ng-container *ngSwitchCase="true">
        <mat-icon class="correct-icon">check</mat-icon>
        <p>Poprawny</p>
      </ng-container>
      <ng-container *ngSwitchCase="false">
        <mat-icon class="incorrect-icon">clear</mat-icon>
        <p>Niepoprawny</p>
      </ng-container>
    </ng-container>
  `,
  styleUrls: ['./graph-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphIndicatorComponent {
  @Input() isGraphCorrect: boolean | undefined = undefined;
}
