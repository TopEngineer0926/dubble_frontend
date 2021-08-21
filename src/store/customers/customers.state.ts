import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DetailResponse, ListResponse, Media } from '../../app/interfaces';
import { MediaService } from '../../app/services/media.service';
import { Customer } from '../../app/interfaces/customer';
import { CustomerService } from '../../app/services/customer.service';
import {
  AddCustomer,
  DeleteCustomerById,
  DeleteCustomerMedia,
  GetCustomerById,
  GetCustomers,
  SaveCustomerMedia,
  UpdateCustomer
} from './customers.actions';


export class CustomersStateModel {
  customers: ListResponse<Customer>;
  currentCustomer: {
    customer: Customer;
    media: ListResponse<Media>;
  };
}

@State<CustomersStateModel>({
  name: 'customers',
  defaults: new CustomersStateModel()
})
@Injectable()
export class CustomersState {

  constructor(
    private store: Store,
    private customersService: CustomerService,
    private mediaService: MediaService
  ) {
  }

  @Selector()
  static customersList(state: CustomersStateModel): ListResponse<Customer> {
    return state.customers;
  }

  @Selector()
  static currentCustomer(state: CustomersStateModel): { customer: Customer, media: ListResponse<Media> } {
    return state.currentCustomer;
  }

  @Action(GetCustomers)
  getCustomers(ctx: StateContext<CustomersStateModel>, { query }: GetCustomers): Observable<ListResponse<Customer>> {
    return this.customersService.getCustomers(query).pipe(
      tap((response: ListResponse<Customer>) => {
        const state = { ...ctx.getState() };
        state.customers = response;
        state.customers.list.sort(({ itemid: a }, { itemid: b }) => a > b ? 1 : -1);
        ctx.patchState(state);
      }));
  }

  @Action(GetCustomerById)
  getCustomerById(ctx: StateContext<CustomersStateModel>, { id }: GetCustomerById): Observable<any> {
    return combineLatest([
      this.customersService.getById(id),
      this.mediaService.getById('customer', id, { limit: 1, offset: 0 })]).pipe(
      tap(([{ detail }, media]) => {
        let state = { ...ctx.getState() };
        state = {
          ...state,
          currentCustomer: {
            customer: detail,
            media
          }
        };
        ctx.patchState(state);
      }));
  }

  @Action(AddCustomer)
  addCustomer(ctx: StateContext<CustomersStateModel>, { payload }: AddCustomer): Observable<DetailResponse<Customer>> {
    return this.customersService.addCustomer(payload).pipe(
      tap(({ detail }: DetailResponse<Customer>) => {
        let state = { ...ctx.getState() };
        state = {
          ...state,
          currentCustomer: {
            customer: detail,
            media: null
          }
        };
        ctx.patchState(state);
      }));
  }

  @Action(UpdateCustomer)
  updateCustomer(ctx: StateContext<CustomersStateModel>, { payload }: UpdateCustomer): Observable<DetailResponse<Customer>> {
    return this.customersService.updateCustomer(payload).pipe(
      tap(({ detail }: DetailResponse<Customer>) => {

        let state = { ...ctx.getState() };
        state = {
          ...state,
          currentCustomer: {
            customer: detail,
            media: state.currentCustomer?.media
          }
        };
        ctx.patchState(state);
      }));
  }

  @Action(DeleteCustomerById)
  deleteCustomerById(ctx: StateContext<CustomersStateModel>, { id }: DeleteCustomerById): Observable<any> {
    return this.customersService.deleteById(id).pipe(
      tap(() => {
        let state = { ...ctx.getState() };
        state = {
          ...state,
          currentCustomer: null,
          customers: {
            ...state.customers,
            list: state.customers.list.filter(({itemid}) => itemid !== id)
          }
        };
        ctx.patchState(state);
      }));
  }

  @Action(SaveCustomerMedia)
  saveUserMedia(ctx: StateContext<CustomersStateModel>, { id, file }: SaveCustomerMedia): Observable<Media> {
    return this.mediaService.upload('customer', id, file).pipe(
      tap((response: Media) => {
        const state = { ...ctx.getState() };
        state.currentCustomer = { ...state.currentCustomer };
        state.currentCustomer.media = {
          ...state.currentCustomer.media,
          list: [...state.currentCustomer.media.list, response]
        };

        ctx.patchState(state);
      }));
  }

  @Action(DeleteCustomerMedia)
  deleteUserMedia(ctx: StateContext<CustomersStateModel>, { id }: DeleteCustomerMedia): Observable<Media> {
    return this.mediaService.deleteMedia('customer', id).pipe(
      tap((response: Media) => {
        const state = { ...ctx.getState() };
        state.currentCustomer = { ...state.currentCustomer };
        let media = state.currentCustomer.media.list;
        media = media.filter(img => img.itemid !== id);
        state.currentCustomer.media = {
          ...state.currentCustomer.media,
          list: media
        };
        ctx.patchState(state);
      }));
  }

}
