import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SandboxPageComponent } from './sandbox-page/sandbox-page.component';
import { AonBlockComponent } from './aon-block/aon-block.component';
import { SANDBOX_FEATURE_KEY, sandboxReducers } from './+state/sandbox.reducer';
import { SandboxEffects } from './+state/sandbox.effects';

@NgModule({
  declarations: [SandboxPageComponent, AonBlockComponent],
  imports: [
    CommonModule,
    NgxGraphModule,
    StoreModule.forFeature(SANDBOX_FEATURE_KEY, sandboxReducers),
    EffectsModule.forFeature([SandboxEffects]),
    A11yModule
  ],
  exports: [SandboxPageComponent]
})
export class SandboxModule {}
