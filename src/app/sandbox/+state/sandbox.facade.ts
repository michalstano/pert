import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Node, Edge } from '@swimlane/ngx-graph';
import { Observable } from 'rxjs';
import {
  ChartItem,
  ConnectionProcess,
  EscapeEvent,
  PortData
} from './sandbox.model';
import { SandboxSelectors } from './sandbox.selectors';

@Injectable({
  providedIn: 'root'
})
export class SandboxFacade {
  nodes$: Observable<Node[]> = this.store.select(SandboxSelectors.selectNodes);
  chartItems$: Observable<ChartItem[]> = this.store.select(
    SandboxSelectors.selectChartItems
  );
  selectedNodeId$: Observable<string | null> = this.store.select(
    SandboxSelectors.selectSelectedNodeId
  );
  editedNodeId$: Observable<string | null> = this.store.select(
    SandboxSelectors.selectEditedNodeId
  );
  isEditMode$: Observable<boolean> = this.store.select(
    SandboxSelectors.selectIsEditMode
  );

  links$: Observable<Edge[]> = this.store.select(SandboxSelectors.selectLinks);
  connection$: Observable<ConnectionProcess | null> = this.store.select(
    SandboxSelectors.selectConnection
  );
  isConnectionMode$: Observable<boolean> = this.store.select(
    SandboxSelectors.selectIsConnectionMode
  );
  selectedLinkId$: Observable<string | null> = this.store.select(
    SandboxSelectors.selectSelectedLinkId
  );

  escapeEvent$: Observable<EscapeEvent> = this.store.select(
    SandboxSelectors.selectEscapeEvent
  );
  portData$: Observable<PortData> = this.store.select(
    SandboxSelectors.selectNodesAndLinks
  );
  isPortData$: Observable<boolean> = this.store.select(
    SandboxSelectors.selectAreNodesAndLinks
  );
  isGraphCorrect$: Observable<boolean | undefined> = this.store.select(
    SandboxSelectors.selectIsGraphCorrect
  );
  isPossibleToRemoveItem$: Observable<boolean> = this.store.select(
    SandboxSelectors.selectIsPossibleToRemoveItem
  );
  isPossibleToEnableConnectionMode$: Observable<boolean> = this.store.select(
    SandboxSelectors.selectIsPossibleEnableConnectionMode
  );

  constructor(private store: Store) {}

  getNodeById = (nodeId: string): Observable<Node | null> => {
    return this.store.select(SandboxSelectors.selectNodeById({ id: nodeId }));
  };

  getIsConnectingById = (nodeId: string): Observable<boolean> => {
    return this.store.select(
      SandboxSelectors.selectIsConnectingById({ id: nodeId })
    );
  };

  getIsNodeInCriticalPath = (nodeId: string): Observable<boolean> => {
    return this.store.select(
      SandboxSelectors.selectIsNodeInCriticalPath({ id: nodeId })
    );
  };
}
