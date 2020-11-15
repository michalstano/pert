import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-toolbar></app-toolbar>
    <div class="router-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'pert';
}
