import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MiniMapPosition, Node, Edge } from '@swimlane/ngx-graph';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { isEqual, cloneDeep } from 'lodash';
import { SandboxActions } from '../+state/sandbox.actions';
import { AoNData } from '../+state/sandbox.model';
import { SandboxFacade } from '../+state/sandbox.facade';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-sandbox-page',
  template: `
    <ngx-graph
      class="chart-container"
      [showMiniMap]="true"
      [miniMapPosition]="MiniMapPosition.UpperRight"
      [curve]="shape.curveLinear"
      [nodes]="(nodes$ | async)!"
      [links]="(links$ | async)!"
    >
      <ng-template #nodeTemplate let-node>
        <svg:g
          class="node"
          width="122"
          height="80"
          (click)="selectNode(node.id)"
        >
          <svg:foreignObject width="122" height="80">
            <xhtml:div
              aon-block
              [aonData]="aonDataMock"
              [isSelected]="(sandboxFacade.selectedNodeId$ | async) === node.id"
            ></xhtml:div>
          </svg:foreignObject>
        </svg:g>
      </ng-template>
    </ngx-graph>
  `,
  styleUrls: ['./sandbox-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SandboxPageComponent implements OnInit {
  MiniMapPosition = MiniMapPosition;
  shape = shape;
  aonDataMock = {
    earliestStart: 10,
    duration: 20,
    earliestFinish: 30,
    name: 'name',
    latestStart: 40,
    float: 0,
    latestFinish: 50
  } as AoNData;

  nodes$: Observable<Node[]>;
  links$: Observable<Edge[]>;
  constructor(public sandboxFacade: SandboxFacade, private store: Store<any>) {}

  ngOnInit(): void {
    this.nodes$ = this.sandboxFacade.nodes$.pipe(
      distinctUntilChanged(isEqual),
      map(nodes => cloneDeep(nodes))
    );
    this.links$ = this.sandboxFacade.links$.pipe(
      distinctUntilChanged(isEqual),
      map(links => cloneDeep(links))
    );
  }

  selectNode(nodeId: string): void {
    this.store.dispatch(SandboxActions.nodeSelected({ nodeId }));
  }
}
