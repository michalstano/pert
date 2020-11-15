import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MiniMapPosition } from '@swimlane/ngx-graph';
import { AoNData } from '../+state/sandbox.model';

@Component({
  selector: 'app-sandbox-page',
  template: `
    <app-toolbar></app-toolbar>
    <div class="container">
      <ngx-graph
        class="chart-container"
        [showMiniMap]="true"
        [miniMapPosition]="MiniMapPosition.UpperRight"
        [links]="[
          {
            id: 'a',
            source: 'first',
            target: 'second',
            label: 'is parent of'
          },
          {
            id: 'b',
            source: 'first',
            target: 'third',
            label: 'custom label'
          }
        ]"
        [nodes]="[
          {
            id: 'first',
            label: 'A'
          },
          {
            id: 'second',
            label: 'B'
          },
          {
            id: 'third',
            label: 'C'
          },
          {
            id: 'monkaS',
            label: 'LUL'
          }
        ]"
      >
        <ng-template #nodeTemplate let-node>
          <svg:g class="node" width="122" height="80">
            <svg:foreignObject width="122" height="80">
              <xhtml:div aon-block [aonData]="aonDataMock"></xhtml:div>
            </svg:foreignObject>
          </svg:g>
        </ng-template>
      </ngx-graph>
    </div>
  `,
  styleUrls: ['./sandbox-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SandboxPageComponent {
  MiniMapPosition = MiniMapPosition;
  aonDataMock = {
    earliestStart: 10,
    duration: 20,
    earliestFinish: 30,
    name: 'name',
    latestStart: 40,
    float: 0,
    latestFinish: 50
  } as AoNData;
}
