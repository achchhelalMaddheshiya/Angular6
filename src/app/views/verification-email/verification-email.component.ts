import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verification-email',
  templateUrl: './verification-email.component.html',
  styleUrls: ['./verification-email.component.scss'],
  providers: [
    CommonService
  ]
})
export class VerificationEmailComponent implements OnInit, AfterViewInit {

  public token: String;
  public loading: Boolean = false;
  public showForm: Boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.route.params.subscribe(params => this.token = params.token);
  }

  ngOnInit() {
    this.verify(this.token);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  verify(token) {
    const request = { email_verification_code: token };
    this.loading = true;
    this.commonService.createService(this.config.apiEndpoint + 'verify-change-email', request)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.showForm = false;

          this.commonService.response(data.message, 'success');
         // this.commonService.redirectWithTimeout('login', true, 3000);

        } else {
          this.showForm = true;
          this.commonService.response(data.message, 'error');
        //  this.commonService.redirectWithTimeout('login', true, 3000);

        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });

  }
}