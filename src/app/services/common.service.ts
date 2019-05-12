import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient, private router: Router) { }
  private emitChangeSource = new Subject<any>();
  changeEmitted$ = this.emitChangeSource.asObservable();

  /*
    POST REQUEST
  */
  createService(url: string, param: any): Observable<any> {
    const body = JSON.stringify(param);
    return this.http.post(url, body, { observe: 'response' });
  }

  arrayObjectToString = function (obj) {
    const results = [];
    _.forOwn(obj, (value, key) => {
      results.push(`${key}=${encodeURIComponent(value)}`);
    });
    return results.join('&');
  };

  /*
   PUT REQUEST
  */
  putService(url: string, param: any): Observable<any> {
    const body = JSON.stringify(param);
    return this.http.put(url, body, { observe: 'response' });
  }
  /*
    GET REQUEST
  */
  getService(url: string, param: any, isParams?: boolean): Observable<any> {
    if (isParams && isParams === true) {
      return this.http.get(url + '?' + this.arrayObjectToString(param), { observe: 'response' });
    } else {
      return this.http.get(url, { observe: 'response' });
    }
  }

  getPackages(url: string, param: any, isParams?: boolean): Observable<any> {
    if (isParams && isParams === true) {
      return this.http.get(url + '?' + this.arrayObjectToString(param), { observe: 'response' });
    } else {
      return this.http.get(url, { observe: 'response' });
    }
  }

  /*
    DELETE REQUEST
  */

  deleteService(url: string, param: any): Observable<any> {
    return this.http.delete(url + '?' + this.arrayObjectToString(param), { observe: 'response' });
  }

  /*
   FILE REQUEST
 */

  uploadFile(url: string, param: any) {
    return this.http.post(url, param);
  }

  /*
   Time Out With redirection
 */

  redirect(url: string) {
    setTimeout(() => {
      this.router.navigate([url]);
    }, 500);
  }

  redirectWithTimeout(url: string, alert: Boolean = false, delay: number = 3000) {
    setTimeout(() => {
      if (alert === true) {
        Swal.close();
      }
      this.router.navigate([url]);
    }, delay);
  }

  response(data: string, type: string) {
    console.log(data, type);
    if (type && type.toLowerCase() === 'success') {
      Swal('Success!', data, 'success');
    } else {
      Swal('Oops!', data, 'error');
    }
  }

  closeSwal(delay: number = 3000) {
    setTimeout(() => {
      Swal.close();
    }, delay);
  }

  queueRequest(queue) {
    return forkJoin(queue);
  }

}
