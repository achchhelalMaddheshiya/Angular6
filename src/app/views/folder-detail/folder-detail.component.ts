import { Component, OnInit, Input, Inject } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlContainer, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType, HttpEvent, HttpHeaders } from '@angular/common/http';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { map, debounceTime, distinctUntilChanged, mergeMap, tap } from 'rxjs/operators';
import { FolderPermissions, SearchFolder, FolderDataModel } from '../../models/vault';
import { Subject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.scss'],
  providers: [
    FileUploadService,
    CommonService,
    DashboardService
  ]
})
export class FolderDetailComponent implements OnInit {
  public progress: Number;
  public folder_id: any;
  public loading: Boolean = false;
  public my_vault_data = [];
  public total: Number = 0;
  public page: Number = 1;
  public limit: Number = 1;
  public displayMode: Number = 1;
  public q: String = '';
  public is_dead;
  public showUploadButton: Boolean = false;
  public member_type;
  public user_id: String;
  public folderPermissions = [];
  public search_val = '';
  public is_owner: Number;
  public searchTextChanged = new Subject;
  public subscription: any;
  public folder_data: FolderDataModel = <FolderDataModel>{};

  constructor(
    private readonly fileService: FileUploadService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dashboardService: DashboardService,
    @Inject(APP_CONFIG) private config: AppConfig,
  ) {
    this.route.params.subscribe(params => this.folder_id = params.id);
    this.route.queryParams.subscribe(params => this.q = params.q);
  }

  ngOnInit() {
    this.getFolderDetail(1, '');

    this.subscription = this.searchTextChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((data: any) => {
        this.getFolderDetail(1, data);
      });
  }

  search($event) {
    this.searchTextChanged.next($event.target.value);
  }

  upload(event) {
    this.loading = true;
    const elem = event.target;
    if (elem.files.length > 0) {
      const formData = new FormData();
      formData.append('file', elem.files[0]);
      formData.append('folder_id', this.folder_id);
      formData.append('user_id', this.showUploadButton ? 'true' : 'false');
      this.commonService
        .uploadFile(this.config.apiEndpoint + 'upload', formData)
        .subscribe(
          (data: any) => {
            event.srcElement.value = null;
            this.loading = false;
            if (data.status === 200) {
              this.getFolderDetail(1, '');
              this.commonService.response(data.message, 'success');
            } else {
              this.commonService.response(data.message, 'error');
            }
          },
          (data: any) => {
            this.loading = false;
            this.commonService.response(data.message, 'error');
          }
        );
    }
  }

  getFolderDetail(page: Number = 1, search): any {
    this.loading = true;
    this.dashboardService
      .getFolderData(
        {
          page: page,
          folder_id: this.folder_id,
          q: this.q ? this.q : '',
          search: search !== undefined ? search : ''
        },
        true
      )
      .pipe(map((data) => data.body))
      .subscribe(
        (data) => {
          this.loading = false;
          if (data.status === 200) {
            this.user_id = data.user_id;
            this.folder_data = data.folder_data;
            this.is_owner = data.is_owner;
            this.folderPermissions = data.my_permissions;
            this.my_vault_data = data.data.data;
            this.total = data.data.total;
            this.page = data.data.current_page;
            this.limit = data.data.per_page;

            if (data.is_dead === 0 && data.is_upload === 1) {
              this.showUploadButton = true;
            }
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
  onDisplayModeChange(mode: Number): void {
    this.displayMode = mode;
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
        this.dashboardService
          .deleteFolderData({ row_id: row_id })
          .pipe(map((data) => data.body))
          .subscribe(
            (data) => {
              this.loading = false;
              if (data.status === 200) {
                this.commonService.response(data.message, 'success');
                this.commonService.closeSwal(2000);
                this.getFolderDetail(1, '');
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
    });
  }
}
