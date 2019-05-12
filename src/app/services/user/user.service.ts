import { Injectable, Inject } from '@angular/core';
import { User } from '../../models/user';
import { CommonService } from '../../services/common.service';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { ChangeEmailModel } from '../../models/user';

@Injectable()
export class UserService {

  constructor(
    private commonService: CommonService,
    @Inject(APP_CONFIG) private config: AppConfig) { }

  /*  USER LOGIN SERVICE */
  login(user: User) {
    return this.commonService.createService(this.config.apiEndpoint + 'login', user);
  }

  /*  USER SIGNUP SERVICE */
  signUp(user: User) {
    const request = { email: user.email, password: user.password };
    return this.commonService.createService(this.config.apiEndpoint + 'signUp', request);
  }

  /*  USER FORGOT PASSWORD SERVICE */
  forgotPassword(user: User) {
    return this.commonService.createService(this.config.apiEndpoint + 'forgotPassword', user);
  }


  logout(user: User) {
    return this.commonService.getService(this.config.apiEndpoint + 'logout', user, true);
  }

  resetPassword(user: User) {
    return this.commonService.createService(this.config.apiEndpoint + 'resetPassword', user);
  }

  resendVerification(user: User) {
     const request = { email: user.email };
    return this.commonService.createService(this.config.apiEndpoint + 'resendVerification', user);
  }

  updateUser(user: User) {
    const request = { name: user.name };
    return this.commonService.putService(this.config.apiEndpoint + 'updateProfile', request);
  }

  changeEmail(payload: ChangeEmailModel) {
    return this.commonService.createService(this.config.apiEndpoint + 'changeEmail', payload);
}
}
