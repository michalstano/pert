import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { EffectsModule } from '@ngrx/effects';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolbarEffects } from './+state/toolbar.effects';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';

@NgModule({
  declarations: [
    ToolbarComponent,
    ExportDialogComponent,
    ImportDialogComponent
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ToolbarEffects]),
    SvgIconsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [ToolbarComponent]
})
export class ToolbarModule {}
