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
import { SandboxFacade } from '../+state/sandbox.facade';
import { GraphLayout } from './graphLayout';
import { AoNData } from '../+state/sandbox.model';

@Component({
  selector: 'app-sandbox-page',
  template: `
    <ngx-graph
      class="chart-container"
      [layout]="graphLayout"
      [showMiniMap]="true"
      [miniMapPosition]="MiniMapPosition.UpperRight"
      [curve]="shape.curveLinear"
      [draggingEnabled]="!(sandboxFacade.isEditMode$ | async)"
      [nodes]="(nodes$ | async)!"
      [links]="(links$ | async)!"
    >
      <ng-template #nodeTemplate let-node>
        <svg:g
          class="node"
          width="122"
          height="80"
          (click)="dispatchClick(node.id)"
          (dblclick)="dispatchDoubleClick(node.id)"
          (mouseup)="nodePositionChanged(node.id, node.position)"
        >
          <svg:foreignObject width="122" height="80">
            <xhtml:div
              aon-node
              cdkTrapFocus
              [cdkTrapFocusAutoCapture]="true"
              [aonData]="node.data?.aonData"
              [isSelected]="(sandboxFacade.selectedNodeId$ | async) === node.id"
              [isBeingEdited]="
                (sandboxFacade.editedNodeId$ | async) === node.id
              "
              [isConnectionMode]="sandboxFacade.isConnectionMode$ | async"
              [isSelectedInConnectionMode]="
                sandboxFacade.getIsConnectingById(node.id) | async
              "
              (valueChanges)="updateNodeValue(node.id, $event)"
            ></xhtml:div>
          </svg:foreignObject>
        </svg:g>
      </ng-template>
      <!-- link template. remove if necessery -->
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

  nodes$: Observable<Node[]>;
  links$: Observable<Edge[]>;

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownEscapeHandler(): void {
    this.store.dispatch(SandboxActions.escapeClicked());
  }

  @HostListener('document:keydown.delete', ['$event'])
  onKeydownDeleteHandler(): void {
    this.store.dispatch(SandboxActions.deleteClicked());
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

  dispatchClick(nodeId: string): void {
    this.store.dispatch(SandboxActions.nodeClicked({ nodeId }));
  }

  dispatchDoubleClick(nodeId: string): void {
    this.store.dispatch(SandboxActions.nodeDoubleClicked({ nodeId }));
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
            SandboxActions.nodePositionChanged({
              node: {
                id: nodeId,
                position
              }
            })
          );
        }
      });
  }

  updateNodeValue(nodeId: string, aonData: AoNData): void {
    this.store.dispatch(SandboxActions.nodeValueChanged({ nodeId, aonData }));
  }
}
