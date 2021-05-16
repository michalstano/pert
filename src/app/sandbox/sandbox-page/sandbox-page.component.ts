import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  HostListener
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  MiniMapPosition,
  Node,
  Edge,
  NodePosition,
  Layout
} from '@swimlane/ngx-graph';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { isEqual, cloneDeep } from 'lodash';
import * as shape from 'd3-shape';
import { SandboxActions } from '../+state/sandbox.actions';
import { AoNData } from '../+state/sandbox.model';
import { SandboxFacade } from '../+state/sandbox.facade';
import { GraphLayout } from './graphLayout';

@Component({
  selector: 'app-sandbox-page',
  template: `
    <ngx-graph
      class="chart-container"
      [layout]="graphLayout"
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
          (mouseup)="nodePositionChanged(node.id, node.position)"
          (dblclick)="$event.preventDefault(); $event.stopPropagation()"
        >
          <svg:foreignObject width="122" height="80">
            <xhtml:div
              aon-block
              [aonData]="node.data?.aonData"
              [isSelected]="(sandboxFacade.selectedNodeId$ | async) === node.id"
              [isConnection]="!!(sandboxFacade.connection$ | async)!"
              [isConnecting]="
                sandboxFacade.getIsConnectingById(node.id) | async
              "
            ></xhtml:div>
          </svg:foreignObject>
        </svg:g>
      </ng-template>

      <!-- <ng-template #linkTemplate let-link>
        <svg:g class="edge">
          <svg:path
            class="line"
            stroke-width="2"
            marker-end="url(#arrow)"
          ></svg:path>
          <svg:text class="edge-label" text-anchor="middle">
            <textPath
              class="text-path"
              [attr.href]="'#' + link.id"
              [style.dominant-baseline]="link.dominantBaseline"
              startOffset="50%"
            >
              {{ link.label }}
            </textPath>
          </svg:text>
        </svg:g>
      </ng-template> -->
    </ngx-graph>
  `,
  styleUrls: ['./sandbox-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SandboxPageComponent implements OnInit {
  MiniMapPosition = MiniMapPosition;
  graphLayout: Layout = new GraphLayout();
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

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownEscapeHandler(): void {
    if (this.getIsConnecting()) {
      this.store.dispatch(SandboxActions.revertConnectionOperation());
    }
  }

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
    this.store.dispatch(SandboxActions.nodeClicked({ nodeId }));
  }

  nodePositionChanged(nodeId: string, position: NodePosition): void {
    this.sandboxFacade
      .getNodeById(nodeId)
      .pipe(
        filter(v => !!v),
        take(1)
      )
      .subscribe(node => {
        if (!isEqual(node.data?.position, position)) {
          this.store.dispatch(
            SandboxActions.nodeChanged({
              node: {
                id: nodeId,
                position
              }
            })
          );
        }
      });
  }

  private getIsConnecting(): boolean {
    let isConnecting: boolean;
    this.sandboxFacade.connection$
      .pipe(take(1))
      .subscribe(connection => (isConnecting = !!connection));
    return isConnecting!;
  }
}
