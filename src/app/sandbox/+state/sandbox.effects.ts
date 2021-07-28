import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Edge } from '@swimlane/ngx-graph';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { ToolbarActions } from 'src/app/toolbar/+state/toolbar.actions';
import { SandboxActions } from './sandbox.actions';
import { SandboxFacade } from './sandbox.facade';
import { EscapeEvent } from './sandbox.model';

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

  handleEscapeClick = createEffect(() => () =>
    this.actions.pipe(
      ofType(SandboxActions.escapeClicked),
      withLatestFrom(
        this.sandboxFacade.escapeEvent$,
        (_, escapeEvent: EscapeEvent) => escapeEvent
      ),
      filter(event => event !== EscapeEvent.empty),
      map(event => {
        if (event === EscapeEvent.connectionMode) {
          return SandboxActions.revertConnectionOperation();
        }
        if (event === EscapeEvent.editMode) {
          return SandboxActions.nodeEditExited();
        }
        if (event === EscapeEvent.nodeSelectionMode) {
          return SandboxActions.nodeSelectionExited();
        }
        if (event === EscapeEvent.linkSelectionMode) {
          return SandboxActions.linkSelectionExited();
        }
      })
    )
  );

  handleEnterClick = createEffect(() => () =>
    this.actions.pipe(
      ofType(SandboxActions.enterClicked),
      withLatestFrom(
        this.sandboxFacade.selectedNodeId$,
        (_, selectedNodeId: string | undefined) => selectedNodeId
      ),
      map(nodeId => SandboxActions.nodeEntered({ nodeId }))
    )
  );

  removeNode = createEffect(() => () =>
    this.actions.pipe(
      ofType(
        ToolbarActions.removeItemButtonClicked,
        SandboxActions.deleteClicked
      ),
      withLatestFrom(
        this.sandboxFacade.selectedNodeId$,
        this.sandboxFacade.isConnectionMode$,
        (_, selectedNodeId: string, isConnectionMode: boolean) => ({
          isConnectionMode,
          selectedNodeId
        })
      ),
      filter(
        ({ isConnectionMode, selectedNodeId }) =>
          !!selectedNodeId && !isConnectionMode
      ),
      map(({ selectedNodeId }) =>
        SandboxActions.nodeRemoved({ nodeId: selectedNodeId })
      )
    )
  );

  removeLink = createEffect(() => () =>
    this.actions.pipe(
      ofType(
        ToolbarActions.removeItemButtonClicked,
        SandboxActions.deleteClicked
      ),
      withLatestFrom(
        this.sandboxFacade.selectedLinkId$,
        this.sandboxFacade.isConnectionMode$,
        (_, selectedLinkId: string, isConnectionMode: boolean) => ({
          isConnectionMode,
          selectedLinkId
        })
      ),
      filter(
        ({ isConnectionMode, selectedLinkId }) =>
          !!selectedLinkId && !isConnectionMode
      ),
      map(({ selectedLinkId }) =>
        SandboxActions.linkRemoved({ linkId: selectedLinkId })
      )
    )
  );

  removeLinks = createEffect(() => () =>
    this.actions.pipe(
      ofType(SandboxActions.nodeRemoved),
      withLatestFrom(
        this.sandboxFacade.links$,
        ({ nodeId }, links: Edge[]) => ({ nodeId, links })
      ),
      map(({ nodeId, links }) =>
        links
          .filter(
            ({ source, target }) => source === nodeId || target === nodeId
          )
          .map(({ id }) => id)
      ),
      filter((linkIds: string[]) => !!linkIds.length),
      map((linkIds: string[]) => SandboxActions.linksRemoved({ linkIds }))
    )
  );
}
