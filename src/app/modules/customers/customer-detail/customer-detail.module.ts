import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule} from '../../material.module';
import { CustomerDetailRoutingModule} from './customer-detail-routing.module';
import { CustomerDetailComponent } from '../../../pages/customers/customer-detail/customer-detail.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    CustomerDetailComponent
  ],
    imports: [
        CommonModule,
        CustomerDetailRoutingModule,
        SharedModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class CustomerDetailModule { }
