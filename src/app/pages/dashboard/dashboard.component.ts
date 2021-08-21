import {Component, OnInit} from '@angular/core';
import {QueryParams, SortColumn} from '../../interfaces/base/base-object';
import { appRouteNames } from 'src/app/constants/app-route-names';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  readonly appRouteNames = appRouteNames;
  params: QueryParams = {limit: 5, offset: 0, sort_column: SortColumn.CreatedAt, sort_order: 'desc'};
  showPagination = false;
  constructor() { }

  ngOnInit(): void {
  }

}
