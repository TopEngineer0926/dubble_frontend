import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { AppInitService } from './app.init';
import { MaterialModule } from './modules/material.module';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgSkeletonModule } from 'ng-skeleton';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { environment } from '../environments/environment';
import { UserState } from '../store/auth.state';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ContactsState } from '../store/contacts/contacts.state';
import { CustomersState } from '../store/customers/customers.state';
import { ProductsState } from '../store/products/products.state';
import { SharedModule } from './modules/shared/shared.module';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function init_app(appLoadService: AppInitService) {
  return () => appLoadService.init();
}


@NgModule({
  declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        NgSkeletonModule,
        MatIconModule,
        TranslateModule.forRoot({
            defaultLanguage: 'de',
            loader: {
                provide: TranslateLoader,
                deps: [HttpClient],
                useFactory: createTranslateLoader,
            },
        }),
        NgxsModule.forRoot([
            UserState,
            ContactsState,
            CustomersState,
            ProductsState,
        ], { developmentMode: !environment.production }),
        NgxsRouterPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot(),
        NgxsLoggerPluginModule.forRoot(),
        SharedModule
    ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppInitService],
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer){
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }
}
