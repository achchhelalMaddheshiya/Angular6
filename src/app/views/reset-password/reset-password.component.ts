import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Load user model
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [
    CommonService,
    UserService
  ]
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {

  public token: String;
  public loading: Boolean = false;
  public showForm: Boolean = false;
  public userModel: User;
  @ViewChild('userForm') formValues; // Added this

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private userService: UserService,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.route.params.subscribe(params => this.token = params.token);
    this.userModel = new User();
  }

  ngOnInit() {
    this.validateTokenExpiry(this.token);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  validateTokenExpiry(token) {
    const request = { token: token };
    this.loading = true;
    this.commonService.createService(this.config.apiEndpoint + 'validateForgotExpiry', request)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.showForm = true;
          this.userModel.forgot_password_token = token;
        } else {
          this.showForm = false;
          this.commonService.response(data.message, 'error');
          this.commonService.redirectWithTimeout('login', true, 1000);
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  resetPassword() {
    this.loading = true;
    this.userService.resetPassword(this.userModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.formValues.resetForm();
          this.showForm = false;
          this.commonService.response(data.message, 'success');
           this.commonService.redirectWithTimeout('login', true, 3000);
        } else {
          this.showForm = true;
          this.commonService.response(data.message, 'error');
          this.commonService.redirectWithTimeout('login', true, 1000);
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }
}
