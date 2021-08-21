import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NewContactComponent } from '../../../pages/contacts/new-contact/new-contact.component';
import { CanDeactivateGuard } from '../../../services/core/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: NewContactComponent,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewContactRoutingModule {
}
