import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
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
import { FamilyMemberService } from '../../services/family-member/family-member.service';

import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DateInput } from 'ngx-bootstrap/chronos/test/chain';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-family-members',
  templateUrl: './edit-family-members.component.html',
  styleUrls: ['./edit-family-members.component.scss'],
  providers: [
    CommonService,
    UserService,
    ProfileService,
    FamilyMemberService
  ],
  encapsulation: ViewEncapsulation.None
})

export class EditFamilyMembersComponent implements OnInit, AfterViewInit {
  emitProfileUpdated: EventEmitter<any> = new EventEmitter();

  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild('memberForm') memberForm; // signup form
  @ViewChild(ModalDirective) modal: ModalDirective;
  member_row_id: Number;

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
  public minDate;
  public closeBtnName;
  public submitted: Boolean = false;
  public maxDate = new Date(moment().format('YYYY-MM-DD'));
  bsValue = new Date();
  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService,
    private familyMemberService: FamilyMemberService,
    private http: HttpClient,
    private router: Router,
    public bsModalRef: BsModalRef
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
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
      this.map_options = {
        types: [],
        componentRestrictions: { country: 'UK' }
      };
    }, 1000);
    this.getData(this.member_row_id);
  }

  checkValidAddress() {
    this.familyModel.lat = 0;
    this.familyModel.lng = 0;
  }
  handleAddressChange(address: Address) {
    this.familyModel.lat = address.geometry.location.lat();
    this.familyModel.lng = address.geometry.location.lng();
    this.familyModel.location = address.formatted_address;
  }

  getData(member_row_id) {
    this.loading = true;
    const queue = [
      this.http.get(this.config.apiEndpoint + 'getFamilyTypes'),
      this.http.get(this.config.apiEndpoint + 'getFamilyRelations'),
      this.http.get(this.config.apiEndpoint + `getFamilyProfile?${this.commonService.arrayObjectToString({ id: member_row_id })}`)
    ];

    this.profileService.requestDataFromMultipleSources(queue)
      .subscribe((data: any) => {
        this.loading = false;
        const [familyTypesModel, familyRelationShips, familyModel] = data;
        this.familyRelationShips = familyRelationShips.data;
        this.familyTypesModel = familyTypesModel.data;
        this.familyModel = familyModel.data;
        this.familyModel.dob = moment.unix(familyModel.data.dob).format('YYYY-MM-DD');
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  updateFamily() {
    this.loading = true;
    const posted_date = this.familyModel.dob;
    const start_date_selected = moment(posted_date).format('YYYY-MM-DD');
    const start_date = moment(start_date_selected).unix();
    this.familyModel.dob = start_date;
    this.familyMemberService.updateFamily(this.familyModel)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.familyModel.dob = posted_date;
        this.loading = false;
        if (data.status === 200) {
          this.commonService.response(data.message, 'success');
          this.commonService.closeSwal(1000);
          setTimeout(() => {
            this.bsModalRef.hide();
            this.emitProfileUpdated.emit('data');
          }, 2000);
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

