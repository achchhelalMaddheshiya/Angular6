import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { CommonService } from '../../services/common.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [
    CommonService,
    NotificationService
  ]
})
export class NotificationsComponent implements OnInit, AfterViewInit {
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  public selectedIndex: Number = 0;
  public items = [];
  public loading: Boolean = false;
  public all_notifications = [];
  public all_requests = [];
  public total: Number = 0;
  public page: Number = 1;
  public limit: Number = 1;
  public request_total: Number;
  public request_page: Number = 1;
  public request_limit: Number = 1;
  public selectedTab: Number = 0;
  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private http: HttpClient,
    private router: Router
  ) { }
  select(index: Number) {
    this.selectedIndex = index;
  }

  ngOnInit() {
    this.items = [
      'Notifications', 'Requests'
    ];
    this.loading = true;
    this.loadComponent(0);
  }
  loadComponent(index) {
    this.selectedIndex = index;
    if (index === 0) {
      this.all_requests = [];
      this.request_total = 0;
      this.request_page = 1;
      this.request_limit = 10000;
      this.getNotifications(1);
    } else {
      this.all_notifications = [];
      this.total = 0;
      this.page = 1;
      this.limit = 1;
      this.getMyRequests(1);
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  getNotifications(page: Number) {
    this.loading = true;
    const request = { page: page };

    this.commonService
      .getService(this.config.apiEndpoint + 'getNotifications', request, true)
      .pipe(map((data) => data.body))
      .subscribe(
        (data) => {
          this.loading = false;
          if (data.status === 200) {
            this.all_notifications = data.data.data;
            this.total = data.data.total;
            this.page = data.data.current_page;
            this.limit = data.data.per_page;
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

  getMyRequests(page: Number) {
    this.loading = true;
    const request = { page: page };

    this.commonService
      .getService(this.config.apiEndpoint + 'getMyRequests', request, true)
      .pipe(map((data) => data.body))
      .subscribe(
        (data) => {
          this.loading = false;
          if (data.status === 200) {
            this.all_requests = data.data.data;
            this.request_total = data.data.total;
            this.request_page = data.data.current_page;
            this.request_limit = data.data.per_page;
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

  requestActions(invited_by, status) {
    this.loading = true;
    const request = { invitedby_id: invited_by, status: status };
    this.commonService
      .createService(this.config.apiEndpoint + 'changeRequestStatus', request)
      .pipe(map((data) => data.body))
      .subscribe(
        (data) => {
          this.loading = false;
          if (data.status === 200) {
            this.commonService.response(data.message, 'success');
            this.commonService.closeSwal(2000);
            setTimeout(() => {
              this.getMyRequests(1);
            }, 3000);
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
