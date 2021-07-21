import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-info-window',
  template: `
    <h1>Legenda</h1>
    <div class="keys">
      <div>
        <div class="key">esc</div>
        <div>- opuść tryb edycji, łączenia, selekcji</div>
      </div>
      <div>
        <div class="key">del</div>
        <div>- usuń węzeł/łączenie</div>
      </div>
    </div>
    <div class="nodes">
      <div>
        <div class="node selected"></div>
        <div>- wybrany węzeł</div>
      </div>
      <div>
        <div class="node edited"></div>
        <div>- tryb edycji</div>
      </div>
      <div>
        <div class="node invalid"></div>
        <div>- nieprawidlowe dane w węźle</div>
      </div>
      <div>
        <div class="node critical"></div>
        <div>- węzeł w ścieżce krytycznej</div>
      </div>
    </div>
  `,
  styleUrls: ['./info-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoWindowComponent {}
