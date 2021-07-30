import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { Store } from '@ngrx/store';
import { SvgIconComponent } from '@ngneat/svg-icon';
import { HotToastService } from '@ngneat/hot-toast';
import { of } from 'rxjs';
import { MockComponents } from 'ng-mocks';
import { SandboxFacade } from '../../sandbox/+state/sandbox.facade';
import { GraphIndicatorComponent } from '../graph-indicator/graph-indicator.component';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarActions } from '../+state/toolbar.actions';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { ChartDialogComponent } from '../chart-dialog/chart-dialog.component';
import { createChartItem } from '../../sandbox/+state/sandbox.model.mock';

describe('Toolbar', () => {
  let spectator: Spectator<ToolbarComponent>;
  let component: ToolbarComponent;
  let store: Store;
  let sandboxFacade: SandboxFacade;
  let dialog: MatDialog;
  let toast: HotToastService;

  const mocks = {
    chartItems: [createChartItem()]
  };

  const createComponent = createComponentFactory({
    component: ToolbarComponent,
    providers: [
      {
        provide: Store,
        useValue: {
          dispatch: jest.fn()
        }
      },
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(() => ({
            afterClosed: () => of(true)
          }))
        }
      },
      {
        provide: SandboxFacade,
        useValue: {
          isPossibleToRemoveItem$: of(true),
          isPossibleToEnableConnectionMode$: of(true),
          isPortData$: of(true),
          isGraphCorrect$: of(true),
          chartItems$: of(mocks.chartItems)
        }
      },
      {
        provide: HotToastService,
        useValue: {
          show: jest.fn()
        }
      }
    ],
    declarations: [
      ...MockComponents(GraphIndicatorComponent, MatIcon, SvgIconComponent)
    ]
  });

  const selectors = {
    createNodeBtn: () =>
      spectator.query<HTMLButtonElement>('[data-test="create-node-btn"]'),
    removeBtn: () =>
      spectator.query<HTMLButtonElement>('[data-test="remove-btn"]'),
    connectNodesBtn: () =>
      spectator.query<HTMLButtonElement>('[data-test="connect-nodes-btn"]'),
    importBtn: () =>
      spectator.query<HTMLButtonElement>('[data-test="import-btn"]'),
    exportBtn: () =>
      spectator.query<HTMLButtonElement>('[data-test="export-btn"]'),
    infoBtn: () => spectator.query<HTMLButtonElement>('[data-test="info-btn"]'),
    chartBtn: () =>
      spectator.query<HTMLButtonElement>('[data-test="chart-btn"]')
  };

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(Store);
    sandboxFacade = spectator.inject(SandboxFacade);
    dialog = spectator.inject(MatDialog);
    toast = spectator.inject(HotToastService);
  });

  it('should match snapshot', () => {
    expect(spectator.fixture).toMatchSnapshot();
  });

  describe('create-node-btn', () => {
    it('on (click) should dispatch AddAoNButtonClicked action', () => {
      selectors.createNodeBtn().click();

      expect(store.dispatch).toHaveBeenCalledWith(
        ToolbarActions.addAoNButtonClicked()
      );
    });
  });

  describe('remove-btn', () => {
    it('on (click) should dispatch removeItemButtonClicked action', () => {
      selectors.removeBtn().click();

      expect(store.dispatch).toHaveBeenCalledWith(
        ToolbarActions.removeItemButtonClicked()
      );
    });

    describe('[disabled]', () => {
      it('should be set to true if there is no possible to remove item', () => {
        sandboxFacade.isPossibleToRemoveItem$ = of(false);
        spectator.detectComponentChanges();

        expect(selectors.removeBtn().disabled).toBeTruthy();
      });

      it('should be set to false if there is possible to remove item', () => {
        sandboxFacade.isPossibleToRemoveItem$ = of(true);
        spectator.detectComponentChanges();

        expect(selectors.removeBtn().disabled).toBeFalsy();
      });
    });
  });

  describe('connect-nodes-btn', () => {
    it('on (click) should dispatch connectNodesButtonClicked action', () => {
      selectors.connectNodesBtn().click();

      expect(store.dispatch).toHaveBeenCalledWith(
        ToolbarActions.connectNodesButtonClicked()
      );
    });

    describe('[disabled]', () => {
      it('should be set to true if there is no possible to enable connection mode', () => {
        sandboxFacade.isPossibleToEnableConnectionMode$ = of(false);
        spectator.detectComponentChanges();

        expect(selectors.connectNodesBtn().disabled).toBeTruthy();
      });

      it('should be set to false if there is possible to enable connectionMode', () => {
        sandboxFacade.isPossibleToEnableConnectionMode$ = of(true);
        spectator.detectComponentChanges();

        expect(selectors.connectNodesBtn().disabled).toBeFalsy();
      });
    });
  });

  describe('import-btn', () => {
    it('on (click) should open import dialog', () => {
      selectors.importBtn().click();

      expect(dialog.open).toHaveBeenCalledWith(ImportDialogComponent, {
        panelClass: 'dialog'
      });
    });
  });

  describe('export-btn', () => {
    it('on (click) should open export dialog', () => {
      selectors.exportBtn().click();

      expect(dialog.open).toHaveBeenCalledWith(ExportDialogComponent, {
        panelClass: 'dialog'
      });
    });

    describe('[disabled]', () => {
      it('should be set to true if there is no port data', () => {
        sandboxFacade.isPortData$ = of(false);
        spectator.detectComponentChanges();

        expect(selectors.exportBtn().disabled).toBeTruthy();
      });

      it('should be set to false if there is port data', () => {
        sandboxFacade.isPortData$ = of(true);
        spectator.detectComponentChanges();

        expect(selectors.exportBtn().disabled).toBeFalsy();
      });
    });
  });

  describe('info-btn', () => {
    it('on (click) should open toast', () => {
      selectors.infoBtn().click();

      expect(toast.show).toHaveBeenCalled();
    });
  });

  describe('chart-btn', () => {
    it('should be visible if graph is correct', () => {
      sandboxFacade.isGraphCorrect$ = of(true);
      spectator.detectComponentChanges();

      expect(selectors.chartBtn()).toBeTruthy();
    });

    it('should not be visible if graph is not correct', () => {
      sandboxFacade.isGraphCorrect$ = of(false);
      spectator.detectComponentChanges();

      expect(selectors.chartBtn()).toBeFalsy();
    });

    it('on (click) should open chart dialog', () => {
      sandboxFacade.isGraphCorrect$ = of(true);
      spectator.detectComponentChanges();

      selectors.chartBtn().click();

      expect(dialog.open).toHaveBeenCalledWith(ChartDialogComponent, {
        panelClass: 'dialog',
        width: '50%',
        height: '50%',
        data: {
          results: mocks.chartItems
        }
      });
    });
  });
});
