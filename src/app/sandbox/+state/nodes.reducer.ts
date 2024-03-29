import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Node } from '@swimlane/ngx-graph';
import { SandboxActions } from './sandbox.actions';
import { ToolbarActions } from '../../toolbar/+state/toolbar.actions';
import { nanoid } from '../../shared/utils/id-generator';
import { AoNData } from './sandbox.model';

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
  selectedNodeId: (state: NodesState): string | null => state.selectedNodeId,
  editedNodeId: (state: NodesState): string | null => state.editedNodeId
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
  on(
    SandboxActions.nodeSelectionExited,
    SandboxActions.linkClicked,
    (state: NodesState) => ({
      ...state,
      selectedNodeId: null
    })
  ),
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
      label: 'NEW',
      data: {
        aonData: {
          earliestStart: undefined,
          duration: undefined,
          earliestFinish: undefined,
          name: undefined,
          latestStart: undefined,
          float: undefined,
          latestFinish: undefined
        } as AoNData
      }
    } as Node;
    return adapter.addOne(newNode, {
      ...state,
      selectedNodeId: newNode.id || null
    });
  }),
  on(SandboxActions.nodeRemoved, (state: NodesState, { nodeId }) => {
    return adapter.removeOne(nodeId, {
      ...state,
      selectedNodeId: null,
      editedNodeId: null
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
    (state: NodesState, { nodeId, aonData, isValid }) => {
      const entity = state.entities[nodeId];
      return adapter.updateOne(
        {
          id: nodeId,
          changes: {
            data: {
              ...entity.data,
              aonData,
              isValid
            }
          }
        },
        state
      );
    }
  ),
  on(ToolbarActions.importButtonClicked, (_, { result }) => {
    return adapter.addMany(result.nodes, nodesInitialState);
  })
);

export function nodesReducer(
  state: NodesState | undefined,
  action: Action
): NodesState {
  return reducer(state, action);
}
