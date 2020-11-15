import { createAction, props } from '@ngrx/store';

const nodeSelected = createAction(
  '[Sandbox] Node selected',
  props<{ nodeId: string }>()
);

export const SandboxActions = {
  nodeSelected
};
