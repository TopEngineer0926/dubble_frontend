import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LayoutComponent } from '../../pages/layout/layout.component';

const routes: Routes = [
  { path: '', component: LayoutComponent,
  children: [
    {
      path: '',
      loadChildren: () =>
        import('../../modules/dashboard/dashboard.module').then(
          m => m.DashboardModule
        ),
    },
    {
      path: 'contacts',
      loadChildren: () =>
        import('../../modules/contacts/contacts.module').then(
          m => m.ContactsModule
        ),
    },
    {
      path: 'customers',
      loadChildren: () =>
        import('../../modules/customers/customers.module').then(
          m => m.CustomersModule
        ),
    },
    {
      path: 'products',
      loadChildren: () =>
        import('../../modules/products/products.module').then(
          m => m.ProductsModule
        ),
    },
    {
      path: 'user-settings',
      loadChildren: () =>
        import('../../modules/user-settings/user-settings.module').then(
          m => m.UserSettingsModule
        ),
    },
  ]},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
