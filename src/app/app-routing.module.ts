import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SandboxPageComponent } from './sandbox/sandbox-page/sandbox-page.component';

const routes: Routes = [{ path: '', component: SandboxPageComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
