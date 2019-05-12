import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

// Load user model
import { UserService } from '../../services/user/user.service';
import { ChangeEmailModel } from '../../models/user';
@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss'],
  providers: [
    CommonService,
    UserService
  ]
})
export class ChangeEmailComponent implements OnInit, AfterViewInit {

  public changeEmailModel: ChangeEmailModel = <ChangeEmailModel>{};
  public loading: Boolean = false;
  @ViewChild(NgForm) userForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private userService: UserService,
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

  changeEmail() {
    this.loading = true;
    this.userService.changeEmail(this.changeEmailModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.userForm.resetForm();
          this.commonService.response(data.message, 'success');
           this.commonService.redirectWithTimeout('dashboard', true, 3000);
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }
}
