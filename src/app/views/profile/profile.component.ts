import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Inject } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { map } from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';
import { User, FamilyModel, FamilyRelationShipsModel, FamilyTypesModel } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ProfileService } from '../../services/user/profile.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DateInput } from 'ngx-bootstrap/chronos/test/chain';

// RECOMMENDED
// https://brianflove.com/2016/10/18/angular-2-google-maps-places-autocomplete/
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    CommonService,
    UserService,
    ProfileService
  ]
})
export class ProfileComponent implements OnInit, AfterViewInit {
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;

  public loading: Boolean = false;
  public userModel;
  public user_profile_data;
  public user_members_data;
  public isEditForm: Boolean = false;
  public selectedIndex: Number = 1;
  public map_options: Object = {};
  public familyRelationShips: Array<FamilyRelationShipsModel> = [];
  public familyModel: FamilyModel = <FamilyModel>{};
  public familyTypesModel: Array<FamilyTypesModel>[];
  public is_valid_address: Boolean = false;
  public maxDate = new Date(moment().format('YYYY-MM-DD'));
  @ViewChild('memberForm') memberForm; // signup form

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService,
    private http: HttpClient,
    private router: Router,
  ) {
    this.userModel = new User();
    this.user_profile_data = new User();
    this.user_members_data = new User();
    this.familyModel.relation = '';
    this.familyModel.lat = 0;
    this.familyModel.lng = 0;
    this.familyModel.dob = '';
    this.route.params.subscribe(
      params => this.isEditForm = (params.edit) ? true : false
    );
  }

  ngOnInit() {
    this.loading = true;
    this.map_options = {
      types: [],
      componentRestrictions: { country: 'UK' }
    };
    this.getData();
    this.getUserDetail();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  getUserDetail() {
    this.loading = true;
    this.commonService.getService(this.config.apiEndpoint + 'userProfile', this.userModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.user_profile_data = { image: data.data.image };
          this.user_members_data = {};
          this.userModel = { name: data.data.name, email: data.data.email };
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }


  updateUser() {
    this.loading = true;
    this.userService.updateUser(this.userModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
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



  selectTab(index): void {
    this.selectedIndex = index;
  }

  checkValidAddress() {
    this.familyModel.lat = 0;
    this.familyModel.lng = 0;
  }
  handleAddressChange(address: Address) {
    // console.log('address', address);
    //  console.log('address', address.photos[0].getUrl({'maxWidth': 300, 'maxHeight': 400});
    // console.log('address.geometry.location.lat()', address.geometry.location.lat());
    // console.log('address.geometry.location.lng()', address.geometry.location.lng());
    this.familyModel.lat = address.geometry.location.lat();
    this.familyModel.lng = address.geometry.location.lng();
    this.familyModel.location = address.formatted_address;
  }

  getData() {
    this.loading = true;
    const queue = [
      this.http.get(this.config.apiEndpoint + 'getFamilyTypes'),
      this.http.get(this.config.apiEndpoint + 'getFamilyRelations')
    ];

    this.profileService.requestDataFromMultipleSources(queue)
      .subscribe((data: any) => {
        this.loading = false;
        this.familyTypesModel = data[0].data;
        this.familyRelationShips = data[1].data;
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  createFamily() {
    this.loading = true;
    const posted_date = this.familyModel.dob;
    const start_date_selected = moment(posted_date).format('YYYY-MM-DD');
    const start_date = moment(start_date_selected).unix();
    this.familyModel.dob = start_date;

    this.profileService.createFamily(this.familyModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.familyModel.dob = posted_date;
        this.loading = false;
        if (data.status === 200) {
          this.memberForm.resetForm();
          this.commonService.response(data.message, 'success');
          this.commonService.redirectWithTimeout('profile', true, 3000);
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.familyModel.dob = posted_date;
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }
}
