import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { FolderCreatedModel } from '../../models/vault';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    CommonService,
    DashboardService
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  private loading: Boolean = false;
  public my_personal_data = [];
  public folder_assigned_to_me = [];
  public total: Number = 0;
  public page: Number = 1;
  public limit: Number = 1;

  public folder_total: Number;
  public folder_page: Number = 1;
  public folder_limit: Number = 1;

  @ViewChild(NgForm) contactForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private dashboardService: DashboardService,
    private router: Router,
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig) { }

  ngOnInit() {
    this.loading = true;
    this.myPersonalVault();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  myPersonalVault(page: Number = 1) {
   /* this.loading = true;
    this.dashboardService.myPersonalVault({ page: page }, true)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.my_personal_data = data.data.data;
          this.total = data.data.total;
          this.page = data.data.current_page;
          this.limit = data.data.per_page;
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });*/

    const queue = [
      this.http.get(this.config.apiEndpoint + `myPersonalVault?${this.commonService.arrayObjectToString({ })}`),
      this.http.get(this.config.apiEndpoint + `getMyAssignedFolders?${this.commonService.arrayObjectToString({ page: page })}`)
    ];
    this.commonService.queueRequest(queue)
      .subscribe((data: any) => {
        this.loading = false;
        const [myPersonalVault, getMyAssignedFolders] = data;
        this.my_personal_data = myPersonalVault.data;
        this.folder_assigned_to_me = getMyAssignedFolders.data.data;
        this.folder_total = getMyAssignedFolders.data.total;
        this.folder_page = getMyAssignedFolders.data.current_page;
        this.folder_limit = getMyAssignedFolders.data.per_page;
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  getVaultDetail(id, type) {
    if (type === 0) {
      this.commonService.redirect('vault-detail/' + id);
    } else {
      this.commonService.redirect('assigned-folder/' + id);
    }
  }
}



