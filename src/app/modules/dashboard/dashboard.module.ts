import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { MaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [DashboardComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        SharedModule,
        MaterialModule,
        TranslateModule
    ]
})
export class DashboardModule { }
