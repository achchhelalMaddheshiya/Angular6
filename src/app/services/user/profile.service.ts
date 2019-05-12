import { Injectable, Inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';
import { FamilyModel } from '../../models/user';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) { }


  requestDataFromMultipleSources(queue) {
    return forkJoin(queue);
  }


  createFamily(request: FamilyModel) {
    return this.commonService.createService(this.config.apiEndpoint + 'createFamily', request);
  }
}
