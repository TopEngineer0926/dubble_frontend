import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorsRoutingModule } from './monitors-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MonitorsComponent } from '../../pages/monitors/monitors.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [MonitorsComponent],
    imports: [
        CommonModule,
        MonitorsRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TranslateModule
    ]
})
export class MonitorsModule { }
