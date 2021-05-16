import { Dictionary } from '@ngrx/entity';
import { Node } from '@swimlane/ngx-graph';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { linksSelectors } from './links.reducer';
import { nodesSelectors } from './nodes.reducer';
import { SANDBOX_FEATURE_KEY, SandboxState } from './sandbox.reducer';
import { ConnectionProcess } from './sandbox.model';

const selectSandboxState = createFeatureSelector<SandboxState>(
  SANDBOX_FEATURE_KEY
);

const selectNodesState = createSelector(
  selectSandboxState,
  (state: SandboxState) => state.nodes
);

const selectLinksState = createSelector(
  selectSandboxState,
  (state: SandboxState) => state.links
);

const selectSelectedNodeId = createSelector(
  selectNodesState,
  nodesSelectors.selectedNodeId
);

const selectNodes = createSelector(selectNodesState, nodesSelectors.selectAll);

const selectNodeEntities = createSelector(
  selectNodesState,
  nodesSelectors.selectEntities
);

const selectNodeById = ({ id }: { id: string }) =>
  createSelector(
    selectNodeEntities,
    (entities: Dictionary<Node>) => entities[id] || null
  );

const selectLinks = createSelector(selectLinksState, linksSelectors.selectAll);

const selectConnection = createSelector(
  selectLinksState,
  linksSelectors.connection
);

const selectIsConnectingById = ({ id }: { id: string }) =>
  createSelector(
    selectConnection,
    (connection: ConnectionProcess | null) => connection?.firstId === id
  );

export const SandboxSelectors = {
  selectNodes,
  selectSelectedNodeId,
  selectLinks,
  selectConnection,
  selectNodeById,
  selectIsConnectingById
};
