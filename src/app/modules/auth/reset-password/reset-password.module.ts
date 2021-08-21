import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from '../../../pages/auth/reset-password/reset-password.component';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordFormComponent } from '../../../components/auth/reset-password-form/reset-password-form.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    ResetPasswordComponent,
    ResetPasswordFormComponent
  ],
    imports: [
        CommonModule,
        ResetPasswordRoutingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
    ]
})
export class ResetPasswordModule { }
