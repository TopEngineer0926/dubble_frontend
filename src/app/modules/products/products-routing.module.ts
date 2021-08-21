import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from '../../pages/products/products.component';
import { NgModule } from '@angular/core';
import { appRouteNames } from '../../constants/app-route-names';


const routes: Routes = [
  {path: '', component: ProductsComponent},
  {
    path: appRouteNames.NEW,
    loadChildren: () =>
      import('./new-product/new-product.module').then(
        m => m.NewProductModule
      )
  },
  {
    path: `${appRouteNames.ID}/${appRouteNames.DETAIL}`,
    loadChildren: () =>
      import('./product-detail/product-detail.module').then(
        m => m.ProductDetailModule
      )
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
