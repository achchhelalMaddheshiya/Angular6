import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Injectable()
export class AuthService {

  constructor(
    private router: Router
  ) { }

  /* STORE USER TOKEN AND OTHER DETAILS  */
  storeUserInfo(input: any, params: any) {
    const parameter = JSON.parse(params);
    let user_data = {};
    if (parameter.remember_me && parameter.remember_me === true) {
      user_data = {
        remember_me: parameter.remember_me,
        email: parameter.email,
        password: parameter.password
      };
      localStorage.setItem('userCredentials', JSON.stringify(user_data));
    } else {
      this.removeUserInfo('userCredentials');
    }
    localStorage.setItem('userInfo', JSON.stringify({ token: input.headers.get('access_token') }));
  }

  removeUserInfo(input?: any) {
    let collection;
    if (input && input !== undefined) {
      collection = [input];
    } else {
      collection = ['userInfo', 'userCredentials'];
    }
    _.forEach(collection, function (value) {
      localStorage.removeItem(value);
    });
  }

  /* GET LOGIN USER INFORMATION  */
  getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  getUserCredentialsInfo() {
    return JSON.parse(localStorage.getItem('userCredentials'));
  }

  /* USER LOGOUT SERVICE  */
  logout(): boolean {
    const user_data = this.getUserCredentialsInfo();
    if (user_data !== undefined && _.has(user_data, 'remember_me')) {
      this.removeUserInfo('userInfo');
    } else {
      this.removeUserInfo();
    }
    this.router.navigate(['/login']);
    return true;
  }

  /* IS USER AUTHENTICATED */
  isAuthenticated(): boolean {
    const auth_token: any = JSON.parse(localStorage.getItem('userInfo')) || '';
    if (auth_token.token && auth_token.token !== undefined) {
      return true;
    } else {
      return false;
    }
  }

}
