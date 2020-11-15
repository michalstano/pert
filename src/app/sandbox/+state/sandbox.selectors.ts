import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SANDBOX_FEATURE_KEY, SandboxState } from './sandbox.reducer';

const selectSandboxState = createFeatureSelector<SandboxState>(
  SANDBOX_FEATURE_KEY
);

const selectNodes = createSelector(
  selectSandboxState,
  (state: SandboxState) => state.nodes
);

const selectSelectedNodeId = createSelector(
  selectSandboxState,
  (state: SandboxState) => state.selectedNodeId
);

const selectLinks = createSelector(
  selectSandboxState,
  (state: SandboxState) => state.links
);

export const SandboxSelectors = {
  selectNodes,
  selectSelectedNodeId,
  selectLinks
};
