import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { ToolbarActions } from './toolbar.actions';
import { SandboxFacade } from '../../sandbox/+state/sandbox.facade';
import { PortData } from '../../sandbox/+state/sandbox.model';

@Injectable()
export class ToolbarEffects {
  constructor(private actions: Actions, private sandboxFacade: SandboxFacade) {}

  saveGraphToFile = createEffect(
    () => () =>
      this.actions.pipe(
        ofType(ToolbarActions.exportButtonClicked),
        map(({ fileName }) => fileName),
        withLatestFrom(
          this.sandboxFacade.portData$,
          (fileName, exportData: PortData) => ({ fileName, exportData })
        ),
        map(({ fileName, exportData }) => ({
          blob: new Blob([JSON.stringify(exportData)], {
            type: 'application/json;charset=utf-8'
          }),
          fileName
        })),
        tap(({ blob, fileName }) => saveAs(blob, fileName + '.json'))
      ),
    { dispatch: false }
  );
}
