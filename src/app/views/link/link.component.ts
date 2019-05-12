import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { CreateLinkModel, DeleteFolderDataModel, FolderPermissions } from '../../models/vault';
import { trigger, transition, style, animate, state } from '@angular/animations';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  providers: [
    DashboardService,
    CommonService,
  ]
})
export class LinkComponent implements OnInit {
  public my_links_data = [];
  public loading: Boolean = false;
  public total: Number = 0;
  public page: Number = 1;
  public limit: Number = 1;
  public createLinkModel: CreateLinkModel = <CreateLinkModel>{};
  public deleteFolderDataModel: DeleteFolderDataModel = <DeleteFolderDataModel>{};
  public folderPermissions: FolderPermissions = <FolderPermissions>{};
  public is_owner: Number;
  @ViewChild(NgForm) createLinkForm: NgForm;
  id: Number;
  q: String = '';
  public showLinkForm: Boolean = false;
  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private dashboardService: DashboardService,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfig) {
    this.route.params.subscribe(params => this.id = params.id);
    this.route.queryParams.subscribe(params => this.q = params.q);
  }

  ngOnInit() {
    this.getDetail();
  }


  getDetail(page: Number = 1) {
    this.loading = true;
    this.dashboardService.getFolderDetail({ attribute_types: 'links', page: page, folder_id: this.id, q: (this.q) ? this.q : '' }, true)
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
      this.createLinkForm.resetForm();
    }, 500);
  }

  createLink() {
    this.createLinkModel.folder_id = this.id;
    this.createLinkModel.attribute_types = 'links';

    this.loading = true;
    this.dashboardService.writeFolder(this.createLinkModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.showLinkForm = false;
          setTimeout(() => {
            this.createLinkForm.resetForm();
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
