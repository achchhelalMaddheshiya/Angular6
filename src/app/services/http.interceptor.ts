import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { IfStmt } from '@angular/compiler';
import * as _ from 'lodash';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

    public _auth: AuthService;
    constructor(
        private injector: Injector,
        private router: Router,
    ) { setTimeout(() => this._auth = injector.get(AuthService)); }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /* Check HttpResponse and perform actions like redirect if token expired . set header on login req. response */

        return next.handle(this.setAuthorizationHeader(req)).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                if (event.body.status && event.body.status === 200) {
                    const allowed_url = ['/about', '/faq', '/contact-us', '/nominee'];
                    const allowed_url_after_dead = ['/contact-us', '/nominee'];
                    if (_.includes(allowed_url, this.router.url) === false && event.body.is_expired === 101) {
                        this.router.navigate(['/packages']);
                        return event;
                    }

                    if (_.includes(allowed_url_after_dead, this.router.url) === false && event.body.is_expired === 102) {
                        this.router.navigate(['/nominee']);
                        return event;
                    }

                    const token = event.headers.get('access_token');
                    if (token) {
                        this._auth.storeUserInfo(event, req.body);
                    }
                    return event;
                }
                if (event.body.status && event.body.status === 403) {
                    this.router.navigate(['/profile/edit/']);
                    return;
                }
            }
        }), catchError((response) => {
            if (response instanceof HttpErrorResponse) {
                switch (response.status) {
                    case 0: {
                        return throwError({ status: response.status, message: response.message });
                    }
                    case 400: {
                        return throwError({ status: response.error.status, message: response.error.message });
                    }
                    case 401: {
                        const auth_service = this.injector.get(AuthService);
                        auth_service.removeUserInfo();
                        this.router.navigate(['/login']);
                        return throwError({ status: response.status, message: response.statusText });
                    }
                    default: {
                        return throwError(response);
                    }
                }
            }
        })
        );
    }

    // Request Interceptor to append Authorization Header
    private setAuthorizationHeader(req: HttpRequest<any>): HttpRequest<any> {
        const Authorization = (JSON.parse(localStorage.getItem('userInfo')) === null
            || JSON.parse(localStorage.getItem('userInfo')) === undefined) ? '' : JSON.parse(localStorage.getItem('userInfo'));
        // Attach headers to the request
        if (Authorization) {
            req = req.clone({
                headers: req.headers.set('Authorization',
                    (Authorization.token !== undefined) ? 'Bearer ' + Authorization.token : '')
            });
        }
        if (req.body instanceof FormData) {

        } else {
            if (!req.headers.has('Content-Type')) {
                req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
            }
        }

        req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
        return req;
    }
}
