import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Node, Edge } from '@swimlane/ngx-graph';
import { Observable } from 'rxjs';
import { ConnectionProcess } from './sandbox.model';
import { SandboxSelectors } from './sandbox.selectors';

@Injectable({
  providedIn: 'root'
})
export class SandboxFacade {
  constructor(private store: Store<any>) {}

  nodes$: Observable<Node[]> = this.store.select(SandboxSelectors.selectNodes);
  selectedNodeId$: Observable<string | null> = this.store.select(
    SandboxSelectors.selectSelectedNodeId
  );

  links$: Observable<Edge[]> = this.store.select(SandboxSelectors.selectLinks);
  connection$: Observable<ConnectionProcess | null> = this.store.select(
    SandboxSelectors.selectConnection
  );
}
