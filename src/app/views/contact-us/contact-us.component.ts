
import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactUsService } from '../../services/contact-us/contact-us.service';
import { CommonService } from '../../services/common.service';
import { ContactUsModel } from '../../models/contact-us';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  providers: [
    CommonService,
    ContactUsService
  ]
})
export class ContactUsComponent implements OnInit, AfterViewInit {
  public submitted: Boolean = false;
  public loading: Boolean = false;
  public contactUsModel: ContactUsModel = <ContactUsModel>{};
  @ViewChild(NgForm) contactForm: NgForm;
  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private contactUsService: ContactUsService,
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
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

  contactUs() {
    this.loading = true;
    this.contactUsService.contactUs(this.contactUsModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.contactForm.resetForm();
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
