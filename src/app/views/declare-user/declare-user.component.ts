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
import { NomineeModel, PinModel } from '../../models/nominee';
import * as _ from 'lodash';
import { NomineeService } from '../../services/nominee/nominee.service';

@Component({
  selector: 'app-declare-user',
  templateUrl: './declare-user.component.html',
  styleUrls: ['./declare-user.component.scss'],
  providers: [
    NomineeService
  ]
})
export class DeclareUserComponent implements OnInit, AfterViewInit {
  @Input() invited_by: Number;
  @Input() row_id: Number;
  public loading: Boolean = false;
  public pinModel: PinModel = <PinModel>{};
  @Output() pinAddedEmitter: EventEmitter<any> = new EventEmitter();
  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private nomineeService: NomineeService,
    private modalService: BsModalService,
    private router: Router,
    private http: HttpClient,
    public bsModalRef: BsModalRef) { }

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
    this.pinModel.row_id = this.row_id;
    this.pinModel.invited_by = this.invited_by;
    this.nomineeService.save(this.pinModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          setTimeout(() => {
            this.bsModalRef.hide();
            this.pinAddedEmitter.emit();
          }, 2000);
          this.commonService.response(data.message, 'success');
          this.commonService.closeSwal(2000);
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }
}
