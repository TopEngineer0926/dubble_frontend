import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NewCustomerRoutingModule} from './new-customer-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import { NewCustomerComponent } from '../../../pages/customers/new-customer/new-customer.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    NewCustomerComponent,
  ],
    imports: [
        CommonModule,
        NewCustomerRoutingModule,
        SharedModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class NewCustomerModule { }
