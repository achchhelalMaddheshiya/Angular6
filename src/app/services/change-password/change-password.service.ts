import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ChangePasswordModel } from '../../models/user';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { CommonService } from '../../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(
    private commonService: CommonService,
    private http: HttpClient,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfig
  ) { }


  changePassword(user: ChangePasswordModel) {
    return this.commonService.putService(this.config.apiEndpoint + 'changePassword', user);
  }
}
