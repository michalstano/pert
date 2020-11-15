import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { StoreModule } from '@ngrx/store';
import { SandboxPageComponent } from './sandbox-page/sandbox-page.component';
import { AonBlockComponent } from './aon-block/aon-block.component';
import { SANDBOX_FEATURE_KEY, sandboxReducer } from './+state/sandbox.reducer';

@NgModule({
  declarations: [SandboxPageComponent, AonBlockComponent],
  imports: [
    CommonModule,
    NgxGraphModule,
    StoreModule.forFeature(SANDBOX_FEATURE_KEY, sandboxReducer)
  ],
  exports: [SandboxPageComponent]
})
export class SandboxModule {}
