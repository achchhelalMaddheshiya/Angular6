import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, Input, AfterContentInit } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { DeleteFamilyMember, SwapFamilyMember, AssignMembersModel } from '../../models/family-members';

import { CommonService } from '../../services/common.service';
import { FamilyMemberService } from '../../services/family-member/family-member.service';

import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-swap-role',
  templateUrl: './swap-role.component.html',
  styleUrls: ['./swap-role.component.scss'],
  providers: [
    CommonService,
    FamilyMemberService
  ]
})
export class SwapRoleComponent implements OnInit, AfterViewInit {
  public deleteFamilyMember: DeleteFamilyMember = <DeleteFamilyMember>{};
  public swapFamilyMember: SwapFamilyMember = <SwapFamilyMember>{};

  public data: any;
  @Input() id: any;
  @Output() swapedEmitter: EventEmitter<any> = new EventEmitter();
  public loading: Boolean = false;
  public selectedEntry: any = '';
  public all_members: Array<AssignMembersModel> = [];
  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private commonService: CommonService,
    private familyMemberService: FamilyMemberService,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef,
    private http: HttpClient
  ) {}

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
    this.commonService.getService(this.config.apiEndpoint + 'getMyFamilyMembers', { user_id: id, pagination: false }, true)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.all_members = data.data;
        } else {
          this.commonService.response(data.message, 'error');
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
          this.swapedEmitter.emit();
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

  onSelectionChange(entry) {
    this.swapFamilyMember.to = entry;
  }

  swapUser() {
    this.swapFamilyMember.from = this.id;
    this.familyMemberService
      .swapUser(this.swapFamilyMember)
      .pipe(map((data) => data.body))
      .subscribe(
        (data) => {
          this.loading = false;
          if (data.status === 200) {
            this.commonService.response(data.message, 'success');
            this.swapedEmitter.emit();
            this.commonService.closeSwal(2000);
            setTimeout(() => {
              this.bsModalRef.hide();
            }, 2000);
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
}
