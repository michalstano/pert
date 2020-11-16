import { createSelector, createFeatureSelector } from '@ngrx/store';
import { linksSelectors } from './links.reducer';
import { nodesSelectors } from './nodes.reducer';
import { SANDBOX_FEATURE_KEY, SandboxState } from './sandbox.reducer';

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

const selectLinks = createSelector(selectLinksState, linksSelectors.selectAll);

const selectConnection = createSelector(
  selectLinksState,
  linksSelectors.connection
);

export const SandboxSelectors = {
  selectNodes,
  selectSelectedNodeId,
  selectLinks,
  selectConnection
};
