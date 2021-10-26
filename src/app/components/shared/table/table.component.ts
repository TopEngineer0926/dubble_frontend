import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input, OnChanges,
  OnInit,
  Output, SimpleChange, SimpleChanges,
  ViewChild
} from '@angular/core';
import {  EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Contact, ListResponse, TableActionEvent } from '../../../interfaces';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {

  @Output() action: EventEmitter<TableActionEvent> = new EventEmitter<TableActionEvent>();
  @Output() updatePage = new EventEmitter();
  @Input() data: ListResponse<any>;
  @Input() showPagination = true;
  @Input() tableCols: {key: string, display: string, displayKey?: string, config?: any[]}[] = [];
  @Input() pageSizeOptions = 10;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Contact>([]);

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
   this.dataSource.data = this.data.list;
   this.dataSource.sort = this.sort;
   this.dataSource.paginator = this.paginator;
   this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentData: SimpleChange = changes.data;
    if (currentData.currentValue) {
      this.data = {...currentData.currentValue};
      this.dataSource.data = [...this.data.list];
    }
  }
  // We will need this getter to exctract keys from tableCols
  get keys() { return this.tableCols.map(({ key }) => key); }
  // this function will return a value from column configuration
  // depending on the value that element holds
  showBooleanValue(elt, column) {
    return column.config.values[`${elt[column.key]}`];
  }

  // getNext(event): void {
  //   this.updatePage.emit(event);
  // }

  onAction(item, action): void {
    this.action.emit({ item, action });
  }

  checkDate(date: string) : boolean{
    var d = new Date(date);
    if (d.getTime() > new Date().getTime())
      return true;
    return false;
  }
}
