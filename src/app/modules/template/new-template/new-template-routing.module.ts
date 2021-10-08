import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { CanDeactivateGuard } from '../../../services/core/can-deactivate.guard';
import { NewTemplateComponent } from 'src/app/pages/template/new-template/new-template.component';

const routes: Routes = [
  {
    path: '',
    component: NewTemplateComponent,
    canDeactivate: [CanDeactivateGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewTemplateRoutingModule {}
