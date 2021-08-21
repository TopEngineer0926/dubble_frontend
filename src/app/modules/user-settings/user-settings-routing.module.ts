import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserSettingsComponent } from '../../pages/user-settings/user-settings.component';
import { SettingsGuard } from '../../services/core/settings.guard';

const routes: Routes = [
  {
    path: '',
    component: UserSettingsComponent,
    canDeactivate: [SettingsGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSettingsRoutingModule {
}
