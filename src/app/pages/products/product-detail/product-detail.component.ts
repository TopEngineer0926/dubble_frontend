import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { mergeMap, switchMap, tap } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { ComponentCanDeactivate, ExtendedFileUploadEvent, ListResponse, Media, PublicationStatus, User } from '../../../interfaces';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { Product } from '../../../interfaces/product';
import { UserState } from '../../../../store/auth.state';
import {
  DeleteProductMedia,
  GetProductById,
  SaveProductMedia,
  SendProductLinkBy,
  UpdateMedia,
  UpdateProduct
} from '../../../../store/products/products.actions';
import { ProductsState } from '../../../../store/products/products.state';
import { MediaType } from '../../../constants/media-type.enum';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UpdateCustomer } from '../../../../store/customers/customers.actions';
import { ProductFormComponent } from '../../../components/products/product-form/product-form.component';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../../../interfaces/customer';
import { LocalStorageService } from '../../../services/core/local-storage.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  currentProduct: { product: Product, media: ListResponse<Media> };

  uploadedVideo: Media[] = new Array(3).fill(null);
  uploadedImage: Media;
  uploadedPdf: Media[] = new Array(3).fill(null);
  productPageLink: string;
  isLoading = false;
  private videoToUpload: Media[] = new Array(3).fill(null);
  private pdfToUpload: Media[] = new Array(3).fill(null);

  @ViewChild(ProductFormComponent) private productForm: ProductFormComponent;

  public date: string = "";
  public selectedHour: string = "";
  public hourList: Array<string> = [];
  protected scheduleSmsUrl   = environment.apiUrl + 'schedule/scheduleSms';
  protected scheduleEmailUrl = environment.apiUrl + 'schedule/scheduleEmail';

  protected sendSmsByCategoryUrl   = environment.apiUrl + 'schedule/sendSmsByCategory';
  protected sendEmailByCategoryUrl = environment.apiUrl + 'schedule/sendEmailByCategory';

  private subscription = new Subscription();
  private hasImage: boolean;

  public selectedCategory: string = "";
  public categoryList: Array<string> = [];
  protected categoryUrl = environment.apiUrl + 'customer/customer_by_filter';

  private immediateSendIndex = 0;
  private delaySendIndex = 0;

  cntRecipients: number = 0;

  customerListByCategory: ListResponse<Customer>;

  user: User = this.store.selectSnapshot<User>(UserState.user);
  isDisable: Boolean = false;

  get isPublished(): boolean {
    return this.currentProduct?.product?.publication_status === PublicationStatus.published;
  }

  constructor(private store: Store,
              private route: ActivatedRoute,
              protected httpClient: HttpClient,
              private snackBarService: SnackBarService,
              private translateService: TranslateService,
              private localStorageService: LocalStorageService) {
    for (var i = 0; i < 24; i++)
        this.hourList.push(i.toString());
  }

  ngOnInit(): void {
    this.getProductData();

    const category_data = this.localStorageService.get('category-list');
    category_data.map((d) => {
      this.categoryList.push(d.name);
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canDeactivate() {
    return this.productForm?.canDeactivate() || true;
  }

  uploadImage(img: File) {
    if (img) {
      this.saveProductImg(img);
    } else {
      this.removeProductImg();
    }
  }

  uploadPdf(pdf: ExtendedFileUploadEvent, index) {
    if (pdf) {
      this.saveProductPdf(pdf, index);
    } else {
      this.removeProductPdf(index);
    }
  }

  uploadVideo(video: ExtendedFileUploadEvent, index) {
    if (video) {
      this.saveProductVideo(video, index);
    } else {
      this.removeProductVideo(index);
    }
  }

  editProduct(form: Product) {
    if (!this.hasImage && form.publication_status === PublicationStatus.published) {
      const message = this.translateService.instant('PRODUCT.TeaserImageMissing');
      this.snackBarService.error(message);
      return;
    }
    this.isLoading = true;

    const requests = [this.store.dispatch(new UpdateProduct(form))];
    if (form.customer?.itemid) {
      requests.push(this.store.dispatch(new UpdateCustomer(form.customer)));
    }

    this.pdfToUpload.forEach((file: any, index) => {
      if (!file) {
        return;
      }
      if (this.isSameFileUpload(file, this.uploadedPdf[index]) || (!file.file && !file.title)) {
        return;
      }
      if (!file.file) {
        const updatedFile = this.updateTitleInArray(file.title, index, this.pdfToUpload);
        // this.updateTitleInArray(file.title, index, this.pdfToUpload);
        return this.saveMediaTitle(updatedFile, index);
      }
      requests.push(this.store.dispatch(new SaveProductMedia(this.currentProduct.product.itemid, { ...file, order: index })));
    });

    this.videoToUpload.forEach((file: any, index) => {
      if (!file) {
        return;
      }
      if (this.isSameFileUpload(file, this.uploadedVideo[index]) || (!file.file && !file.title)) {
        return;
      }
      if (!file.file) {
        const updatedFile = this.updateTitleInArray(file.title, index, this.videoToUpload);
        // this.updateTitleInArray(file.title, index, this.videoToUpload);
        return this.saveMediaTitle(updatedFile, index);
      }
      requests.push(this.store.dispatch(new SaveProductMedia(this.currentProduct.product.itemid, { ...file, order: index })));
    });
    this.subscription.add(
      combineLatest(requests).pipe(
        tap((data) => {
          this.productForm.canDeactivate(true);
          const message = this.translateService.instant('PRODUCT.Updated');
          this.snackBarService.success(message);
          this.getProductData();
        })
      ).subscribe((data) => {
          this.isLoading = false;
          this.pdfToUpload = [...this.uploadedPdf];
          this.videoToUpload = [...this.uploadedVideo];
        },
        error => {
          this.isLoading = false;
          this.snackBarService.error(error.error?.message || error.message);
        }));
  }

  saveProductVideo(file, index) {
    // this.videoToUpload.splice(index, 1, file);
    this.videoToUpload.splice(index, 1, {...this.videoToUpload[index], ...file});
  }

  saveMediaTitle(file: Media, index: number) {
    this.subscription.add(
      this.store.dispatch(new UpdateMedia({id: file.itemid, title: file.title, order: index}))
        .subscribe((data) => {
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            this.snackBarService.error(error.error?.message || error.message);
          }
        )
    );

  }

  private updateTitleInArray(title: string, index: number, array: Media[]) {
    const file = array[index];
    array[index] = {
      ...file,
      title,
      order: index
    };
    return file;
  }

  removeProductVideo(index) {
    this.isLoading = true;
    if (!this.uploadedVideo[index]) {
      this.isLoading = false;
      return;
    }
    const { itemid } = this.uploadedVideo[index];
    this.uploadedVideo.splice(index, 1, null);
    this.videoToUpload.splice(index, 1, null);
    this.subscription.add(
      this.store.dispatch(new DeleteProductMedia(itemid))
        .subscribe((data) => {
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            this.snackBarService.error(error.error?.message || error.message);
          }));
  }

  saveProductImg(img) {
    this.isLoading = true;
    this.subscription.add(
      this.store.dispatch(new SaveProductMedia(this.currentProduct.product.itemid, img[0].data))
        .subscribe((data) => {
            this.isLoading = false;
            this.hasImage = true;
          },
          error => {
            this.isLoading = false;
            this.snackBarService.error(error.error?.message || error.message);
          })
    );
  }

  removeProductImg() {
    this.isLoading = true;
    this.subscription.add(
      this.store.dispatch(new DeleteProductMedia(this.uploadedImage.itemid))
        .subscribe((data) => {
            this.isLoading = false;
            this.hasImage = false;
          },
          error => {
            this.isLoading = false;
            this.snackBarService.error(error.error?.message || error.message)}
          ));
  }

  saveProductPdf(pdf, index) {
    // this.pdfToUpload.splice(index, 1, pdf);
    this.pdfToUpload.splice(index, 1, {...this.pdfToUpload[index], ...pdf});
  }

  removeProductPdf(index) {
    this.isLoading = true;
    if (!this.uploadedPdf[index]) {
      this.isLoading = false;
      return;
    }
    const { itemid } = this.uploadedPdf[index];
    this.uploadedPdf.splice(index, 1, null);
    this.pdfToUpload.splice(index, 1, null);
    this.subscription.add(
      this.store.dispatch(new DeleteProductMedia(itemid))
        .subscribe((data) => {
          this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            this.snackBarService.error(error.error?.message || error.message)
          }));
  }

  sendProductLinkBy(sendFormat: 'customer' | 'category', type: 'sms' | 'email', customer: Customer) {
    this.isLoading = true;
    if (sendFormat == 'customer') {
      this.subscription.add(
        this.store.dispatch(new SendProductLinkBy(this.currentProduct.product.itemid, type))
          .subscribe((data) => {
              this.isLoading = false;

              if (sendFormat == 'customer') {
                const message = this.translateService.instant(`PRODUCT.${ type }WasSent`);
                this.snackBarService.success(message);
              } else if (sendFormat == 'category') {
                const message = this.translateService.instant('CATEGORY.ImmediatSuccessMsg');
                this.snackBarService.success(message);
              }

              this.saveMailSms(
                type, customer.itemid, customer.firstname + " " + customer.lastname,
                customer.email, customer.phone_number? customer.phone_number : "",this.getCurrentDate(), "", "");
            },
            error => {
              this.isLoading = false;
              this.snackBarService.error(error.error?.message || error.message)
            })
      );
    } else if (sendFormat == 'category') {
      var apiUrl = "";
      if (type === 'sms') {
        apiUrl = this.sendSmsByCategoryUrl;
      }else if (type === 'email') {
        apiUrl = this.sendEmailByCategoryUrl;
      }

      var body = {
        productId: this.currentProduct.product.itemid,
        customer: customer
      }

      this.httpClient.post(`${apiUrl}`, body)
      .subscribe(async (data) => {
          this.isLoading = false;
          const message = this.translateService.instant('CATEGORY.ImmediatSuccessMsg');
          this.snackBarService.success(message);

          await this.saveMailSms(
            type, customer.itemid, customer.firstname + " " + customer.lastname,
            customer.email, customer.phone_number? customer.phone_number : "",this.getCurrentDate(), "", "");

            this.immediateSendIndex++;
            if (this.immediateSendIndex < this.customerListByCategory.list.length) {
              if (this.customerListByCategory?.list[this.immediateSendIndex].phone_number) {
                this.sendProductLinkBy('category', 'sms', this.customerListByCategory.list[this.immediateSendIndex]);
              } else if (this.customerListByCategory?.list[this.immediateSendIndex].email) {
                this.sendProductLinkBy('category', 'email', this.customerListByCategory.list[this.immediateSendIndex]);
              }
            }
      },
      error => {
          this.isLoading = false;
          this.snackBarService.error(error.error?.message || error.message)
      });

    }
  }

  handleChangeDate(): void {
    if (this.date != "") {
      if (this.selectedHour == "")
        this.selectedHour = "9";
    }
  }

  sendProductLinkByWithDelay(sendFormat: 'customer' | 'category', type: 'sms' | 'email', customer: Customer) {
        this.isLoading = true;
        var mDate = new Date(this.date);
        var month = '' + (mDate.getMonth() + 1);
        var day = '' + mDate.getDate();
        var year = mDate.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        var dateToString = [year, month, day].join('-');

        var body = {
            productId: this.currentProduct.product.itemid,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            customer: customer,
            dateTime: dateToString + "T" + this.selectedHour.replace(/^(\d)$/, '0$1') + ":00:00"
        }

        var apiUrl = "";
        if (type === 'sms') {
          apiUrl = this.scheduleSmsUrl;
        }else if (type === 'email') {
          apiUrl = this.scheduleEmailUrl;
        }

        this.httpClient.post(`${apiUrl}`, body)
        .subscribe(({jobId, jobGroup}: any) => {

            this.saveMailSms(
              type, customer.itemid, customer.firstname + " " + customer.lastname,
              customer.email, customer.phone_number ? customer.phone_number : "", 
              dateToString + "T" + this.selectedHour.replace(/^(\d)$/, '0$1') + ":00:00",
              jobId, jobGroup);

            if (sendFormat == 'customer') {
              this.isLoading = false;
              const message = this.translateService.instant(`PRODUCT.${ type }WasSentWithDelay`);
              this.snackBarService.success(message);
            } else if (sendFormat == 'category') {
              const message = this.translateService.instant('CATEGORY.DelaySuccessMsg');
              this.snackBarService.success(message);

              this.delaySendIndex++;
              if (this.delaySendIndex < this.customerListByCategory.list.length) {
                if (this.customerListByCategory?.list[this.delaySendIndex].phone_number) {
                  this.sendProductLinkByWithDelay('category', 'sms', this.customerListByCategory.list[this.delaySendIndex]);
                } else if (this.customerListByCategory?.list[this.delaySendIndex].email) {
                  this.sendProductLinkByWithDelay('category', 'email', this.customerListByCategory.list[this.delaySendIndex]);
                }
              } else {
                this.isLoading = false;
              }
            }
        },
        error => {
            this.isLoading = false;
            this.snackBarService.error(error.error?.message || error.message)
        });
  }

  openInNewTab(link: string) {
    window.open(link, '_blank');
  }

  private getProductData() {
    // this.isLoading = true; // Commented as it interferes with upload Video loader
    this.subscription.add(
      this.route.params.pipe(
        mergeMap((params) => this.store.dispatch(new GetProductById(params.id)).pipe(
          switchMap(() => this.store.select(ProductsState.currentProduct))
          )
        )).subscribe((product: { product: Product, media: ListResponse<Media> }) => {
        // this.isLoading = false; // Commented as it interferes with upload Video loader
        this.currentProduct = product;
        this.productPageLink = `${ environment.webUrl }${ product.product.share_code }`;
        const videos = product.media.list.filter(({ media_type }) => media_type === MediaType.Video);
        videos.forEach((media) => this.uploadedVideo.splice(media.order, 1, media));
        this.uploadedImage = product.media.list.filter(({ media_type }) => media_type === MediaType.Image)[0];
        this.uploadedPdf = product.media.list.filter(({ media_type }) => media_type === MediaType.Pdf);
        this.videoToUpload = [...this.uploadedVideo];
        this.pdfToUpload = [...this.uploadedPdf];
        if (this.uploadedImage) {
          this.hasImage = true;
        }
        if (Number(this.user.itemid) != this.currentProduct?.product.user_id) {
          this.isDisable = true
        } else {
          this.isDisable = false
        }
      }));
  }

  private isSameFileUpload(file1, file2): boolean {
    return file1 === file2 || (file1?.file === file2?.file && file1?.title === file2?.title);
  }

  private saveMailSms(type: string, customerId: string, customerName: string, customerEmail: string, customerPhone: string, date: string, scheduleJobId: string, scheduleJobGroup: string) {
    var apiUrl = environment.apiUrl + 'monitor';
    var body = {
        productId: this.currentProduct.product.itemid,
        internalPageTitle: this.currentProduct.product.internal_page_title,
        contactId: this.currentProduct.product.contact.itemid,
        userId: this.currentProduct.product.user_id,
        customerId: customerId,
        sender: this.currentProduct.product.contact.firstname + " " + this.currentProduct.product.contact.lastname,
        receiver: customerName,
        email: customerEmail,
        phone: customerPhone,
        sendingDate: date,
        sentStatus: type.toUpperCase(),
        jobId: scheduleJobId,
        jobGroup: scheduleJobGroup
    }

    this.httpClient.post(`${apiUrl}`, body)
    .subscribe((data) => {
        const message = this.translateService.instant(`PRODUCT.${ type }WasSentWithDelay`);
        this.snackBarService.success(message);
    },
    error => {
        this.snackBarService.error(error.error?.message || error.message)
    });
  }

  private getCurrentDate() {
    var now = new Date();
    var month = '' + (now.getMonth() + 1);
    var day = '' + now.getDate();
    var year = now.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    var dateToString = [year, month, day].join('-');

    var hours = '' + now.getHours();
    var minutes = '' + now.getMinutes();
    var seconds = '' + now.getSeconds();

    if (hours.length < 2) 
        hours = '0' + hours;
    if (minutes.length < 2) 
        minutes = '0' + minutes;
    if (seconds.length < 2) 
        seconds = '0' + seconds;

    var timeToString = [hours, minutes, seconds].join(':');

    return dateToString + "T" + timeToString;
  }

  handleChangeCategory(value: string): void {
    if (value) {
      this.getCustomersByFilter(value);
    } else {
      this.customerListByCategory = null;
      this.cntRecipients = 0;
    }
  }
  
  getCustomersByFilter(filter) {
    this.httpClient.get<ListResponse<Customer>>(this.categoryUrl, {
      params: {
        limit: "0",
        offset: "0",
        filter: "|" + filter + "|"
      },
    })
    .subscribe((contacts) => {
      this.customerListByCategory = contacts;
      this.cntRecipients = contacts.overallsize;
    },
    error => {
      this.snackBarService.error(error.error?.message || error.message)
    });
  }

  sendWithDelay() {
    this.delaySendIndex = 0;
    if (this.customerListByCategory?.list[0]) {
      if (this.customerListByCategory.list[0].phone_number) {
        this.sendProductLinkByWithDelay('category', 'sms', this.customerListByCategory.list[0]);
      } else if (this.customerListByCategory.list[0].email) {
        this.sendProductLinkByWithDelay('category', 'email', this.customerListByCategory.list[0]);
      }
    }
  }

  sendWithImmediately() {
    this.immediateSendIndex = 0;
    if (this.customerListByCategory?.list[0]) {
      if (this.customerListByCategory.list[0].phone_number) {
        this.sendProductLinkBy('category', 'sms', this.customerListByCategory.list[0]);
      } else if (this.customerListByCategory.list[0].email) {
        this.sendProductLinkBy('category', 'email', this.customerListByCategory.list[0]);
      }
    }
  }
}
