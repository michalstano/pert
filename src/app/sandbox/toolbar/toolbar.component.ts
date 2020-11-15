import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  template: `
    <p>toolbar works!</p>
  `,
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {}
