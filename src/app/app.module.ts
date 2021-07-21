import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { HotToastModule } from '@ngneat/hot-toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SandboxModule } from './sandbox/sandbox.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { appAghLogo } from '../assets/images/svg-compiled/svg/app-agh_logo.icon';
import { appAddAonBlock } from '../assets/images/svg-compiled/svg/app-add_aon_block.icon';
import { appRemoveAonBlock } from '../assets/images/svg-compiled/svg/app-remove_aon_block.icon';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SandboxModule,
    ToolbarModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      name: 'PERT',
      logOnly: environment.production
    }),
    EffectsModule.forRoot(),
    SvgIconsModule.forRoot({
      icons: [appAghLogo, appAddAonBlock, appRemoveAonBlock]
    }),
    HotToastModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
