import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { CommonService } from '../../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private commonService: CommonService,
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) { }


  myPersonalVault(payload, is_params) {
    return this.commonService.getService(this.config.apiEndpoint + 'myPersonalVault', payload, is_params);
  }

  getVaultDetail(payload, is_params) {
    return this.commonService.getService(this.config.apiEndpoint + 'getVaultDetail', payload, is_params);
  }

  getFolderByUser(payload, is_params) {
    return this.commonService.getService(this.config.apiEndpoint + 'getFolderByUser', payload, is_params);
  }
  saveFolder(payload) {
    return this.commonService.createService(this.config.apiEndpoint + 'createFolder', payload);
  }
  updateFolder(payload) {
    return this.commonService.putService(this.config.apiEndpoint + 'updateFolder', payload);
  }


  getFolderDetail(payload, is_params) {
    return this.commonService.getService(this.config.apiEndpoint + 'getFolderData', payload, is_params);
  }

  writeFolder(payload) {
    return this.commonService.createService(this.config.apiEndpoint + 'writeFolder', payload);
  }

  deleteFolderData(payload) {
    return this.commonService.createService(this.config.apiEndpoint + 'deleteFolderData', payload);
  }

  assignMember(payload) {
    return this.commonService.createService(this.config.apiEndpoint + 'assignMember', payload);
  }

  getFolderData(payload, is_params) {
    return this.commonService.getService(this.config.apiEndpoint + 'getFolderDetail', payload, is_params);
  }
}
