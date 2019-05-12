import { Component, OnInit, Inject, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { CreateLinkModel, AddLocationModel, FolderPermissions } from '../../models/vault';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { AddLocationComponent } from '../add-location/add-location.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers: [
    DashboardService,
    CommonService
  ]
})
export class LocationComponent implements OnInit, AfterViewInit {
  @ViewChild(NgForm) createLinkForm: NgForm;
  public selectedIndex: Number = 1;
  public items = [];
  public my_links_data = [];
  public loading: Boolean = false;
  public total: Number = 0;
  public page: Number = 1;
  public limit: Number = 1;
  public createLinkModel: CreateLinkModel = <CreateLinkModel>{};
  public bsModalRef: BsModalRef;
  public id: Number;
  public q: String = '';
  public showLinkForm: Boolean = false;
  public folderPermissions: FolderPermissions = <FolderPermissions>{};
  public is_owner: Number;
  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private dashboardService: DashboardService,
    private modalService: BsModalService,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfig) {
    this.route.queryParams.subscribe(params => this.q = params.q);
    this.route.params.subscribe(params => this.id = params.id);
  }

  select(index: Number) {
    this.selectedIndex = index;
  }

  ngOnInit() {
    this.items = [
      'Where I have been', 'Where I would like to go'
    ];
    this.getDetail();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  loadComponent(index) {
    this.selectedIndex = index;
    this.getDetail(index);
  }

  addLocation(selectedTab) {
    const initialState = {
      selectedTab: selectedTab,
      folder_id: this.id,
      title: 'Add Locations',
      closeBtnName: 'Close'
    };
    this.bsModalRef = this.modalService.show(AddLocationComponent, { initialState });
    this.bsModalRef.content.locationAddedEmitter.subscribe(this.onLocationAdded.bind(this));
  }
  onLocationAdded(index) {
    this.loadComponent(index);
  }

  getDetail(page: Number = 1) {
    this.loading = true;
    this.dashboardService.getFolderDetail({
      attribute_types: 'locations',
      meta_key: (this.selectedIndex === 0) ? 'been' : 'go',
      page: page,
      folder_id: this.id,
      q: (this.q) ? this.q : ''
    }, true)
      .pipe(map(data => data.body))
      .subscribe(data => {
        if (data.status === 200) {
          this.is_owner = data.is_owner;
          this.folderPermissions = data.permission;
          this.my_links_data = data.data.data;
          this.total = data.data.total;
          this.page = data.data.current_page;
          this.limit = data.data.per_page;
          this.loading = false;
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  deleteFolderData(row_id, index) {
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
              this.loadComponent(index);
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
    });
  }
}
