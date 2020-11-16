import { createAction, props } from '@ngrx/store';
import { ConnectionProcess } from './sandbox.model';

const nodeClicked = createAction(
  '[Sandbox] Node clicked',
  props<{ nodeId: string }>()
);

const nodeSelected = createAction(
  '[Sandbox] Node selected',
  props<{ nodeId: string }>()
);

const revertConnectionOperation = createAction(
  '[Toolbar] Revert connection operation'
);

const selectFirstNodeToConnection = createAction(
  '[Toolbar] Select node to connection',
  props<{ nodeId: string }>()
);

const makeConnectionBetweenTwoNodes = createAction(
  '[Toolbar] Make connection between two nodes',
  props<{ connection: ConnectionProcess }>()
);

export const SandboxActions = {
  nodeClicked,
  nodeSelected,
  revertConnectionOperation,
  selectFirstNodeToConnection,
  makeConnectionBetweenTwoNodes
};
