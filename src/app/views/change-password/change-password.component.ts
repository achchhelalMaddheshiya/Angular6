import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

// Load user model
import { ChangePasswordService } from '../../services/change-password/change-password.service';
import { ChangePasswordModel } from '../../models/user';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [
    CommonService,
    ChangePasswordService
  ]
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {

  public changePasswordModel: ChangePasswordModel = <ChangePasswordModel>{};
  public loading: Boolean = false;
  @ViewChild(NgForm) userForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private changePasswordService: ChangePasswordService,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
  }


  ngOnInit() {
    this.loading = true;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  changePassword() {
    this.loading = true;
    this.changePasswordService.changePassword(this.changePasswordModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.userForm.resetForm();
          this.commonService.response(data.message, 'success');
          this.commonService.redirectWithTimeout('profile', true, 3000);
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }
}
