import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { appRouteNames } from './constants/app-route-names';
import { AuthGuard } from './services/core/auth.guard';

const routes: Routes = [
  {
    path: appRouteNames.LOGIN,
    loadChildren: () =>
      import('./modules/auth/login/login.module').then(
        m => m.LoginModule
      ),
  },
  {
    path: appRouteNames.REGISTER,
    loadChildren: () =>
      import('./modules/auth/registration/registration.module').then(
        m => m.RegistrationModule
      ),
    canActivate: []
  },
  {
    path: appRouteNames.FORGOT_PASSWORD,
    loadChildren: () =>
      import('./modules/auth/forgot-password/forgot-password.module').then(
        m => m.ForgotPasswordModule
      ),
  },
  {
    path: appRouteNames.RESET_PASSWORD,
    loadChildren: () =>
      import('./modules/auth/reset-password/reset-password.module').then(
        m => m.ResetPasswordModule
      ),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/layout/layout.module').then(
        m => m.LayoutModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
