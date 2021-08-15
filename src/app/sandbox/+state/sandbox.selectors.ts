import { Dictionary } from '@ngrx/entity';
import { Edge, Node } from '@swimlane/ngx-graph';
import { difference, sortBy } from 'lodash';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { linksSelectors } from './links.reducer';
import { nodesSelectors } from './nodes.reducer';
import { SANDBOX_FEATURE_KEY, SandboxState } from './sandbox.reducer';
import {
  AoNData,
  ChartItem,
  ConnectionProcess,
  EscapeEvent,
  PortData
} from './sandbox.model';
import { getAreSourceNodesCorrect } from './graph-correctness';

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

const selectChartItems = createSelector(selectNodes, (nodes: Node[]) =>
  sortBy(nodes, [
    'data.aonData.earliestStart',
    'data.aonData.latestFinish'
  ]).map(({ data }) => {
    const { name, earliestStart, float, duration }: AoNData = data.aonData;
    return {
      name,
      series: [
        {
          name: 'Transparent',
          value: earliestStart
        },
        {
          name: 'Float',
          value: duration
        },
        {
          name: 'Extra time',
          value: float
        }
      ]
    } as ChartItem;
  })
);

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
    if (selectedNodeId) {
      return EscapeEvent.nodeSelectionMode;
    }
    if (selectedLinkId) {
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
  selectSelectedLinkId,
  selectIsEditMode,
  (
    isConnectionMode: boolean,
    selectedNodeId: string | null,
    selectedLinkId: string | null,
    isEditMode: boolean
  ) =>
    !isConnectionMode && !isEditMode && (!!selectedNodeId || !!selectedLinkId)
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
        data.isValid && data.aonData.float === 0;

      const isNodeSelected: boolean = selectedNodeId === node.id;
      const previousNodes: Node[] = links
        .filter(({ target }) => target === node.id)
        .map(({ source }) => nodeEntities[source]);

      const isNodeConnected: boolean = links.some(
        ({ source, target }) => node.id === target || node.id === source
      );
      const isPreviousNodeInCriticalPath: boolean = previousNodes.length
        ? previousNodes.some(previousNode => isInCriticalPath(previousNode))
        : isNodeConnected;

      return (
        !isNodeSelected &&
        isInCriticalPath(node) &&
        isPreviousNodeInCriticalPath
      );
    }
  );

/* graph correctness */

const selectConnectedNodes = createSelector(
  selectNodeEntities,
  selectLinks,
  (nodesEntities: Dictionary<Node>, links: Edge[]) => {
    const connectedNodeIdsSet = new Set<Node>();

    links.forEach(({ source, target }) => {
      const sourceNode = nodesEntities[source];
      const targetNode = nodesEntities[target];

      if (sourceNode && targetNode) {
        connectedNodeIdsSet.add(sourceNode);
        connectedNodeIdsSet.add(targetNode);
      }
    });

    const connectedNodeIds: Node[] = Array.from(connectedNodeIdsSet);

    return connectedNodeIds;
  }
);

const selectAreAllNodesConnected = createSelector(
  selectNodes,
  selectConnectedNodes,
  (nodes: Node[], connectedNodes: Node[]) => {
    const connectedNodeIds: string[] = connectedNodes.map(({ id }) => id);
    const nodesIds: string[] = nodes.map(({ id }) => id);

    const areAllNodesConnected = !difference(nodesIds, connectedNodeIds).length;

    return areAllNodesConnected;
  }
);

const selectAreAllConnectedNodesValid = createSelector(
  selectConnectedNodes,
  (connectedNodes: Node[]) => connectedNodes.every(node => node.data.isValid)
);

const selectAreConnectedNodesCorrect = createSelector(
  selectConnectedNodes,
  selectNodeEntities,
  selectLinks,
  (connectedNodes: Node[], nodesEntities: Dictionary<Node>, links: Edge[]) => {
    const areNodesCorrect = connectedNodes.every(currentNode => {
      return getAreSourceNodesCorrect(links, nodesEntities, currentNode);
    });

    return areNodesCorrect;
  }
);

const selectIsOnlyOneLastNode = createSelector(
  selectConnectedNodes,
  selectLinks,
  (connectedNodes: Node[], links: Edge[]) => {
    const lastNodes = connectedNodes.filter(node =>
      links.every(({ source }) => source !== node.id)
    );

    if (lastNodes.length === 1) {
      return lastNodes[0].data?.aonData?.float === 0;
    }

    return false;
  }
);

const selectIsGraphCorrect = createSelector(
  selectAreNodesAndLinks,
  selectAreAllNodesConnected,
  selectAreAllConnectedNodesValid,
  selectIsOnlyOneLastNode,
  selectAreConnectedNodesCorrect,
  (
    areNodesAndLinks: boolean,
    areAllNodesConnected: boolean,
    areAllConnectedNodesValid: boolean,
    isOnlyOneLastNode: boolean,
    areConnectedNodesCorrect: boolean
  ) => {
    const rules: boolean[] = [
      areAllNodesConnected,
      areAllConnectedNodesValid,
      isOnlyOneLastNode,
      areConnectedNodesCorrect
    ];

    const result = rules.every(r => !!r);

    return areNodesAndLinks ? result : undefined;
  }
);

export const SandboxSelectors = {
  selectNodes,
  selectChartItems,
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
