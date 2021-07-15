import { createReducer, Action, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Edge } from '@swimlane/ngx-graph';
import { ToolbarActions } from '../../toolbar/+state/toolbar.actions';
import { SandboxActions } from './sandbox.actions';
import { ConnectionProcess } from './sandbox.model';

export const LINKS_FEATURE_KEY = 'links';

export const adapter: EntityAdapter<Edge> = createEntityAdapter<Edge>({
  selectId: (edge: Edge) => edge.id!
});

export interface LinksState extends EntityState<Edge> {
  connection: ConnectionProcess | null;
  selectedLinkId: string | null;
}

export const linksSelectors = {
  ...adapter.getSelectors(),
  connection: (state: LinksState) => state.connection,
  selectedLinkId: (state: LinksState) => state.selectedLinkId
};

export const linksInitialState: LinksState = adapter.getInitialState({
  connection: null,
  selectedLinkId: null
});

const reducer = createReducer(
  linksInitialState,
  on(ToolbarActions.connectNodesButtonClicked, (state: LinksState) => ({
    ...state,
    connection: {}
  })),
  on(SandboxActions.turnOffConnectionMode, (state: LinksState) => ({
    ...state,
    connection: null
  })),
  on(
    SandboxActions.selectFirstNodeToConnection,
    (state: LinksState, { nodeId }) => ({
      ...state,
      connection: { firstId: nodeId }
    })
  ),
  on(
    SandboxActions.makeConnectionBetweenTwoNodes,
    (state: LinksState, { connection }) => {
      const newLink = {
        id: connection.firstId + '-' + connection.secondId,
        source: connection.firstId,
        target: connection.secondId,
        label: 'test'
      } as Edge;
      return adapter.upsertOne(newLink, { ...state, connection: null });
    }
  ),
  on(SandboxActions.revertConnectionOperation, (state: LinksState) => {
    return { ...state, connection: null };
  }),
  on(ToolbarActions.importButtonClicked, (_, { result }) => {
    return adapter.addMany(result.links, linksInitialState);
  }),
  on(SandboxActions.nodeClicked, (state: LinksState) => ({
    ...state,
    selectedLinkId: null
  })),
  on(SandboxActions.linkClicked, (state: LinksState, { linkId }) => ({
    ...state,
    selectedLinkId: linkId
  })),
  on(SandboxActions.linkRemoved, (state: LinksState, { linkId }) => {
    return adapter.removeOne(linkId, {
      ...state,
      selectedLinkId: null
    });
  }),
  on(SandboxActions.linksRemoved, (state: LinksState, { linkIds }) => {
    return adapter.removeMany(linkIds, state);
  })
);

export function linksReducer(
  state: LinksState | undefined,
  action: Action
): LinksState {
  return reducer(state, action);
}
