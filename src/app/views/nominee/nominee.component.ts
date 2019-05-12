import { Component, OnInit, Input, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType, HttpEvent, HttpHeaders } from '@angular/common/http';
import { map, debounceTime, distinctUntilChanged, mergeMap, tap } from 'rxjs/operators';
import { NomineeModel } from '../../models/nominee';
import { Subject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import * as _ from 'lodash';
import { NomineeService } from '../../services/nominee/nominee.service';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { DeclareUserComponent } from '../declare-user/declare-user.component';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-nominee',
  templateUrl: './nominee.component.html',
  styleUrls: ['./nominee.component.scss'],
  providers: [
    CommonService,
    NomineeService
  ]
})
export class NomineeComponent implements OnInit, AfterViewInit {
  public loading: Boolean = false;
  public total: Number = 0;
  public page: Number = 1;
  public limit: Number = 1;
  public search_val = '';
  public is_owner: Number;
  public searchTextChanged = new Subject;
  public subscription: any;
  public my_vault_data: NomineeModel = <NomineeModel>{};
  public bsModalRef: BsModalRef;
  @ViewChild(NgForm) contactForm: NgForm;

  constructor(
    private commonService: CommonService,
    private nomineeService: NomineeService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private modalService: BsModalService,
    @Inject(APP_CONFIG) private config: AppConfig) { }

  ngOnInit() {
    this.getDetail(1, '');

    this.subscription = this.searchTextChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((data: any) => {
        this.getDetail(1, data);
      });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  search($event) {
    this.searchTextChanged.next($event.target.value);
  }


  getDetail(page: Number = 1, search: any): any {
    this.loading = true;
    this.nomineeService
      .getNominee(
        {
          page: page,
          search: search !== undefined ? search : ''
        },
        true
      )
      .pipe(map((data) => data.body))
      .subscribe(
        (data: any) => {
          this.loading = false;
          if (data.status === 200) {
            this.my_vault_data = data.data.data;
            this.total = data.data.total;
            this.page = data.data.current_page;
            this.limit = data.data.per_page;
          } else {
            this.commonService.response(data.message, 'error');
          }
        },
        (error) => {
          this.loading = false;
          this.commonService.response(error.message, 'error');
        }
      );
  }

  declareDeadUser(data, index) {

    if (data.family_type_detail.slug === 'primary') {
      this.my_vault_data[index].sender_detail.temp_primary_declaration = false;
    }

    if (data.family_type_detail.slug === 'guarantee') {
      this.my_vault_data[index].sender_detail.temp_guarantee_declaration = false;
    }

    const initialState = {
      invited_by: data.sender_detail.id,
      row_id: data.id,
      // title: 'Pin',
      closeBtnName: 'Close'
    };
    this.bsModalRef = this.modalService.show(DeclareUserComponent, { initialState });
    this.bsModalRef.content.pinAddedEmitter.subscribe(this.onMemberAdded.bind(this));
  }

  onMemberAdded() {
    this.getDetail(1, '');
  }

}
