import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewContactComponent } from '../../../pages/contacts/new-contact/new-contact.component';
import {NewContactRoutingModule} from './new-contact-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    NewContactComponent,
  ],
    imports: [
        CommonModule,
        NewContactRoutingModule,
        SharedModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class NewContactModule { }
