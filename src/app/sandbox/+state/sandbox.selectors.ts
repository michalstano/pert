import { Dictionary } from '@ngrx/entity';
import { Edge, Node } from '@swimlane/ngx-graph';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { linksSelectors } from './links.reducer';
import { nodesSelectors } from './nodes.reducer';
import { SANDBOX_FEATURE_KEY, SandboxState } from './sandbox.reducer';
import { ConnectionProcess, EscapeEvent, PortData } from './sandbox.model';
import { getIsGraphCorrect } from './graph-correctness';

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

const selectSelectedLinkId = createSelector(
  selectLinksState,
  linksSelectors.selectedLinkId
);

/* others */

const selectEscapeEvent = createSelector(
  selectIsConnectionMode,
  selectIsEditMode,
  selectSelectedNodeId,
  selectSelectedLinkId,
  (
    isConnectionMode: boolean,
    isEditMode: boolean,
    selectedNodeId: string | null,
    selectedLinkId: string | null
  ) => {
    if (isConnectionMode) {
      return EscapeEvent.connectionMode;
    }
    if (isEditMode) {
      return EscapeEvent.editMode;
    }
    if (!!selectedNodeId) {
      return EscapeEvent.nodeSelectionMode;
    }
    if (!!selectedLinkId) {
      return EscapeEvent.linkSelectionMode;
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

const selectIsPossibleToRemoveItem = createSelector(
  selectIsConnectionMode,
  selectSelectedNodeId,
  selectIsEditMode,
  (
    isConnectionMode: boolean,
    selectedNodeId: string | null,
    isEditMode: boolean
  ) => !isConnectionMode && !!selectedNodeId && !isEditMode
);

const selectIsPossibleEnableConnectionMode = createSelector(
  selectIsEditMode,
  selectNodes,
  (isEditMode: boolean, nodes: Node[]) => !isEditMode && nodes.length > 1
);

const selectIsNodeInCriticalPath = ({ id }: { id: string }) =>
  createSelector(
    selectNodeById({ id }),
    selectNodeEntities,
    selectSelectedNodeId,
    selectLinks,
    (
      node: Node,
      nodeEntities: Dictionary<Node>,
      selectedNodeId: string | null,
      links: Edge[]
    ) => {
      const isInCriticalPath = ({ data }: Node): boolean =>
        data.isValid && +data.aonData.float === 0;

      const isNodeSelected: boolean = selectedNodeId === node.id;
      const previousNodes: Node[] = links
        .filter(({ target }) => target === node.id)
        .map(({ source }) => nodeEntities[source]);

      const isNodeConnected: boolean = links.some(
        ({ source, target }) => node.id === target || node.id === source
      );
      const isPreviousNodeInCriticalPath: boolean = !!previousNodes.length
        ? previousNodes.some(previousNode => {
            isInCriticalPath(previousNode);
          })
        : isNodeConnected;

      return (
        !isNodeSelected &&
        isInCriticalPath(node) &&
        isPreviousNodeInCriticalPath
      );
    }
  );

/* graph correctness */

const selectIsGraphCorrect = createSelector(
  selectAreNodesAndLinks,
  selectNodes,
  selectNodeEntities,
  selectLinks,
  getIsGraphCorrect
);

export const SandboxSelectors = {
  selectNodes,
  selectSelectedNodeId,
  selectEditedNodeId,
  selectIsEditMode,
  selectLinks,
  selectConnection,
  selectIsConnectionMode,
  selectSelectedLinkId,
  selectNodeById,
  selectIsConnectingById,
  selectEscapeEvent,
  selectNodesAndLinks,
  selectAreNodesAndLinks,
  selectIsNodeInCriticalPath,
  selectIsGraphCorrect,
  selectIsPossibleToRemoveItem,
  selectIsPossibleEnableConnectionMode
};
