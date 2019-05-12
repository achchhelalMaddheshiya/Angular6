import { Component, OnInit, ViewChild, AfterViewInit, Inject, Output, EventEmitter } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { CommonService } from '../../services/common.service';
import { map } from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';
import { FamilyMembersModel } from '../../models/family-members';
import { FamilyMemberService } from '../../services/family-member/family-member.service';
import { HttpClient } from '@angular/common/http';
import { ModalComponent } from '../modal/modal.component';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { EditFamilyMembersComponent } from '../edit-family-members/edit-family-members.component';
import { LoginComponent } from '../login/login.component';
import Swal from 'sweetalert2';
import { DeleteMemberListingComponent } from '../../views/delete-member-listing/delete-member-listing.component';
import { SwapRoleComponent } from '../../views/swap-role/swap-role.component';


@Component({
  selector: 'app-family-members',
  templateUrl: './family-members.component.html',
  styleUrls: ['./family-members.component.scss'],
  providers: [
    CommonService,
    FamilyMemberService
  ]
})
export class FamilyMembersComponent implements OnInit, AfterViewInit {
  public familyMembersModel: FamilyMembersModel = <FamilyMembersModel>{};
  public id: Number;
  public all_members = [];
  public total: Number = 0;
  public page: Number = 1;
  public limit: Number = 1;
  public loading: Boolean = false;
  bsModalRef: BsModalRef;
  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private commonService: CommonService,
    private familyMemberService: FamilyMemberService,
    private modalService: BsModalService,
    private http: HttpClient,
  ) { }

  addNewEntry(event) {
    console.log(event);
  }

  ngOnInit() {
    this.loading = true;
    this.getMyFamilyMembers(1);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  getMyFamilyMembers(page: Number = 1) {
    const search = (this.familyMembersModel.search) ? this.familyMembersModel.search : '';
    this.loading = true;
    this.commonService.getService(this.config.apiEndpoint + 'getMyFamilyMembers', { page: page, q: search }, true)
      .pipe(map(data => data.body))
      .subscribe(data => {
        this.loading = false;
        if (data.status === 200) {
          this.all_members = data.data.data;
          this.total = data.data.total;
          this.page = data.data.current_page;
          this.limit = data.data.per_page;
        } else {
          this.commonService.response(data.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.commonService.response(error.message, 'error');
      });
  }

  editMemberModal(id) {
    const initialState = {
      member_row_id: id,
    };
    this.bsModalRef = this.modalService.show(EditFamilyMembersComponent, { initialState });
    this.bsModalRef.content.emitProfileUpdated.subscribe(this.emitProfileUpdated.bind(this));
    this.bsModalRef.content.closeBtnName = 'Cancel';
  }
  emitProfileUpdated(data: any) {
    this.getMyFamilyMembers(1);
  }

  deleteMemberModal(id, name) {
    const initialState = {
      id: id,
      title: `${name} will be automatically remove from below folders`,
      closeBtnName: 'Close'
    };
    this.bsModalRef = this.modalService.show(DeleteMemberListingComponent, { initialState });
    this.bsModalRef.content.deletedEmitter.subscribe(this.onDeleted.bind(this));
  }
  onDeleted(index) {
    this.getMyFamilyMembers(1);
  }

  swapModal(id) {
    const initialState = {
      id: id,
      title: `Swap Role`,
      closeBtnName: 'Close'
    };
    this.bsModalRef = this.modalService.show(SwapRoleComponent, { initialState });
    this.bsModalRef.content.swapedEmitter.subscribe(this.onRoleSwap.bind(this));
  }
  onRoleSwap(index) {
    this.getMyFamilyMembers(1);
  }

}
