import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTemplateRoutingModule } from './new-template-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NewTemplateComponent } from 'src/app/pages/template/new-template/new-template.component';



@NgModule({
  declarations: [
    NewTemplateComponent,
  ],
    imports: [
        CommonModule,
        NewTemplateRoutingModule,
        SharedModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class NewTemplateModule { }
