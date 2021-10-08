import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanDeactivateGuard } from '../../../services/core/can-deactivate.guard';
import { TemplateDetailComponent } from 'src/app/pages/template/template-detail/template-detail.component';

const routes: Routes = [
  {
    path: '',
    component: TemplateDetailComponent,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateDetailRoutingModule {
}
