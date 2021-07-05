import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Node } from '@swimlane/ngx-graph';
import { SandboxActions } from './sandbox.actions';
import { ToolbarActions } from '../../toolbar/+state/toolbar.actions';
import { nanoid } from '../../shared/utils/id-generator';

export const NODES_FEATURE_KEY = 'nodes';

export const adapter: EntityAdapter<Node> = createEntityAdapter<Node>({
  selectId: (node: Node) => node.id
});

export interface NodesState extends EntityState<Node> {
  selectedNodeId: string | null;
  editedNodeId: string | null;
}

export const nodesSelectors = {
  ...adapter.getSelectors(),
  selectedNodeId: (state: NodesState) => state.selectedNodeId,
  editedNodeId: (state: NodesState) => state.editedNodeId
};

export const nodesInitialState: NodesState = adapter.getInitialState({
  selectedNodeId: null,
  editedNodeId: null
});

const reducer = createReducer(
  nodesInitialState,
  on(SandboxActions.nodeSelected, (state: NodesState, { nodeId }) => ({
    ...state,
    selectedNodeId: nodeId
  })),
  on(SandboxActions.nodeSelectionExited, (state: NodesState) => ({
    ...state,
    selectedNodeId: null
  })),
  on(SandboxActions.nodeEntered, (state: NodesState, { nodeId }) => ({
    ...state,
    editedNodeId: nodeId
  })),
  on(SandboxActions.nodeEditExited, (state: NodesState) => ({
    ...state,
    editedNodeId: null
  })),
  on(ToolbarActions.addAoNButtonClicked, (state: NodesState) => {
    const newNode = {
      id: nanoid(),
      label: 'NEW'
    } as Node;
    return adapter.addOne(newNode, {
      ...state,
      selectedNodeId: newNode.id || null
    });
  }),
  on(ToolbarActions.connectNodesButtonClicked, (state: NodesState) => {
    return {
      ...state,
      selectedNodeId: null
    };
  }),
  on(SandboxActions.nodePositionChanged, (state: NodesState, { node }) => {
    const entity = state.entities[node.id];
    return adapter.updateOne(
      {
        id: node.id,
        changes: {
          data: {
            ...entity.data,
            position: node.position
          }
        }
      },
      state
    );
  }),
  on(
    SandboxActions.nodeValueChanged,
    (state: NodesState, { nodeId, aonData }) => {
      const entity = state.entities[nodeId];
      return adapter.updateOne(
        {
          id: nodeId,
          changes: {
            data: {
              ...entity.data,
              aonData
            }
          }
        },
        state
      );
    }
  )
);

export function nodesReducer(
  state: NodesState | undefined,
  action: Action
): NodesState {
  return reducer(state, action);
}
