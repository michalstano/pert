import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule } from '@angular/forms';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { SandboxPageComponent } from './sandbox-page/sandbox-page.component';
import { AonNodeComponent } from './aon-node/aon-node.component';
import { SANDBOX_FEATURE_KEY, sandboxReducers } from './+state/sandbox.reducer';
import { SandboxEffects } from './+state/sandbox.effects';
import { DisableControlModule } from '../shared/directives/disable-control/disable-control.module';
import { AonBlockInputComponent } from './aon-block-input/aon-block-input.component';
import { MapperPipeModule } from '../shared/pipes/mapper/mapper.module';

@NgModule({
  declarations: [
    SandboxPageComponent,
    AonNodeComponent,
    AonBlockInputComponent
  ],
  imports: [
    CommonModule,
    NgxGraphModule,
    StoreModule.forFeature(SANDBOX_FEATURE_KEY, sandboxReducers),
    EffectsModule.forFeature([SandboxEffects]),
    ReactiveFormsModule,
    A11yModule,
    DisableControlModule,
    DigitOnlyModule,
    MapperPipeModule
  ],
  exports: [SandboxPageComponent]
})
export class SandboxModule {}
