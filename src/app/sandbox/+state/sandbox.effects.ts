import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { SandboxActions } from './sandbox.actions';
import { SandboxFacade } from './sandbox.facade';

@Injectable()
export class SandboxEffects {
  constructor(private actions: Actions, private sandboxFacade: SandboxFacade) {}

  handleClickOnNode = createEffect(() => () =>
    this.actions.pipe(
      ofType(SandboxActions.nodeClicked),
      withLatestFrom(this.sandboxFacade.connection$),
      map(([{ nodeId }, connection]) => {
        if (connection?.firstId) {
          return SandboxActions.makeConnectionBetweenTwoNodes({
            connection: {
              firstId: connection!.firstId,
              secondId: nodeId
            }
          });
        }
        if (!!connection) {
          return SandboxActions.selectFirstNodeToConnection({ nodeId });
        }
        return SandboxActions.nodeSelected({ nodeId });
      })
    )
  );
}
