import { Dictionary } from '@ngrx/entity';
import { Edge, Node } from '@swimlane/ngx-graph';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { linksSelectors } from './links.reducer';
import { nodesSelectors } from './nodes.reducer';
import { SANDBOX_FEATURE_KEY, SandboxState } from './sandbox.reducer';
import { ConnectionProcess, EscapeEvent, PortData } from './sandbox.model';

const selectSandboxState = createFeatureSelector<SandboxState>(
  SANDBOX_FEATURE_KEY
);

/* states */

const selectNodesState = createSelector(
  selectSandboxState,
  (state: SandboxState) => state.nodes
);

const selectLinksState = createSelector(
  selectSandboxState,
  (state: SandboxState) => state.links
);

/* nodes */

const selectNodes = createSelector(selectNodesState, nodesSelectors.selectAll);

const selectSelectedNodeId = createSelector(
  selectNodesState,
  nodesSelectors.selectedNodeId
);

const selectEditedNodeId = createSelector(
  selectNodesState,
  nodesSelectors.editedNodeId
);

const selectNodeEntities = createSelector(
  selectNodesState,
  nodesSelectors.selectEntities
);

const selectNodeById = ({ id }: { id: string }) =>
  createSelector(
    selectNodeEntities,
    (entities: Dictionary<Node>) => entities[id] || null
  );

const selectIsEditMode = createSelector(
  selectEditedNodeId,
  (nodeId: string) => !!nodeId
);

/* links */

const selectLinks = createSelector(selectLinksState, linksSelectors.selectAll);

const selectConnection = createSelector(
  selectLinksState,
  linksSelectors.connection
);

const selectIsConnectionMode = createSelector(
  selectConnection,
  (connection: ConnectionProcess) => !!connection
);

const selectIsConnectingById = ({ id }: { id: string }) =>
  createSelector(
    selectConnection,
    (connection: ConnectionProcess | null) => connection?.firstId === id
  );

/* others */

const selectEscapeEvent = createSelector(
  selectIsConnectionMode,
  selectIsEditMode,
  selectSelectedNodeId,
  (
    isConnectionMode: boolean,
    isEditMode: boolean,
    selectedNodeId: string | null
  ) => {
    if (isConnectionMode) {
      return EscapeEvent.connectionMode;
    }
    if (isEditMode) {
      return EscapeEvent.editMode;
    }
    if (!!selectedNodeId) {
      return EscapeEvent.selectionMode;
    }
    return EscapeEvent.empty;
  }
);

const selectNodesAndLinks = createSelector(
  selectNodes,
  selectLinks,
  (nodes: Node[], links: Edge[]) =>
    ({
      nodes,
      links
    } as PortData)
);

const selectAreNodesAndLinks = createSelector(
  selectNodesAndLinks,
  ({ nodes, links }: PortData) => !!nodes.length || !!links.length
);

const selectIsGraphCorrect = createSelector(selectLinks, (links: Edge[]) =>
  !!links.length ? false : undefined
);

const selectIsPossibleToRemoveNode = createSelector(
  selectIsConnectionMode,
  selectNodes,
  (isConnectionMode: boolean, nodes: Node[]) =>
    !isConnectionMode && !!nodes.length
);

export const SandboxSelectors = {
  selectNodes,
  selectSelectedNodeId,
  selectEditedNodeId,
  selectIsEditMode,
  selectLinks,
  selectConnection,
  selectIsConnectionMode,
  selectNodeById,
  selectIsConnectingById,
  selectEscapeEvent,
  selectNodesAndLinks,
  selectAreNodesAndLinks,
  selectIsGraphCorrect,
  selectIsPossibleToRemoveNode
};
