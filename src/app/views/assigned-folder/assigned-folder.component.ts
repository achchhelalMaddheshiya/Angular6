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
  selector: 'app-assigned-folder',
  templateUrl: './assigned-folder.component.html',
  styleUrls: ['./assigned-folder.component.scss'],
  providers: [
    CommonService,
    DashboardService
  ]
})
export class AssignedFolderComponent implements OnInit, AfterViewInit {

  public loading: Boolean = false;
  public my_vault_data = [];
  public total: Number = 0;
  public page: Number = 1;
  public limit: Number = 1;
  public user_id: Number;
  public id: Number;
  public showFolder: Boolean = false;
  @ViewChild(NgForm) contactForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private dashboardService: DashboardService,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfig) {

    this.route.params.subscribe(params => this.user_id = params.user_id);
  }


  ngOnInit() {
    this.loading = true;
    this.getFolderByUser();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }


  getFolderByUser(page: Number = 1) {
    this.loading = true;
    this.dashboardService.getFolderByUser({ page: page, user_id: this.user_id }, true)
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


  defaultFolderDetail(type, id) {
    console.log(type, id);
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
    this.router.navigate([url], { queryParams: { q: `assigned-${type}` }});
  }

}
