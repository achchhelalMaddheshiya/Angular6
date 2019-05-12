import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, Input, AfterContentInit } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DateInput } from 'ngx-bootstrap/chronos/test/chain';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { DeleteFamilyMember } from '../../models/family-members';

import { CommonService } from '../../services/common.service';
import { FamilyMemberService } from '../../services/family-member/family-member.service';

import { DashboardService } from '../../services/dashboard/dashboard.service';
import { AddLocationModel } from '../../models/vault';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-member-listing',
  templateUrl: './delete-member-listing.component.html',
  styleUrls: ['./delete-member-listing.component.scss'],
  providers: [
    CommonService,
    FamilyMemberService
  ]
})
export class DeleteMemberListingComponent implements OnInit, AfterViewInit {
  public deleteFamilyMember: DeleteFamilyMember = <DeleteFamilyMember>{};
  public data: any;
  @Input() id: any;
  @Output() deletedEmitter: EventEmitter<any> = new EventEmitter();
  public loading: Boolean = false;
  constructor(@Inject(APP_CONFIG) private config: AppConfig,
    private commonService: CommonService,
    private familyMemberService: FamilyMemberService,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef,
    private http: HttpClient) { }

  ngOnInit() {
    this.loading = true;
    this.getDetail(this.id);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  getDetail(id) {
    this.loading = true;
    this.commonService.getService(this.config.apiEndpoint + 'getUserFolderWithPermissions', { id: id }, true)
      .pipe(map(response => response.body))
      .subscribe(response => {
        this.loading = false;
        if (response.status === 200) {
          this.data = response.data;
        } else {
          this.commonService.response(response.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }


  deleteMember(id) {
    this.deleteFamilyMember.id = id;
    this.familyMemberService.deleteMember(this.deleteFamilyMember)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.commonService.response(data.message, 'success');
          this.deletedEmitter.emit();
          this.commonService.closeSwal(2000);
          setTimeout(() => {
            this.bsModalRef.hide();
          }, 2000);
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }
}
