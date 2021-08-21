import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from '../../../pages/auth/forgot-password/forgot-password.component';
import { ForgotPasswordFormComponent } from '../../../components/auth/forgot-password-form/forgot-password-form.component';
import {MaterialModule} from '../../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    ForgotPasswordComponent,
    ForgotPasswordFormComponent
  ],
    imports: [
        CommonModule,
        ForgotPasswordRoutingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
    ]
})
export class ForgotPasswordModule { }
