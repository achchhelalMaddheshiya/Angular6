import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { CommonService } from '../../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(
    private commonService: CommonService,
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) { }


  contactUs(payload) {
    return this.commonService.createService(this.config.apiEndpoint + 'contactUs', payload);
  }
}
