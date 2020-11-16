import { ActionReducerMap } from '@ngrx/store';
import { NodesState, nodesReducer, NODES_FEATURE_KEY } from './nodes.reducer';
import { LinksState, linksReducer, LINKS_FEATURE_KEY } from './links.reducer';

export const SANDBOX_FEATURE_KEY = 'sandbox';

export interface SandboxState {
  [NODES_FEATURE_KEY]: NodesState;
  [LINKS_FEATURE_KEY]: LinksState;
}

export const sandboxReducers: ActionReducerMap<SandboxState> = {
  [NODES_FEATURE_KEY]: nodesReducer,
  [LINKS_FEATURE_KEY]: linksReducer
};
