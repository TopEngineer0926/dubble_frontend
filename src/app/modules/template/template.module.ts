import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateRoutingModule } from './template-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TemplateComponent } from '../../pages/template/template.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [TemplateComponent],
    imports: [
        CommonModule,
        TemplateRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TranslateModule
    ]
})
export class TemplateModule { }
