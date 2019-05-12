
/*
 APPLICATION COFIGRATION FILE
*/
import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  apiEndpoint: string;
  apiAssetsUrl: string;
}

export const APP_DI_CONFIG: AppConfig = {
       apiEndpoint: environment.apiEndpoint,
       apiAssetsUrl: environment.apiAssetsUrl
//     apiEndpoint: 'http://willodiaryserver.ignivastaging.com/api/',
//     apiAssetsUrl: 'http://willodiaryserver.ignivastaging.com/'
};

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [{
    provide: APP_CONFIG,
    useValue: APP_DI_CONFIG
  }]
})
export class AppConfigModule { }
