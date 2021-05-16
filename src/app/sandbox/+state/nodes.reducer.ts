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
}

export const nodesSelectors = {
  ...adapter.getSelectors(),
  selectedNodeId: (state: NodesState) => state.selectedNodeId
};

export const nodesInitialState: NodesState = adapter.getInitialState({
  selectedNodeId: null
});

const reducer = createReducer(
  nodesInitialState,
  on(SandboxActions.nodeSelected, (state: NodesState, { nodeId }) => ({
    ...state,
    selectedNodeId: nodeId
  })),
  on(ToolbarActions.addAoNButtonClicked, (state: NodesState) => {
    const newNode = {
      id: nanoid(),
      label: 'NEW',
      data: {}
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
  on(SandboxActions.nodeChanged, (state: NodesState, { node }) =>
    adapter.updateOne(
      {
        id: node.id,
        changes: {
          data: {
            position: node.position
          }
        }
      },
      state
    )
  )
);

export function nodesReducer(
  state: NodesState | undefined,
  action: Action
): NodesState {
  return reducer(state, action);
}
