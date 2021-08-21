import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ProductsComponent } from '../../pages/products/products.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [ProductsComponent],
    imports: [
        CommonModule,
        ProductsRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TranslateModule
    ]
})
export class ProductsModule { }
