import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

// Load user model
import { User } from '../../models/user';

// Load services required for this component
import { UserService } from '../../services/user/user.service';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';

import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    UserService,
    CommonService,
  ]
})
export class HomeComponent implements OnInit, AfterViewInit {
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
  @ViewChild('userForm') formValues; // signup form

  ngOnInit() {
    this.loading = true;
  }

  /*
  name : signUp
  description : This function is use to signup a user
  */
  signUp() {
    this.loading = true;
    this.userService.signUp(this.userModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        if (data.status === 200) {
          this.formValues.resetForm();
          this.loading = false;
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }


}
