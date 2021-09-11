import { RouterModule, Routes } from '@angular/router';
import { MonitorsComponent } from '../../pages/monitors/monitors.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {path: '', component: MonitorsComponent},

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitorsRoutingModule {}
