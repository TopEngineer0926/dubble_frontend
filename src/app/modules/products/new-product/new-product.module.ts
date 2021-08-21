import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NewProductRoutingModule} from './new-product-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import { NewProductComponent } from '../../../pages/products/new-product/new-product.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    NewProductComponent,
  ],
    imports: [
        CommonModule,
        NewProductRoutingModule,
        SharedModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class NewProductModule { }
