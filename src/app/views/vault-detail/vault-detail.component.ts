import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { FolderCreatedModel, FolderUpdateModel } from '../../models/vault';
import { CreateLinkModel, AddLocationModel } from '../../models/vault';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { AssignMemberComponent } from '../assign-member/assign-member.component';

@Component({
  selector: 'app-vault-detail',
  templateUrl: './vault-detail.component.html',
  styleUrls: ['./vault-detail.component.scss'],
  providers: [
    CommonService,
    DashboardService
  ]
})
export class VaultDetailComponent implements OnInit, AfterViewInit {

  public loading: Boolean = false;
  public my_vault_data = [];
  public total: Number = 0;
  public page: Number = 1;
  public limit: Number = 1;
  public parent_id: Number;
  public folder_created = [];
  public folderCreatedModel: FolderCreatedModel = <FolderCreatedModel>{};
  public folderUpdateModel: FolderUpdateModel = <FolderUpdateModel>{};
  public bsModalRef: BsModalRef;
  public id: Number;
  public showFolder: Boolean = false;
  @ViewChild(NgForm) contactForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private dashboardService: DashboardService,
    private router: Router,
    private modalService: BsModalService,
    @Inject(APP_CONFIG) private config: AppConfig) {

    this.route.params.subscribe(params => this.parent_id = params.parent_id);
  }

  ngOnInit() {
    this.loading = true;
    this.getVaultDetail();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  getVaultDetail(page: Number = 1) {
    this.loading = true;
    this.dashboardService.getVaultDetail({ page: page, parent_id: this.parent_id }, true)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.my_vault_data = data.data.data;
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


  createFolder() {
    this.showFolder = !this.showFolder;
    this.folderCreatedModel.name = 'Untitled Folder';
    this.folder_created = [{ image: 'assets/images/folder-icon.png' }];
  }

  saveFolder() {
    this.loading = true;
    this.folderCreatedModel.parent_id = this.parent_id;
    this.dashboardService.saveFolder(this.folderCreatedModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.showFolder = !this.showFolder;
          this.folderCreatedModel.name = '';
          this.commonService.response(data.message, 'success');
          this.commonService.closeSwal(3000);
          this.getVaultDetail();
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  updateFolder(id, val) {
    if (val) {
      this.loading = true;
      this.folderUpdateModel.id = id;
      this.folderUpdateModel.parent_id = this.parent_id;
      this.dashboardService.updateFolder(this.folderUpdateModel)
        .pipe(map(data => data.body))
        .subscribe(data => {
          this.loading = false;
          if (data.status === 200) {
            this.commonService.response(data.message, 'success');
            this.commonService.closeSwal(3000);
          } else {
            this.commonService.response(data.message, 'error');
          }
        }, error => {
          this.loading = false;
          this.commonService.response(error.message, 'error');
        });
    }

  }

  defaultFolderDetail(type, id) {
    let url = '';
    switch (type) {
      case 'links': {
        url = `links/${id}`;
         break;
      }
      case 'locations': {
        url = `locations/${id}`;
         break;
      }
      case 'passwords': {
        url = `passwords/${id}`;
        break;
     }
      default: {
        url = `folder-detail/${id}`;
         break;
      }
   }
    this.router.navigate([url]);
  }

  assignMemberModal(folder_id) {
    console.log('folder_id', folder_id);
    const initialState = {
      folder_id: folder_id,
      title: 'Family Members',
      closeBtnName: 'Close'
    };
    this.bsModalRef = this.modalService.show(AssignMemberComponent, { initialState, class: 'modal-lg' });
    // this.bsModalRef.content.locationAddedEmitter.subscribe(this.onMemberAdded.bind(this));
  }

  onMemberAdded() {
    console.log('member created');
  }
}



