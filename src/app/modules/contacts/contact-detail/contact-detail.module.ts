import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule} from '../../material.module';
import { ContactDetailComponent} from '../../../pages/contacts/contact-detail/contact-detail.component';
import { ContactDetailRoutingModule} from './contact-detail-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    ContactDetailComponent
  ],
    imports: [
        CommonModule,
        ContactDetailRoutingModule,
        SharedModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class ContactDetailModule { }
