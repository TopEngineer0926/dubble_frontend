import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CustomerDetailComponent } from '../../../pages/customers/customer-detail/customer-detail.component';
import { CanDeactivateGuard } from '../../../services/core/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: CustomerDetailComponent,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerDetailRoutingModule {
}
