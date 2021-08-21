import { Component, OnInit } from '@angular/core';
import { appRouteNames } from 'src/app/constants/app-route-names';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  readonly appRouteNames = appRouteNames;

  constructor() { }

  ngOnInit(): void {
  }

}
