import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { SandboxFacade } from '../../sandbox/+state/sandbox.facade';
import { ToolbarActions } from '../+state/toolbar.actions';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-toolbar',
  template: `
    <svg-icon key="agh-logo" class="agh-logo"></svg-icon>
    <div class="line"></div>
    <button mat-icon-button (click)="dispatchAddAoNButtonClicked()">
      <svg-icon key="add-aon-block"></svg-icon>
    </button>
    <button mat-icon-button>
      <svg-icon key="remove-aon-block"></svg-icon>
    </button>
    <button mat-icon-button (click)="dispatchConnectNodesButtonClicked()">
      <mat-icon>compare_arrows</mat-icon>
    </button>
    <div class="line"></div>
    <button mat-icon-button (click)="importButtonClicked()">
      <mat-icon>file_download</mat-icon>
    </button>
    <button
      mat-icon-button
      [disabled]="!(sandboxFacade.isPortData$ | async)"
      (click)="exportButtonClicked()"
    >
      <mat-icon>file_upload</mat-icon>
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

  importButtonClicked(): void {}
}
