import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EffectsModule } from '@ngrx/effects';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolbarEffects } from './+state/toolbar.effects';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';
import { GraphIndicatorComponent } from './graph-indicator/graph-indicator.component';
import { ChartDialogComponent } from './chart-dialog/chart-dialog.component';
import { InfoWindowComponent } from './info-window/info-window.component';

@NgModule({
  declarations: [
    ToolbarComponent,
    ExportDialogComponent,
    ImportDialogComponent,
    GraphIndicatorComponent,
    ChartDialogComponent,
    InfoWindowComponent
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ToolbarEffects]),
    SvgIconsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  exports: [ToolbarComponent]
})
export class ToolbarModule {}
