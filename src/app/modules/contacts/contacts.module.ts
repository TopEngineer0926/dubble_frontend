import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsRoutingModule } from './contacts-routing.module';
import { MaterialModule } from '../material.module';
import { ContactsComponent } from '../../pages/contacts/contacts.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContactsComponent
  ],
    imports: [
        CommonModule,
        ContactsRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TranslateModule
    ],
  exports: [ContactsComponent]
})
export class ContactsModule { }
