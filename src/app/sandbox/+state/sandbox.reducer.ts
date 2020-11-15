import { createReducer, Action, on } from '@ngrx/store';
import { Node, Edge } from '@swimlane/ngx-graph';
import { SandboxActions } from './sandbox.actions';

const mocks = {
  nodes: [
    {
      id: 'first',
      label: 'A'
    },
    {
      id: 'second',
      label: 'B'
    },
    {
      id: 'third',
      label: 'C'
    },
    {
      id: 'monkaS',
      label: 'LUL'
    }
  ],
  links: [
    {
      id: 'a',
      source: 'first',
      target: 'second',
      label: 'is parent of'
    },
    {
      id: 'b',
      source: 'first',
      target: 'third',
      label: 'custom label'
    }
  ]
};

export const SANDBOX_FEATURE_KEY = 'sandbox';

export interface SandboxState {
  nodes: Node[];
  selectedNodeId: string | null;
  links: Edge[];
}

export const sandboxInitialState: SandboxState = {
  nodes: mocks.nodes,
  selectedNodeId: null,
  links: mocks.links
};

export const sandboxSelectors = {
  nodes: (state: SandboxState) => state.nodes,
  selectedNodeId: (state: SandboxState) => state.selectedNodeId,
  links: (state: SandboxState) => state.links
};

const reducer = createReducer(
  sandboxInitialState,
  on(SandboxActions.nodeSelected, (state: SandboxState, { nodeId }) => ({
    ...state,
    selectedNodeId: nodeId
  }))
);

export function sandboxReducer(
  state: SandboxState | undefined,
  action: Action
): SandboxState {
  return reducer(state, action);
}
