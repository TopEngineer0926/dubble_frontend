import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from '../../../pages/auth/registration/registration.component';
import {NgModule} from '@angular/core';
import {ResetPasswordComponent} from '../../../pages/auth/reset-password/reset-password.component';

const routes: Routes = [
  {path: '', component: ResetPasswordComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPasswordRoutingModule {
}
