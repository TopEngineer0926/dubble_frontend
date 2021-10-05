import { Component, OnInit } from '@angular/core';
import { appRouteNames } from 'src/app/constants/app-route-names';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  readonly appRouteNames = appRouteNames;

  constructor() { }

  ngOnInit(): void {
  }

}
