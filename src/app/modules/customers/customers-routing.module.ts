import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CustomersComponent } from '../../pages/customers/customers.component';
import { appRouteNames } from '../../constants/app-route-names';

const routes: Routes = [
  {path: '', component: CustomersComponent},
  {
    path: appRouteNames.NEW,
    loadChildren: () =>
      import('./new-customer/new-customer.module').then(
        m => m.NewCustomerModule
      )
  },
  {
    path: `${appRouteNames.ID}/${appRouteNames.DETAIL}`,
    loadChildren: () =>
      import('./customer-detail/customer-detail.module').then(
        m => m.CustomerDetailModule
      )
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
