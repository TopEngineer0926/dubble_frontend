import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule} from '../../material.module';
import { TemplateDetailRoutingModule} from './template-detail-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TemplateDetailComponent } from 'src/app/pages/template/template-detail/template-detail.component';



@NgModule({
  declarations: [
    TemplateDetailComponent
  ],
    imports: [
        CommonModule,
        TemplateDetailRoutingModule,
        SharedModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class ProductDetailModule { }
