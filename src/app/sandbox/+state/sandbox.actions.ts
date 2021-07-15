import { createAction, props } from '@ngrx/store';
import { Node } from '@swimlane/ngx-graph';
import { AoNData, ConnectionProcess } from './sandbox.model';

const nodeClicked = createAction(
  '[Sandbox] Node clicked',
  props<{ nodeId: string }>()
);

const nodeDoubleClicked = createAction(
  '[Sandbox] Node double clicked',
  props<{ nodeId: string }>()
);

const nodeSelected = createAction(
  '[Sandbox] Node selected',
  props<{ nodeId: string }>()
);

const nodeSelectionExited = createAction('[Sandbox] Node selection exited');

const nodeEntered = createAction(
  '[Sandbox] Node entered',
  props<{ nodeId: string }>()
);

const nodePositionChanged = createAction(
  '[Sandbox] Node position changed',
  props<{ node: Node }>()
);

const nodeEditExited = createAction('[Sandbox] Node Edit exited');

const nodeValueChanged = createAction(
  '[Sandbox] Node value changed',
  props<{ nodeId: string; aonData: AoNData }>()
);

const nodeRemoved = createAction(
  '[Sandbox] Node removed',
  props<{ nodeId: string }>()
);

const turnOnConnectionMode = createAction('[Sandbox] Turn on connection mode');

const turnOffConnectionMode = createAction(
  '[Sandbox] Turn off connection mode'
);

const revertConnectionOperation = createAction(
  '[Sandbox] Revert connection operation'
);

const selectFirstNodeToConnection = createAction(
  '[Sandbox] Select node to connection',
  props<{ nodeId: string }>()
);

const makeConnectionBetweenTwoNodes = createAction(
  '[Sandbox] Make connection between two nodes',
  props<{ connection: ConnectionProcess }>()
);

const linkClicked = createAction(
  '[Sandbox] Link clicked',
  props<{ linkId: string }>()
);

const linkRemoved = createAction(
  '[Sandobx] Link removed',
  props<{ linkId: string }>()
);

const linksRemoved = createAction(
  '[Sandobx] Links removed',
  props<{ linkIds: string[] }>()
);

const escapeClicked = createAction('[Sandobox] Escape clicked');

const deleteClicked = createAction('[Sandbox] Delete clicked');

export const SandboxActions = {
  nodeClicked,
  nodeDoubleClicked,
  nodeSelected,
  nodeSelectionExited,
  nodeEntered,
  nodePositionChanged,
  nodeEditExited,
  nodeValueChanged,
  nodeRemoved,
  revertConnectionOperation,
  selectFirstNodeToConnection,
  makeConnectionBetweenTwoNodes,
  turnOnConnectionMode,
  turnOffConnectionMode,
  escapeClicked,
  linkClicked,
  linkRemoved,
  linksRemoved,
  deleteClicked
};
