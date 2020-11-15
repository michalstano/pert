import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  template: `
    <svg-icon key="agh-logo" class="agh-logo"></svg-icon>
    <div class="line"></div>
  `,
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {}
