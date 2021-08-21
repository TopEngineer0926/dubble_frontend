import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ContactsComponent } from '../../pages/contacts/contacts.component';
import {appRouteNames} from '../../constants/app-route-names';

const routes: Routes = [
  {path: '', component: ContactsComponent},
  {
    path: appRouteNames.NEW,
    loadChildren: () =>
      import('../../modules/contacts/new-contact/new-contact.module').then(
        m => m.NewContactModule
      )
  },
  {
    path: `${appRouteNames.ID}/${appRouteNames.DETAIL}`,
    loadChildren: () =>
      import('../../modules/contacts/contact-detail/contact-detail.module').then(
        m => m.ContactDetailModule
      )
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
