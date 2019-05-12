import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2';

import { User } from '../../models/user';

import { UserService } from '../../services/user/user.service';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';

import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    UserService,
    CommonService,
  ]

})
export class LoginComponent implements OnInit, AfterViewInit {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public userModel: User;
  private loading: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private commonService: CommonService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.userModel = new User();
  }

  ngOnInit() {
    this.loading = true;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
      // Set email & password as filled if user has opted remembers me
      const user_data = this.authService.getUserCredentialsInfo();
      if (user_data !== undefined && _.has(user_data, 'remember_me')) {
        this.userModel.email = user_data.email;
        this.userModel.password = user_data.password;
        this.userModel.remember_me = true;
      }
    }, 1000);

  }
  /*
  name : login
  description : user login function
  */
  login() {
    this.loading = true;
    this.userService.login(this.userModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.loggedIn.next(true);
          if (data.name !== '') {
            this.commonService.redirect('dashboard');
          } else {
            this.commonService.redirect('profile/edit/');
          }
        } else {
          if (data.user_unverified) {
            this.userModel.user_unverified = data.user_unverified;
            this.userModel.email = data.email;
          }
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  resendVerification() {
    this.loading = true;
    this.userService.resendVerification(this.userModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.userModel.user_unverified = false;
          this.commonService.response(data.message, 'success');
          this.commonService.redirectWithTimeout('login', true, 3000);
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }
}
