import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NewCustomerComponent } from '../../../pages/customers/new-customer/new-customer.component';
import { CanDeactivateGuard } from '../../../services/core/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: NewCustomerComponent,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCustomerRoutingModule {
}
