import { Component, OnInit, Renderer2, Inject, ElementRef, ViewChild, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';
import { User } from '../../models/user';

import { UserService } from '../../services/user/user.service';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Router, Event as NavigationEvent, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';

import { filter, map, mergeMap } from 'rxjs/operators';
// https://stackblitz.com/edit/angular-r6-detect-browser-refresh?file=src%2Fapp%2Fpage-a%2Fpage-a.component.html
@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css'],
  providers: [
    UserService,
    CommonService,
    AuthService
  ]

})
export class AdminHeaderComponent implements OnInit {
  @Input() isLoggedIn: User;
  public loading = false;
  public userModel: User;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private userService: UserService,
    private authService: AuthService,
    @Inject(APP_CONFIG) private config: AppConfig,
  ) {
    this.userModel = new User();
  }
  ngOnInit() {
    const el = this.activatedRoute.children[0].snapshot.data.header_class;
    if (el && el !== undefined) {
      document.getElementById('headfix').removeAttribute('class');
      document.getElementById('headfix').classList.add(el);
    }

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    ).subscribe(data => {
      document.getElementById('headfix').removeAttribute('class');
      const elementClass = this.activatedRoute.children[0].snapshot.data.header_class;
      if (elementClass && elementClass !== undefined) {
        document.getElementById('headfix').classList.add(elementClass);
      }
    });

    if (this.authService.isAuthenticated()) {
      // get logged in user data
      this.commonService.getService(this.config.apiEndpoint + 'getUser', this.userModel)
        .pipe(map(data => data.body))
        .subscribe(data => {
          this.loading = false;
          if (data.status === 200) {
            this.userModel = {
              name: data.data.name,
              status: data.data.status,
              image: data.data.image,
              notification_count: data.data.notification_count
            };
            if (data.data.name === '') {
              this.commonService.redirect('profile/edit/');
            }
          } else {
            this.commonService.response(data.message, 'error');
          }
        }, error => {
          this.loading = false;
          this.commonService.response(error.message, 'error');
        });
    }
  }

  logout() {
    Swal({
      title: 'Are you sure?',
      text: 'You want to logout',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.userService.logout(this.userModel)
          .pipe(map(data => data.body))
          .subscribe(data => {
            this.loading = false;
            if (data.status === 200) {
              document.getElementById('headfix').removeAttribute('class');
              this.loading = false;
              this.authService.logout();
            } else {
              Swal(data.message);
            }
          }, error => {
            this.loading = false;
            Swal(error.error.message);
          });
      }
    });
  }

}
