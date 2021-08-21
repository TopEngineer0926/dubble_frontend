import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from '../../pages/customers/customers.component';
import { CustomersRoutingModule } from './customers-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [CustomersComponent],
    imports: [
        CommonModule,
        CustomersRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TranslateModule
    ]
})
export class CustomersModule { }
