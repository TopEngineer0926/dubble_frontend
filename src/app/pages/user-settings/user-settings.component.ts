import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';

import { Logout, UpdateUser } from '../../../store/auth.actions';
import { SnackBarService } from '../../services/core/snackbar.service';
import { ComponentCanDeactivate, ListResponse, Media, User } from '../../interfaces';
import { UserState } from '../../../store/auth.state';
import { AccountService } from '../../services/account.service';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { LocalStorageService } from '../../../app/services/core/local-storage.service';

export interface Category {
    name: string;
}

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
    user: User = this.store.selectSnapshot<User>(UserState.user);
    logo: Media;
    userEmail: string;
    appRouteNames = appRouteNames;
    private subscription = new Subscription();

    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER] as const;
    categoryList: Category[] = [];
    protected categoryUrl = environment.apiUrl + 'account/category';

    constructor(private store: Store,
        private accountService: AccountService,
        private snackBarService: SnackBarService,
        protected httpClient: HttpClient,
        private translateService: TranslateService,
        private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.userEmail = this.user?.email;
        this.subscription.add(
            this.store.select<ListResponse<Media>>(UserState.media).subscribe(media => this.logo = media?.list[0]));
        this.getCategory();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    canDeactivate() {
        const hasAllDataRequired = Boolean(this.logo && this.user?.main_color && this.user.secondary_color);
        if (!hasAllDataRequired) {
            const warning = this.translateService.instant(`SETTINGS.MissingRequiredFields`);
            this.snackBarService.error(warning);
        }
        return hasAllDataRequired;
    }

    saveSettings(form): void {
        this.subscription.add(
            this.store.dispatch(new UpdateUser(form)).pipe(
                tap((data) => {
                    if (this.userEmail !== data.auth.user.email) {
                        const warning = this.translateService.instant(`SETTINGS.EmailUpdatedWarning`);
                        this.snackBarService.warn(warning);
                        return this.store.dispatch(new Logout());
                    }
                    const message = this.translateService.instant(`SETTINGS.UserUpdated`);
                    this.snackBarService.success(message);
                })
            ).subscribe((data) => {
                this.user = form;
            },
                error => {
                    this.snackBarService.error(error.error?.message || error.message);
                }));
    }

    changeUserPwd(event) {
        this.subscription.add(
            this.accountService.changePassword({ newPassword: event.newPassword, currentPassword: event.currentPassword })
                .subscribe(data => {
                    const message = this.translateService.instant(`SETTINGS.PasswordChanged`);
                    this.snackBarService.success(message);
                },
                    error => {
                        this.snackBarService.error(error.error?.message || error.error);
                    }));
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add our category
        if (value && this.categoryList.findIndex(e => e.name == value) < 0) {
            this.categoryList.push({ name: value });
        }

        // Clear the input value
        event.input.value = '';
    }

    remove(category: Category): void {
        const index = this.categoryList.indexOf(category);

        if (index >= 0) {
            this.categoryList.splice(index, 1);
        }
    }

    updateCategory() {
        if (this.categoryList.length > 0) {
            var data = [];
            this.categoryList.map(e => { data.push(e.name); })
            var body = {
                category: data.join("|")
            }

            this.httpClient.put(`${this.categoryUrl}`, body)
            .subscribe(() => {
                this.getCategory();
                const message = this.translateService.instant("CATEGORY.CreatedSuccess");
                this.snackBarService.success(message);
            },
            error => {
                const message = this.translateService.instant("CATEGORY.CreatedFail");
                this.snackBarService.success(message);
            });
        }
    }

    resetCategory() {
        if (this.categoryList.length > 0) {
            var body = {
                category: ""
            }

            this.httpClient.put(`${this.categoryUrl}`, body)
            .subscribe(() => {
                this.getCategory();
                const message = this.translateService.instant("CATEGORY.CreatedSuccess");
                this.snackBarService.success(message);
            },
            error => {
                const message = this.translateService.instant("CATEGORY.CreatedFail");
                this.snackBarService.success(message);
            });
        }
    }

    getCategory() {
        this.httpClient.get<any>(this.categoryUrl)
        .subscribe((response) => {
            this.categoryList = [];
            if (response.result) {
                var data = response.result.split("|");
                data.map((d) => {
                    this.categoryList.push({name: d});
                })
            }
            this.localStorageService.set('category-list', this.categoryList);
        },
        error => {
            this.snackBarService.error(error.error?.message || error.message)
        });
    }
}
