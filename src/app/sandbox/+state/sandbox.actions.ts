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

const escapeClicked = createAction('[Sandobox] Escape clicked');

export const SandboxActions = {
  nodeClicked,
  nodeDoubleClicked,
  nodeSelected,
  nodeSelectionExited,
  nodeEntered,
  nodePositionChanged,
  nodeEditExited,
  nodeValueChanged,
  revertConnectionOperation,
  selectFirstNodeToConnection,
  makeConnectionBetweenTwoNodes,
  turnOnConnectionMode,
  turnOffConnectionMode,
  escapeClicked
};
