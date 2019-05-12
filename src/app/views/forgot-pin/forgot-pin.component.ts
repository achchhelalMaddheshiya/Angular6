import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { CommonService } from '../../services/common.service';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ForgotPinModel } from '../../models/nominee';
import * as _ from 'lodash';
import { NomineeService } from '../../services/nominee/nominee.service';
import { DateInput } from 'ngx-bootstrap/chronos/test/chain';
import * as moment from 'moment';
@Component({
  selector: 'app-forgot-pin',
  templateUrl: './forgot-pin.component.html',
  styleUrls: ['./forgot-pin.component.scss'],
  providers: [
    NomineeService
  ]
})
export class ForgotPinComponent implements OnInit, AfterViewInit {
  public loading: Boolean = false;
  public forgotPinModel: ForgotPinModel = <ForgotPinModel>{};
  public row_id: Number;
  public maxDate = new Date(moment().format('YYYY-MM-DD'));
  @ViewChild('codeForm') codeForm; // signup form

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private nomineeService: NomineeService,
    private router: Router,
    private http: HttpClient) {
      this.route.params.subscribe(params => this.row_id = params.row_id);
     }

  ngOnInit() {
    setTimeout(() => {
      this.loading = true;
    }, 1000);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }


  save() {
    this.loading = true;
    this.forgotPinModel.row_id = this.row_id;

    const posted_date = this.forgotPinModel.dob;
    const start_date_selected = moment(posted_date).format('YYYY-MM-DD');
    const start_date = moment(start_date_selected).unix();
    this.forgotPinModel.dob = start_date;

    this.nomineeService.forgotPin(this.forgotPinModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.forgotPinModel.dob = posted_date;
        this.loading = false;
        if (data.status === 200) {
          this.codeForm.resetForm();
          this.commonService.response(data.message, 'success');
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.forgotPinModel.dob = posted_date;
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }
}
