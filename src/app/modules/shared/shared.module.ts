import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from '../../components/shared/file-upload/file-upload.component';
import { MaterialModule } from '../material.module';
import { TableComponent } from '../../components/shared/table/table.component';
import { ContactFormComponent } from '../../components/contacts/contact-form/contact-form.component';
import { ContactsTableComponent } from '../../components/contacts/contacts-table/contacts-table.component';
import { UploadImageComponent } from '../../components/contacts/upload-image/upload-image.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomersTableComponent } from '../../components/customers/customers-table/customers-table.component';
import { ProductsTableComponent } from '../../components/products/products-table/products-table.component';
import { CustomerFormComponent } from '../../components/customers/customer-form/customer-form.component';
import { ProductFormComponent } from '../../components/products/product-form/product-form.component';
import { UploadVideoComponent } from '../../components/products/upload-video/upload-video.component';
import { UploadPdfComponent } from '../../components/products/upload-pdf/upload-pdf.component';
import { QuillModule } from 'ngx-quill';
import { TranslateModule } from '@ngx-translate/core';
import { UnsavedChangesConfirmDialogComponent } from '../../components/dialogs/unsaved-changes-confirm-dialog.component';
import { BrowserNotSupportedComponent } from '../../components/shared/browser-not-supported/browser-not-supported.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorLanguageService } from '../../components/shared/table/mat-paginator-language.service';
import { SafePipe } from '../../components/shared/pipes/safe.pipe';
import { DeleteConfirmDialogComponent } from 'src/app/components/deleteConfirm/delete-confirm-dialog.component';
import { MonitorsTableComponent } from '../../components/monitors/monitors-table/monitors-table.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TemplateTableComponent } from 'src/app/components/template/template-table/template-table.component';

const components = [
  BrowserNotSupportedComponent,
  FileUploadComponent,
  TableComponent,
  DeleteConfirmDialogComponent,
  UnsavedChangesConfirmDialogComponent,
  ContactsTableComponent,
  CustomersTableComponent,
  ProductsTableComponent,
  ContactFormComponent,
  CustomerFormComponent,
  ProductFormComponent,
  UploadImageComponent,
  UploadPdfComponent,
  UploadVideoComponent,
  MonitorsTableComponent,
  TemplateTableComponent
];

const pipes = [
  SafePipe
];

const services = [
  {
    provide: MatPaginatorIntl,
    useClass: MatPaginatorLanguageService
  }
];

@NgModule({
  declarations: [...components, ...pipes],
  exports: [...components, ...pipes],
  providers: [...services],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    QuillModule.forRoot(),
    NgSelectModule,
    TranslateModule
  ]

})
export class SharedModule {
}
