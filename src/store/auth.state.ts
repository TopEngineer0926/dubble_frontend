import { Injectable } from '@angular/core';
import {Navigate} from '@ngxs/router-plugin';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import {Observable, of, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { AccountService } from '../app/services/account.service';
import {DetailResponse, ListResponse, UserResponse} from '../app/interfaces';
import { LocalStorageService } from '../app/services/core/local-storage.service';
import { User } from '../app/interfaces';
import {DeleteUserMedia, GetUserMedia, Login, Logout, SaveUserMedia, UpdateUser} from './auth.actions';
import { appRouteNames } from 'src/app/constants/app-route-names';
import {Media} from '../app/interfaces';
import {MediaService} from '../app/services/media.service';

export class UserStateModel {
  loggedIn = false;
  token: string;
  user: User;
  media: ListResponse<Media>;
  }

@State<UserStateModel>({
  name: 'auth',
  defaults: new UserStateModel()
})
@Injectable()
export class UserState implements NgxsOnInit {
  readonly appRouteNames = appRouteNames;

  constructor(
    private store: Store,
    private accountService: AccountService,
    private mediaService: MediaService,
    private localStorageService: LocalStorageService
  ) {}

  @Selector()
  static isLoggedIn(state: UserStateModel): boolean {
    return state.loggedIn;
  }

  @Selector()
  static user(state: UserStateModel): User {
    return state.user;
  }

  @Selector()
  static media(state: UserStateModel): ListResponse<Media> {
    return state.media;
  }

  @Selector()
  static token(state: UserStateModel): string {
    return state.token;
  }

  ngxsOnInit(ctx?: StateContext<any>): void {
    const token = this.localStorageService.get('dubble-token');
    const user = this.localStorageService.get('dubble-user');
    const media = this.localStorageService.get('dubble-media');
    const loggedIn = !!(token && user);

    if (token) {
      ctx.patchState({loggedIn, token, user, media});
    }
  }

  @Action(Login)
  login(ctx: StateContext<UserStateModel>, { payload }: Login): Observable<DetailResponse<UserResponse>> {
    return this.accountService.login(payload).pipe(
      tap(({detail}: DetailResponse<UserResponse>) => {
        const token = detail.token;
        this.localStorageService.set('dubble-user', detail.userModel);
        this.localStorageService.set('dubble-token', token);
        ctx.patchState({
          loggedIn: true,
          token,
          user: detail.userModel
        });

      }),
     // catchError((error) => ctx.dispatch(new LoginFailed(error)))
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<UserStateModel>): any {
    return this.accountService.logout().pipe(
      tap(() => {
        this.onLogout();
      }),
      catchError(error => {
        this.onLogout();
        this.store.dispatch(new Navigate(['/login']));
        return throwError('Invalid token');
      }));
  }

  @Action(UpdateUser)
  updateUser(ctx: StateContext<UserStateModel>, {payload}: UpdateUser): Observable<DetailResponse<User>> {
    return this.accountService.updateUser(payload).pipe(
      tap(({detail}: DetailResponse<User>) => {
        const state = {...ctx.getState()};
        state.user = detail;
        this.localStorageService.set('dubble-user', detail);
        ctx.patchState(state);
      }));
  }

  @Action(GetUserMedia)
  getUserMedia(ctx: StateContext<UserStateModel>, {id, query}: GetUserMedia): Observable<ListResponse<Media>> {
    return this.mediaService.getById('account', id, query).pipe(
      tap((response: ListResponse<Media>) => {
        const state = {...ctx.getState()};
        state.media = response;

        this.localStorageService.set('dubble-media', response);
        ctx.patchState(state);
      }));
  }

  @Action(SaveUserMedia)
  saveUserMedia(ctx: StateContext<UserStateModel>, {id, file}: SaveUserMedia): Observable<Media> {
    return this.mediaService.upload('account', id, file).pipe(
      tap((response: Media) => {

        const state = {...ctx.getState()};
        state.media = {
          ...state.media,
          list: [...state.media.list, response]
        };
        this.localStorageService.set('dubble-media', state.media);
        ctx.patchState(state);
      }));
  }

  @Action(DeleteUserMedia)
  deleteUserMedia(ctx: StateContext<UserStateModel>, {id}: DeleteUserMedia): Observable<Media> {
    return this.mediaService.deleteMedia('account', id).pipe(
      tap((response: Media) => {
        const state = {...ctx.getState()};
        let media = state.media.list;
        media = media.filter(img => img.itemid !== id);
        state.media = {
          ...state.media,
          list: media
        };
        this.localStorageService.set('dubble-media', state.media);
        ctx.patchState(state);
      }));
  }

  onLogout() {
    const reset = {
      auth: {
        loggedIn: false,
        token: null,
        user: null
      },
    };
    this.localStorageService.clear();
    this.store.reset(reset);
  }
}
