import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationRoutingModule } from './registration-routing.module';
import { RegistrationComponent } from '../../../pages/auth/registration/registration.component';
import { RegistrationFormComponent } from '../../../components/auth/registration-form/registration-form.component';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    RegistrationComponent,
    RegistrationFormComponent,
  ],
    imports: [
        CommonModule,
        RegistrationRoutingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
    ]
})
export class RegistrationModule { }
