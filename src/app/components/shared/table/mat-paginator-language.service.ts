import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class MatPaginatorLanguageService extends MatPaginatorIntl {

  constructor(private translateService: TranslateService) {
    super();
    this.translateService.get('COMMON.ItemsPerPage')
      .subscribe((label) => this.itemsPerPageLabel = label);
  }
}
