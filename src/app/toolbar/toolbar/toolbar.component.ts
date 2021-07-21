import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { SandboxFacade } from '../../sandbox/+state/sandbox.facade';
import { ToolbarActions } from '../+state/toolbar.actions';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { PortData } from '../../sandbox/+state/sandbox.model';
import { ChartDialogComponent } from '../chart-dialog/chart-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-toolbar',
  template: `
    <svg-icon key="agh-logo" class="agh-logo"></svg-icon>
    <div class="line"></div>
    <button
      mat-icon-button
      matTooltip="Stwórz węzeł"
      matTooltipPosition="after"
      (click)="dispatchAddAoNButtonClicked()"
    >
      <svg-icon key="add-aon-block"></svg-icon>
    </button>
    <button
      mat-icon-button
      matTooltip="Usuń węzeł/połączenie"
      matTooltipPosition="after"
      [disabled]="(sandboxFacade.isPossibleToRemoveItem$ | async) === false"
      (click)="dispatchRemoveItemButtonClicked()"
    >
      <mat-icon>delete</mat-icon>
    </button>
    <button
      mat-icon-button
      matTooltip="Połącz węzły"
      matTooltipPosition="after"
      [disabled]="!(sandboxFacade.isPossibleToEnableConnectionMode$ | async)"
      (click)="dispatchConnectNodesButtonClicked()"
    >
      <mat-icon>compare_arrows</mat-icon>
    </button>
    <div class="line"></div>
    <button
      mat-icon-button
      matTooltip="Importuj dane"
      matTooltipPosition="after"
      (click)="importButtonClicked()"
    >
      <mat-icon>file_download</mat-icon>
    </button>
    <button
      mat-icon-button
      matTooltip="Eksportuj dane"
      matTooltipPosition="after"
      [disabled]="!(sandboxFacade.isPortData$ | async)"
      (click)="exportButtonClicked()"
    >
      <mat-icon>file_upload</mat-icon>
    </button>
    <div class="line"></div>
    <button
      mat-icon-button
      matTooltip="Informacje"
      matTooltipPosition="after"
      (click)="infoButtonClicked()"
    >
      <mat-icon>info</mat-icon>
      <div
        *ngIf="(sandboxFacade.isGraphCorrect$ | async) !== undefined"
        class="down"
      >
        <button
          *ngIf="sandboxFacade.isGraphCorrect$ | async"
          mat-icon-button
          matTooltip="Podejrzyj wykres Gantta"
          matTooltipPosition="after"
          (click)="generateChartButtonClicked()"
        >
          <mat-icon>bar_chart</mat-icon>
        </button>
        <app-graph-indicator
          [isGraphCorrect]="sandboxFacade.isGraphCorrect$ | async"
        ></app-graph-indicator>
      </div>
    </button>
  `,
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  constructor(
    private readonly store: Store<any>,
    private readonly dialog: MatDialog,
    readonly sandboxFacade: SandboxFacade
  ) {}

  dispatchAddAoNButtonClicked(): void {
    this.store.dispatch(ToolbarActions.addAoNButtonClicked());
  }

  dispatchRemoveItemButtonClicked(): void {
    this.store.dispatch(ToolbarActions.removeItemButtonClicked());
  }

  dispatchConnectNodesButtonClicked(): void {
    this.store.dispatch(ToolbarActions.connectNodesButtonClicked());
  }

  exportButtonClicked(): void {
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      panelClass: 'dialog'
    });
    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: string | undefined) => {
        if (result) {
          this.store.dispatch(
            ToolbarActions.exportButtonClicked({ fileName: result })
          );
        }
      });
  }

  importButtonClicked(): void {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      panelClass: 'dialog'
    });
    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: PortData) => {
        if (result) {
          this.store.dispatch(ToolbarActions.importButtonClicked({ result }));
        }
      });
  }

  infoButtonClicked(): void {}

  generateChartButtonClicked(): void {
    this.dialog.open(ChartDialogComponent, {
      panelClass: 'dialog'
    });
  }
}
