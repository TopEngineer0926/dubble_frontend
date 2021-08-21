import {Component, Input, OnInit} from '@angular/core';
import { appRouteNames } from 'src/app/constants/app-route-names';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  readonly appRouteNames = appRouteNames;
  constructor() { }

  ngOnInit(): void {

  }
}
