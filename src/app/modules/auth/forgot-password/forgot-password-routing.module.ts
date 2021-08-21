import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ForgotPasswordComponent } from '../../../pages/auth/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', component: ForgotPasswordComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordRoutingModule {}
