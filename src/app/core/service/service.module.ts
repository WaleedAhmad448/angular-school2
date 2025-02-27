import {NgModule, Optional, SkipSelf} from '@angular/core';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';
import { ErrorHandlerInterceptor } from '../interceptor/error-handler.interceptor';
import { AuthInterceptor } from '../interceptor/auth.interceptor';
import { LoadingInterceptor } from '../interceptor/LoadingInterceptor';

@NgModule({
  imports: [
  ],
  declarations: [],
  providers: [
    AuthService,
    LoadingService,
    // {provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},

  ]
})
export class ServiceModule {

  constructor(@Optional() @SkipSelf() parentModule: ServiceModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Services module in the AppModule only.`);
    }
  }

}
