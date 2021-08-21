import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsComponent } from '../../pages/user-settings/user-settings.component';
import { UserSettingsFormComponent } from '../../components/user-settings/user-settings-form/user-settings-form.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS,
  NgxMatColorPickerModule
} from '@angular-material-components/color-picker';
import { ChangePasswordFormComponent } from '../../components/auth/change-password-form/change-password-form.component';
import { UploadLogoComponent } from '../../components/user-settings/upload-logo/upload-logo.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    UserSettingsComponent,
    UserSettingsFormComponent,
    ChangePasswordFormComponent,
    UploadLogoComponent,

  ],
    imports: [
        CommonModule,
        UserSettingsRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        NgxMatColorPickerModule,
        FormsModule,
        SharedModule,
        TranslateModule
    ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
})
export class UserSettingsModule { }
