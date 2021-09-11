import { Component, OnInit } from '@angular/core';
import { appRouteNames } from 'src/app/constants/app-route-names';

@Component({
  selector: 'app-monitors',
  templateUrl: './monitors.component.html',
  styleUrls: ['./monitors.component.scss']
})
export class MonitorsComponent implements OnInit {
  readonly appRouteNames = appRouteNames;

  constructor() { }

  ngOnInit(): void {
  }

}
