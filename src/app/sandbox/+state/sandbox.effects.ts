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
      withLatestFrom(
        this.sandboxFacade.connection$,
        this.sandboxFacade.selectedNodeId$,
        ({ nodeId }, connection, selectedNodeId) => ({
          nodeId,
          connection,
          isSelected: selectedNodeId === nodeId
        })
      ),
      filter(({ connection, isSelected }) => !!connection || !isSelected),
      map(({ nodeId, connection, isSelected }) => {
        const isAbleToMakeConnection =
          connection?.firstId && connection?.firstId !== nodeId;
        if (isAbleToMakeConnection) {
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

        if (!isSelected) {
          return SandboxActions.nodeSelected({ nodeId });
        }
      })
    )
  );

  handleDoubleClickOnNode = createEffect(() => () =>
    this.actions.pipe(
      ofType(SandboxActions.nodeDoubleClicked),
      withLatestFrom(
        this.sandboxFacade.isConnectionMode$,
        ({ nodeId }, isConnectionMode) => ({ nodeId, isConnectionMode })
      ),
      filter(({ isConnectionMode }) => !isConnectionMode),
      map(({ nodeId }) => SandboxActions.nodeEntered({ nodeId }))
    )
  );
}
