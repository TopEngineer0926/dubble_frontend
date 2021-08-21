import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductDetailComponent } from '../../../pages/products/product-detail/product-detail.component';
import { CanDeactivateGuard } from '../../../services/core/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: ProductDetailComponent,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductDetailRoutingModule {
}
