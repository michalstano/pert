import { createAction, props } from '@ngrx/store';
import { Node } from '@swimlane/ngx-graph';
import { ConnectionProcess } from './sandbox.model';

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

const nodeEntered = createAction(
  '[Sandbox] Node entered',
  props<{ nodeId: string }>()
);

const nodeChanged = createAction(
  '[Sandbox] Node position changed',
  props<{ node: Node }>()
);

const nodeEditExited = createAction('[Sandbox] Node Edit exited');

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

export const SandboxActions = {
  nodeClicked,
  nodeDoubleClicked,
  nodeSelected,
  nodeEntered,
  nodeChanged,
  nodeEditExited,
  revertConnectionOperation,
  selectFirstNodeToConnection,
  makeConnectionBetweenTwoNodes,
  turnOnConnectionMode,
  turnOffConnectionMode
};
