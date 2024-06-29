import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {AccountNameTransform, AppComponent} from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {TelegramApiServiceService} from "./services/telegram-api-service.service";
import {PortalApiService} from "./services/portal-api.service";
import {MatTreeModule} from "@angular/material/tree";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {ErrorService} from "./services/error.service";
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatProgressBar} from "@angular/material/progress-bar";
import {TranslateLoader, TranslateModule, TranslateStore} from "@ngx-translate/core";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFormFieldModule} from '@angular/material/form-field';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {authInterceptor} from "./services/auth.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  // return new TranslateHttpLoader(http,'../assets/locale/', '.json')
  return new TranslateHttpLoader(http, './assets/spa2/assets/locale/');
}


@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        MatTreeModule,
        MatFormField,
        MatIcon,
        MatProgressBar,
        TranslateModule,
        MatSelect,
        MatOption,
        AccountNameTransform,
        MatCheckbox,
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatFormFieldModule,
        TranslateModule.forRoot({
            defaultLanguage: 'ru',
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        MatProgressSpinner,
    ],
  providers: [TelegramApiServiceService, PortalApiService, provideAnimationsAsync(),
              ErrorService,  provideHttpClient(withInterceptors([authInterceptor])), TranslateStore],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],

})
export class AppModule { }
