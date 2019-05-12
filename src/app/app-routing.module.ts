import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MyHttpInterceptor } from './services/http.interceptor';
import { AuthService } from './services/auth.service';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

import { ROUTES, PROVIDERS } from './app-routing';

@NgModule({
  imports: [
    CommonModule,
    ROUTES,
    HttpClientModule
  ],
  exports: [RouterModule],
  providers: [
    AuthService,
    AuthGuard,
    PROVIDERS,
    { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true }
  ],
  declarations: []
})
export class AppRoutingModule { }
