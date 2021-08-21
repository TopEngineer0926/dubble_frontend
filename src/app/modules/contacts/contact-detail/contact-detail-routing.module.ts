import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ContactDetailComponent } from '../../../pages/contacts/contact-detail/contact-detail.component';
import { CanDeactivateGuard } from '../../../services/core/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: ContactDetailComponent,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactDetailRoutingModule {
}
