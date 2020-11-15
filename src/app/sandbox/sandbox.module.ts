import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SandboxPageComponent } from './sandbox-page/sandbox-page.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { AonBlockComponent } from './aon-block/aon-block.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [SandboxPageComponent, AonBlockComponent, ToolbarComponent],
  imports: [CommonModule, NgxGraphModule],
  exports: [SandboxPageComponent]
})
export class SandboxModule {}
