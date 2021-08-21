import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from '../../../pages/auth/login/login.component';
import { MaterialModule } from '../../material.module';
import { LoginFormComponent } from '../../../components/auth/login-form/login-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LoginComponent,
    LoginFormComponent
  ],
    imports: [
        CommonModule,
        LoginRoutingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class LoginModule { }
