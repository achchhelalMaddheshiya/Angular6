import { BrowserModule, Title } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgBusyModule } from 'ng-busy';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { COMPONENTS } from './app-routing';
import { AppConfigModule } from './app-config.module';

import { NgxLoadingModule } from 'ngx-loading';
import { BsDropdownModule, TabsModule, BsDatepickerModule, ModalModule, CollapseModule } from 'ngx-bootstrap';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MomentModule } from 'ngx-moment';
import { NgxStripeModule } from 'ngx-stripe';
import { ModalComponent } from './views/modal/modal.component';
import { EditFamilyMembersComponent } from './views/edit-family-members/edit-family-members.component';
import { AddLocationComponent } from './views/add-location/add-location.component';
import { AssignMemberComponent } from './views/assign-member/assign-member.component';

import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { DeclareUserComponent } from './views/declare-user/declare-user.component';
import { DeleteMemberListingComponent } from './views/delete-member-listing/delete-member-listing.component';
import { SwapRoleComponent } from './views/swap-role/swap-role.component';



const ngxBootstrapI = [
  BsDropdownModule.forRoot(),
  TabsModule.forRoot(),
  BsDatepickerModule.forRoot(),
  MomentModule,
  ModalModule.forRoot(),
  CollapseModule.forRoot()
];
const ngxBootstrapE = [
  BsDropdownModule,
  TabsModule,
  BsDatepickerModule,
  MomentModule,
  ModalModule
];
// https://stackoverflow.com/questions/51415752/angular-6-routing-redirecting
// https://github.com/Zak-C/ngx-loading
@NgModule({
  declarations: [
    AppComponent,
    COMPONENTS,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppConfigModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    NgBusyModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    ngxBootstrapI,
    GooglePlaceModule,
    NgxStripeModule,
    NgxStripeModule.forRoot('pk_test_sWoCGVHDgp9jqYnCcJKUQHp0'),
    RecaptchaModule,
    RecaptchaFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    FilterPipeModule,
    NgSelectModule
  ],
  exports: [
    ngxBootstrapE
  ],
  providers: [
    Title,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: '6Lf8H38UAAAAAJqr1mDPAHjfXfqA5oLDf0eG6Yjl' } as RecaptchaSettings,
    }
  ],
  entryComponents: [ModalComponent, EditFamilyMembersComponent, AddLocationComponent, AssignMemberComponent, DeclareUserComponent,
     DeleteMemberListingComponent, SwapRoleComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
