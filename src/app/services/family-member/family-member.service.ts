
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { FamilyMembersModel, DeleteFamilyMember, SwapFamilyMember } from '../../models/family-members';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { CommonService } from '../../services/common.service';
import { FamilyModel } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class FamilyMemberService {

  constructor(
    private commonService: CommonService,
    private http: HttpClient,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfig
  ) { }

  updateFamily(request: FamilyModel) {
    return this.commonService.putService(this.config.apiEndpoint + 'editFamilyProfile', request);
  }

  deleteMember(request: DeleteFamilyMember) {
    return this.commonService.createService(this.config.apiEndpoint + 'deleteMember', request);
  }

  swapUser(request: SwapFamilyMember) {
    return this.commonService.putService(this.config.apiEndpoint + 'swapUser', request);
}

}

