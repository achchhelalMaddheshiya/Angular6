import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Inject } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { map } from 'rxjs/operators';
import { PackagesService } from '../../services/packages.service';
import { PaymentModel, UnsubscribeModel, UserPackageModel } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';

import { ModalComponent } from '../modal/modal.component';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
  providers: [
    CommonService,
    PackagesService
  ]
})
export class PackagesComponent implements OnInit, AfterViewInit {
  public current_time = moment().unix();
  public loading: Boolean = false;
  public paymentModel: PaymentModel = <PaymentModel>{};
  public unsubscribeModel: UnsubscribeModel = <UnsubscribeModel>{};
  public showPaymentForm: Boolean = false;
  public selected_package_id: Number;
  public all_packages = [];
  public subscriptions: Subscription[] = [];
  public messages = [];
  // public user_packages: UserPackageModel = <UserPackageModel>{};
   public user_packages: any = null;
  bsModalRef: BsModalRef;

  elements: Elements;
  card: StripeElement;

  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
  stripeTest: FormGroup;

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private modalService: BsModalService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private packagesService: PackagesService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private stripeService: StripeService
  ) {
  }
  openModalWithComponent() {
    const initialState = {
      list: [
        'Open a modal with component'
      ],
      title: 'Title'
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  ngOnInit() {
    this.loading = true;
    this.getPackages();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  buy() {
    this.loading = true;
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          this.pay(result.token, this.selected_package_id);
        }
        if (result.error) {
          this.loading = false;
          this.commonService.response(result.error.message, 'error');
        }
      });
  }


  pay(token, selected_package_id) {
    this.loading = true;
    this.paymentModel.token = token.id;
    this.paymentModel.package_id = selected_package_id;
    this.packagesService.pay(this.paymentModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.cancelPayment();
          this.commonService.closeSwal(2000);
          setTimeout(() => {
            this.getPackages();
          }, 1000);
          this.commonService.response(data.message, 'success');
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  getPackages() {
    this.loading = true;
    this.commonService.getPackages(this.config.apiEndpoint + 'getPackages', {}, false)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.user_packages = data.user_packages;
          this.all_packages = data.data;
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  cancelPayment() {
    this.showPaymentForm = false;
   setTimeout(() => {
      this.stripeService.elements(this.elementsOptions)
        .subscribe(elements => {
          this.elements = elements;
          // Only mount the element the first time
          if (this.card) {
             this.card.unmount();
          }
        });
    }, 500);
  }
  showPayment(id) {
    this.selected_package_id = id;
    this.showPaymentForm = true;
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });

    setTimeout(() => {
      this.stripeService.elements(this.elementsOptions)
        .subscribe(elements => {
          this.elements = elements;
          // Only mount the element the first time
          if (!this.card) {
            this.card = this.elements.create('card', {
              style: {
                base: {
                  iconColor: '#666EE8',
                  color: '#444',
                  lineHeight: '40px',
                  fontWeight: 300,
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSize: '12px',
                  '::placeholder': {
                    color: '#CFD7E0'
                  }
                }
              }, hidePostalCode: true
            });
            this.card.mount('#card-element');
          } else {
            this.card.mount('#card-element');
          }
        });
    }, 500);

  }

  unsubscribePayment(id: Number) {
    this.loading = true;
    this.unsubscribeModel.id = id;
    this.packagesService.unsubscribePayment(this.unsubscribeModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.cancelPayment();
          this.commonService.closeSwal(2000);
          setTimeout(() => {
            this.getPackages();
          }, 1000);
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
