import { Injectable, Inject } from '@angular/core';
import { PaymentModel, UnsubscribeModel } from '../models/user';
import { CommonService } from '../services/common.service';
import { APP_CONFIG, AppConfig } from '../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class PackagesService {

  constructor(
    private commonService: CommonService,
    @Inject(APP_CONFIG) private config: AppConfig) { }

  pay(data: PaymentModel) {
    return this.commonService.createService(this.config.apiEndpoint + 'charge', data);
  }

  unsubscribePayment(data: UnsubscribeModel) {
    return this.commonService.createService(this.config.apiEndpoint + 'unsubscribePayment', data);
  }
}
