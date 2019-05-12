import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2';

import { User } from '../../models/user';

import { UserService } from '../../services/user/user.service';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';

import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [
    UserService,
    CommonService,
  ]
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {

  public userModel: User;
  public busy: Subscription;
  public loading: Boolean = false;


  @ViewChild('userForm') formValues; // Added this
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
    }, 1000);
  }

  forgotPassword() {
    this.loading = true;
    this.userService.forgotPassword(this.userModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.formValues.resetForm();
          this.commonService.response(data.message, 'success');
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }
}
