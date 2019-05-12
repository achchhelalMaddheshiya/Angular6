import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { CommonService } from '../../services/common.service';
import { PinModel, ForgotPinModel } from '../../models/nominee';

@Injectable({
  providedIn: 'root'
})
export class NomineeService {

  constructor(
    private commonService: CommonService,
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) { }


  getNominee(payload, is_params) {
    return this.commonService.getService(this.config.apiEndpoint + 'getNominee', payload, is_params);
  }

  save(request: PinModel) {
    return this.commonService.createService(this.config.apiEndpoint + 'declareUser', request);
  }
  forgotPin(request: ForgotPinModel) {
    return this.commonService.createService(this.config.apiEndpoint + 'forgotPin', request);
  }
}
