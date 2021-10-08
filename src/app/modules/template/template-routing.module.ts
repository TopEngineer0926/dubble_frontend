import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TemplateComponent } from 'src/app/pages/template/template.component';
import { appRouteNames } from '../../constants/app-route-names';

const routes: Routes = [
  {path: '', component: TemplateComponent},
  {
    path: appRouteNames.NEW,
    loadChildren: () =>
      import('./new-template/new-template.module').then(
        m => m.NewTemplateModule
      )
  },
  {
    path: `${appRouteNames.ID}/${appRouteNames.DETAIL}`,
    loadChildren: () =>
      import('./template-detail/template-detail.module').then(
        m => m.ProductDetailModule
      )
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateRoutingModule {}
