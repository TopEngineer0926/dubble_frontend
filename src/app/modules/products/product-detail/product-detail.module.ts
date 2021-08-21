import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule} from '../../material.module';
import { ProductDetailRoutingModule} from './product-detail-routing.module';
import { ProductDetailComponent } from '../../../pages/products/product-detail/product-detail.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    ProductDetailComponent
  ],
    imports: [
        CommonModule,
        ProductDetailRoutingModule,
        SharedModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class ProductDetailModule { }
