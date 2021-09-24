import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SnackBarService } from '../../services/core/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../../app/services/core/local-storage.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  readonly appRouteNames = appRouteNames;
  constructor(
    protected httpClient: HttpClient,
    private snackBarService: SnackBarService,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService) { }

  @ViewChild('fileUpload') myInputVariable: ElementRef;
  protected url = environment.apiUrl + 'customer/excel';
  protected path = 'download_example';
  protected upload_path = 'upload_xlsx';
  fileName = '';
  update = false;

  public selectedCategory: string = "";
  public categoryList: Array<string> = [];

  ngOnInit(): void {
    const data = this.localStorageService.get('category-list');
    data.map((d) => {
      this.categoryList.push(d.name);
  })

  }

  downloadExampleXLS() : void {
    this.httpClient.post(`${this.url}/${this.path}`, null, { observe: 'response', responseType: "blob"})
    .subscribe((data) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data.body]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'Beispiel.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
  }

  onFileSelected(event) {
    const file:File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      this.fileName = file.name;

      formData.append("file", file);

      const upload$ = this.httpClient.post(`${this.url}/${this.upload_path}`, formData);
      upload$.subscribe((data) => {
          const message = this.translateService.instant('EXCEL.UPLOAD_SUCCESS');
          this.snackBarService.success(message)
          this.update = !this.update;
        }, error => {
          this.snackBarService.error(error.error?.message || error.message);
        }
      );
    }
    this.myInputVariable.nativeElement.value = null;
  }
}
