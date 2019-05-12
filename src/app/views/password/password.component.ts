import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { CreatePasswordModel, DeleteFolderDataModel, FolderPermissions } from '../../models/vault';
import { trigger, transition, style, animate, state } from '@angular/animations';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  public my_links_data = [];
  public loading: Boolean = false;
  public total: Number = 0;
  public page: Number = 1;
  public limit: Number = 1;
  public createPasswordModel: CreatePasswordModel = <CreatePasswordModel>{};
  public deleteFolderDataModel: DeleteFolderDataModel = <DeleteFolderDataModel>{};
  public folderPermissions: FolderPermissions = <FolderPermissions>{};
  public is_owner: Number;
  @ViewChild(NgForm) createPasswordForm: NgForm;
  public id: Number;
  public q: String = '';
  public showLinkForm: Boolean = false;
  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private dashboardService: DashboardService,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfig) {
    this.route.queryParams.subscribe(params => this.q = params.q);
    this.route.params.subscribe(params => this.id = params.id);
  }

  ngOnInit() {
    this.getDetail();
  }


  getDetail(page: Number = 1) {
    this.loading = true;
    this.dashboardService.getFolderDetail({ attribute_types: 'passwords', page: page, folder_id: this.id, q: (this.q) ? this.q : '' }, true)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.is_owner = data.is_owner;
          this.folderPermissions =  data.permission;
          this.my_links_data = data.data.data;
          this.total = data.data.total;
          this.page = data.data.current_page;
          this.limit = data.data.per_page;
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  showLink() {
    this.showLinkForm = !this.showLinkForm;
    setTimeout(() => {
      this.createPasswordForm.resetForm();
    }, 500);
  }

  createLink() {
    console.log('this.createPasswordModel', this.createPasswordModel);
    this.createPasswordModel.folder_id = this.id;
    this.createPasswordModel.attribute_types = 'passwords';

    this.loading = true;
    this.dashboardService.writeFolder(this.createPasswordModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.showLinkForm = false;
          setTimeout(() => {
            this.createPasswordForm.resetForm();
          }, 800);

          this.commonService.response(data.message, 'success');
          this.commonService.closeSwal(2000);
          this.getDetail();
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });

  }

  deleteFolderData(row_id) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.dashboardService.deleteFolderData({ row_id: row_id })
          .pipe(map(data => data.body))
          .subscribe(data => {
            this.loading = false;
            if (data.status === 200) {
              this.commonService.response(data.message, 'success');
              this.commonService.closeSwal(2000);
              this.getDetail();
            } else {
              this.commonService.response(data.message, 'error');
            }
          }, error => {
            this.loading = false;
            this.commonService.response(error.message, 'error');
          });
      }
    });
  }
}
