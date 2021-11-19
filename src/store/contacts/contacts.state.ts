import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ContactsService } from '../../app/services/contacts.service';
import {
  AddContact,
  DeleteContactMedia,
  GetContactById,
  GetContacts,
  SaveContactMedia,
  UpdateContact
} from './contacts.actions';
import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DetailResponse, ListResponse, Media } from '../../app/interfaces';
import { Contact } from '../../app/interfaces';
import { MediaService } from '../../app/services/media.service';


export class ContactsStateModel {
  contacts: ListResponse<Contact>;
  currentContact: {
    contact: Contact;
    media: ListResponse<Media>;
  };
}

@State<ContactsStateModel>({
  name: 'contacts',
  defaults: new ContactsStateModel()
})
@Injectable()
export class ContactsState  {

  constructor(
    private store: Store,
    private contactsService: ContactsService,
    private mediaService: MediaService
  ) {
  }

  @Selector()
  static contactsList(state: ContactsStateModel): ListResponse<Contact> {
    return state.contacts;
  }

  @Selector()
  static currentContact(state: ContactsStateModel): {contact: Contact, media: ListResponse<Media>} {
    return state.currentContact;
  }

  @Action(GetContacts)
  getContacts(ctx: StateContext<ContactsStateModel>, {query}: GetContacts): Observable<ListResponse<Contact>> {
    return this.contactsService.getContacts(query).pipe(
      tap((response: ListResponse<Contact>) => {
        const state = {...ctx.getState()};
        state.contacts = response;
        // state.contacts.list.sort(({ itemid: a }, { itemid: b }) => a > b ? 1 : -1);
        ctx.patchState(state);
      }));
  }

  @Action(GetContactById)
  getContactById(ctx: StateContext<ContactsStateModel>, {id}: GetContactById): Observable<any> {
     return combineLatest([
       this.contactsService.getById(id),
       this.mediaService.getById('contact', id, {limit: 1, offset: 0})]).pipe(
         tap(([{detail}, media]) => {
           let state = {...ctx.getState()};
           state = {
             ...state,
             currentContact: {
               contact: detail,
               media
             }
           };
           ctx.patchState(state);
    }));
  }

  @Action(AddContact)
  addContact(ctx: StateContext<ContactsStateModel>, {payload}: AddContact): Observable<DetailResponse<Contact>> {
    return this.contactsService.addContact(payload).pipe(
      tap(({detail}: DetailResponse<Contact>) => {
        let state = {...ctx.getState()};
        state = {
          ...state,
        currentContact: {
            contact: detail,
            media: null
          }
        };
        ctx.patchState(state);
      }));
  }

  @Action(UpdateContact)
  updateContact(ctx: StateContext<ContactsStateModel>, {payload}: UpdateContact): Observable<DetailResponse<Contact>> {
    return this.contactsService.updateContact(payload).pipe(
      tap(({detail}: DetailResponse<Contact>) => {

        let state = {...ctx.getState()};
        state = {
          ...state,
        currentContact: {
            contact: detail,
            media: state.currentContact.media
          }
        };
        ctx.patchState(state);
      }));
  }

  @Action(SaveContactMedia)
  saveUserMedia(ctx: StateContext<ContactsStateModel>, {id, file}: SaveContactMedia): Observable<Media> {
    return this.mediaService.upload('contact', id, file).pipe(
      tap((response: Media) => {
        const state = {...ctx.getState()};
        state.currentContact = {...state.currentContact};
        state.currentContact.media = {
          ...state.currentContact.media,
          list: [...state.currentContact.media.list, response]
        };

        ctx.patchState(state);
      }));
  }

  @Action(DeleteContactMedia)
  deleteUserMedia(ctx: StateContext<ContactsStateModel>, {id}: DeleteContactMedia): Observable<Media> {
    return this.mediaService.deleteMedia('contact', id).pipe(
      tap((response: Media) => {
        const state = {...ctx.getState()};
        state.currentContact = {...state.currentContact};
        let media = state.currentContact.media.list;
        media = media.filter(img => img.itemid !== id);
        state.currentContact.media = {
          ...state.currentContact.media,
          list: media
        };
        ctx.patchState(state);
      }));
  }

}
