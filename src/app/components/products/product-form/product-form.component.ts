import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact, Customer, CustomSection, ListResponse, Product, PublicationStatus, User } from '../../../interfaces';
import { QueryParams } from '../../../interfaces/base/base-object';
import { GetCustomers } from '../../../../store/customers/customers.actions';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { CustomersState } from '../../../../store/customers/customers.state';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { GetContacts } from '../../../../store/contacts/contacts.actions';
import { ContactsState } from '../../../../store/contacts/contacts.state';
import { UserState } from '../../../../store/auth.state';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { QuillModules } from 'ngx-quill';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { UnsavedChanges } from '../../../interfaces/base/unsaved-changes.class';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent extends UnsavedChanges implements OnInit, OnChanges, OnDestroy {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  productForm: FormGroup;
  @Input() product: Product;
  @Input() isLoading: boolean;
  @Output() submitEvent: EventEmitter<Product> = new EventEmitter<Product>();
  customersList: ListResponse<Customer>;
  contactsList: ListResponse<Contact>;
  params: QueryParams = { limit: 10, offset: 0 };
  contact = new FormControl('', Validators.required);
  customer = new FormControl();
  quillModules: QuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ list: 'ordered' }, { list: 'bullet' }],
    ]
  };
  filteredOptions$: Observable<any[]>;

  private subscription = new Subscription();

  get isCreateProduct(): boolean {
    return !this.product;
  }

  get isDraftProduct(): boolean {
    return this.product?.publication_status === PublicationStatus.draft;
  }

  get isPublishedProduct(): boolean {
    return this.product?.publication_status === PublicationStatus.published;
  }

  get reviews(): FormArray {
    return this.productForm?.get('reviews') as FormArray;
  }

  get press_infos(): FormArray {
    return this.productForm?.get('press_infos') as FormArray;
  }

  constructor(
    protected dialog: MatDialog,
    private formBuilder: FormBuilder,
    private store: Store,
    private snackBarService: SnackBarService,
    private translateService: TranslateService) {
    super(dialog);
  }

  ngOnInit(): void {
    this.getCustomers(this.params);
    this.getContacts(this.params);
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.product && !changes.product.firstChange) {
      this.checkProduct();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy();
  }

  openPanel() {
    this.autocompleteTrigger.openPanel();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      contact: this.formBuilder.group({
        email: ['', Validators.required],
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        phone_number: ['', Validators.required],
        itemid: '',
        type: ''
      }),
      custom_text: ['', Validators.required],
      customer: this.formBuilder.group({
        email: [''],
        firstname: [''],
        lastname: [''],
        phone_number: [''],
        itemid: '',
        type: ''
      }),
      internal_page_title: ['', Validators.required],
      video_section_headline: [''],
      greeting: ['', Validators.required],
      headline: ['', Validators.required],
      press_info_section_name: [''],
      press_infos: this.formBuilder.array([]),
      publication_status: ['DRAFT', Validators.required],
      review_section_name: [''],
      reviews: this.formBuilder.array([]),
      share_code: [''],
      user_id: [this.store.selectSnapshot<User>(UserState.user).itemid, Validators.required],
      itemid: ['']
    });

    this.checkProduct();

    this.subscription.add(this.contact.valueChanges.subscribe((contact) => {
      this.productForm.patchValue({
        contact
      });
    }));

    this.subscription.add(this.customer.valueChanges.subscribe((customer) => {
      this.productForm.patchValue({
        customer
      });
    }));
    this.trackChanges(this.productForm);
  }

  checkProduct() {
    if (this.product) {
      this.clearFormArray(this.reviews);
      this.clearFormArray(this.press_infos);
      this.product.reviews.forEach(() => this.addReviewControl());
      this.product.press_infos.forEach(() => this.addPressInfoControl());
      this.productForm.patchValue({
        ...this.product,
        customer: this.product.customer || {}
      }, { emitEvent: false });
      const contact = this.contactsList?.list.find(({itemid}) => itemid === this.product.contact.itemid);
      this.contact.patchValue(contact || this.product.contact, { emitEvent: false });
      this.customer.patchValue(this.product.customer, { emitEvent: false });
      this.productForm.markAsPristine();
      this.productForm.markAsUntouched();
    }
  }

  saveDraftProduct() {
    if (this.checkIsInvalid()) {
      const message = this.translateService.instant('COMMON.FillRequiredFields');
      this.snackBarService.error(message);
      return;
    }
    const formData = this.getFormData();
    this.submitEvent.emit({
      ...formData,
      publication_status: PublicationStatus.draft
    });
  }

  publishProductPage() {
    if (this.checkIsInvalid()) {
      const message = this.translateService.instant('COMMON.FillRequiredFields');
      this.snackBarService.error(message);
      return;
    }
    const formData = this.getFormData();
    this.submitEvent.emit({
      ...formData,
      publication_status: PublicationStatus.published
    });
  }

  addReviewControl() {
    const group = this.formBuilder.group({
      button_text: '',
      head_line: '',
      custom_text: '',
      link: '',
    });
    this.reviews.push(group);
  }

  addPressInfoControl() {
    const group = this.formBuilder.group({
      button_text: '',
      head_line: '',
      custom_text: '',
      link: '',
    });
    this.press_infos.push(group);
  }

  getCustomers(query: QueryParams): void {
    this.subscription.add(
      this.store.dispatch(new GetCustomers(query)).pipe(
        switchMap(() => this.store.select(CustomersState.customersList)),
        tap((customers) => {
          this.customersList = customers;
          if (this.product?.customer) {
            const customer = this.customersList.list.find(({ itemid }) => itemid === this.product.customer.itemid);
            this.customer.patchValue(customer, { emitEvent: false });
          }
          this.filteredOptions$ = this.customer.valueChanges.pipe(
            startWith(this.customer.value),
            map((value) => this.filterCustomersFn(value))
          );
        })).subscribe()
    );
  }

  getContacts(query: QueryParams): void {
    this.subscription.add(
      this.store.dispatch(new GetContacts(query)).pipe(
        switchMap(() => this.store.select(ContactsState.contactsList)),
        tap((contacts) => {
          this.contactsList = contacts;
          if (this.product?.contact) {
            const contact = this.contactsList.list.find(({ itemid }) => itemid === this.product.contact.itemid);
            this.contact.patchValue(contact, { emitEvent: false });
          }
        })).subscribe()
    );
  }

  displayCustomerFn(option: Customer): string {
    return typeof option === 'string' ? option : option && `${ option.firstname } ${ option.lastname }` || '';
  }

  getIconName(): string {
    if (this.autocompleteTrigger?.panelOpen) {
      return 'arrow_drop_up';
    } else {
      return 'arrow_drop_down';
    }
  }

  private getFormData(): Product {
    const formData = {
      ...this.productForm.value
    };
    if (Object.values(formData.customer).every((value: string) => !value?.trim().length)) {
      formData.customer = null;
    }

    this.validateUrls(formData.reviews);
    this.validateUrls(formData.press_infos);
    this.validateEmptyFields(formData);
    this.validateEmptyFields(formData.customer);
    return formData;
  }

  private validateEmptyFields(target: object): void {
    if (!target || typeof target !== 'object') {
      return;
    }
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        if (target[key] === undefined || (typeof target[key] === 'string' && target[key].trim() === '')) {
          target[key] = null;
        }
      }
    }
  }

  private validateUrls(target: CustomSection[]): void {
    const urlRegExp = /^(http:\/\/|https:\/\/)/i;
    target.forEach((item) => {
      if (!urlRegExp.test(item.link) && item.link?.trim()) {
        item.link = `https://${ item.link }`;
      }
    });
  }

  private checkIsInvalid(): boolean {
    this.productForm.markAllAsTouched();
    this.contact.markAllAsTouched();
    return (this.productForm.invalid || this.contact.invalid || this.isLoading);
  }

  private filterCustomersFn(searchValue) {
    if (!searchValue) {
      return this.customersList.list;
    } else {
      return this.customersList.list
        .filter((item) =>
          this.displayCustomerFn(item).toLowerCase().includes(this.displayCustomerFn(searchValue).toLowerCase()));
    }
  }

  private clearFormArray(formArray: FormArray) {
    formArray.clear();
  }
}

