import {
  Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation, Output, EventEmitter, Input,
  AfterContentInit
} from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { CommonService } from '../../services/common.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { FamilyMembersModel, AssignMembersModel, FolderPermissionModel, DeletePermissionModel } from '../../models/family-members';
import * as _ from 'lodash';


@Component({
  selector: 'app-assign-member',
  templateUrl: './assign-member.component.html',
  styleUrls: ['./assign-member.component.scss'],
  providers: [
    DashboardService
  ]
})
export class AssignMemberComponent implements OnInit {
  @Input() folder_id: Number;
  public familyMembersModel: FamilyMembersModel = <FamilyMembersModel>{};
  public all_members: Array<AssignMembersModel> = [];
  create_folder_permission: FolderPermissionModel[] = [];
  delete_permission_model: DeletePermissionModel[] = [];
  userFilter: any = { receiver_detail: { name: '' } };
  // public all_members = [];
  public total: Number = 0;
  public page: Number = 1;
  public limit: Number = 1;
  public loading: Boolean = false;
  dropdownList = [];
  public permission_id = [];
  dropdownSettings = {};
  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private dashboardService: DashboardService,
    private modalService: BsModalService,
    private router: Router,
    private http: HttpClient,
    public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.loading = true;
    this.dropdownList = [];
    this.permission_id = [];
    /*this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: false,
    };*/
    this.getMyFamilyMembers();
  }

  getMyFamilyMembers() {
    const search = (this.familyMembersModel.search) ? this.familyMembersModel.search : '';
    const queue = [
      this.http.get(this.config.apiEndpoint + 'getFolderPermissions'),
      this.http.get(this.config.apiEndpoint + `getFolderPermissionUsers?${this.commonService.arrayObjectToString({
        q: search, folder_id: this.folder_id
      })}`)
    ];
    this.commonService.queueRequest(queue)
      .subscribe((data: any) => {
        this.loading = false;
        const [getFolderPermissions, getMyFamilyMembers] = data;
        this.all_members = getMyFamilyMembers.data;

        this.dropdownList = getFolderPermissions.data;
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  onItemSelect() {
    let count = 0;
    _.forEach(this.all_members, function (value, key) {
      if (
        (
          value.receiver_detail.folder_permissions[0].selected_id === true &&
          value.receiver_detail.folder_permissions[0].permission.length === 0
        )
        ||
        (
          value.receiver_detail.folder_permissions[0].selected_id === false &&
          value.receiver_detail.folder_permissions[0].permission.length > 0
        )
      ) {
        value.is_error = true;
        count = 1;
      }

      // if selected checkbox and permission select box is selected hide error
      if (value.receiver_detail.folder_permissions[0].selected_id === true &&
        value.receiver_detail.folder_permissions[0].permission.length > 0) {
        value.is_error = false;
      }
      // if un selected checkbox and permission select box is not selected hide error
      if (value.receiver_detail.folder_permissions[0].selected_id === false &&
        value.receiver_detail.folder_permissions[0].permission.length === 0) {
        value.is_error = false;
      }
    });
  }
  assignMember() {
    const selected_array = [];
    const not_selected_array = [];
    let count = 0;
    _.forEach(this.all_members, function (value, key) {
      // Make array of selected user permission
      if (value.receiver_detail.folder_permissions[0].selected_id === true &&
        value.receiver_detail.folder_permissions[0].permission.length > 0) {
        /*const val: FolderPermissionModel = {
          user_id: value.user_id,
          permission_id: value.receiver_detail.folder_permissions[0].permission[0].id,
          folder_id: value.receiver_detail.folder_permissions[0].folder_id
        };*/
        _.forEach(value.receiver_detail.folder_permissions[0].permission, function (v, k) {
          const val: FolderPermissionModel = {
            user_id: value.user_id,
            folder_id: value.receiver_detail.folder_permissions[0].folder_id,
            permission_id: v.id,
            status: 1,
            created_at:  Math.round(new Date().getTime() / 1000)
        };
        selected_array.push(val);
        });
      }
      // make array of those user that are marked as deleted
      if (value.receiver_detail.folder_permissions[0].selected_id === false) {
        _.forEach(value.receiver_detail.folder_permissions[0].permission, function (v, k) {
          not_selected_array.push(v.row_id);
        });
        /*if (value.receiver_detail.folder_permissions[0].id != null) {
          not_selected_array.push(value.receiver_detail.folder_permissions[0].id);
        }*/
        }

      // validations
      if (
        (
          value.receiver_detail.folder_permissions[0].selected_id === true &&
          value.receiver_detail.folder_permissions[0].permission.length === 0
        )
        ||
        (
          value.receiver_detail.folder_permissions[0].selected_id === false &&
          value.receiver_detail.folder_permissions[0].permission.length > 0
        )
      ) {
        value.is_error = true;
        count = 1;
      }

      if (value.receiver_detail.folder_permissions[0].selected_id === true &&
        value.receiver_detail.folder_permissions[0].permission.length > 0) {
        value.is_error = false;
      }

      // if un selected checkbox and permission select box is not selected hide error
      if (value.receiver_detail.folder_permissions[0].selected_id === false &&
        value.receiver_detail.folder_permissions[0].permission.length === 0) {
        value.is_error = false;
      }
    });
    const post_object = { create: selected_array, delete: not_selected_array };
    if (count === 0 && (selected_array.length > 0 || not_selected_array.length > 0)) {
      this.loading = true;
      this.dashboardService.assignMember(post_object)
        .pipe(map(data => data.body))
        .subscribe(data => {
          this.loading = false;
          if (data.status === 200) {
            setTimeout(() => {
              this.bsModalRef.hide();
            }, 3000);
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
}
