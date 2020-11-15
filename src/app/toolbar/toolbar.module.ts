import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, SvgIconsModule],
  exports: [ToolbarComponent]
})
export class ToolbarModule {}
