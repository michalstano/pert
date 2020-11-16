import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToolbarActions } from '../+state/toolbar.actions';

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
  `,
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  constructor(private store: Store<any>) {}

  dispatchAddAoNButtonClicked(): void {
    this.store.dispatch(ToolbarActions.addAoNButtonClicked());
  }

  dispatchConnectNodesButtonClicked(): void {
    this.store.dispatch(ToolbarActions.connectNodesButtonClicked());
  }
}
