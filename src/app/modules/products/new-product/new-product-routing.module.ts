import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { NewProductComponent } from '../../../pages/products/new-product/new-product.component';
import { CanDeactivateGuard } from '../../../services/core/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: NewProductComponent,
    canDeactivate: [CanDeactivateGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewProductRoutingModule {}
