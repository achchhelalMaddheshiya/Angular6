/// <reference types="@types/googlemaps" />
import {
  Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation, Output, EventEmitter, Input,
  AfterContentInit
} from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DateInput } from 'ngx-bootstrap/chronos/test/chain';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { CommonService } from '../../services/common.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { AddLocationModel } from '../../models/vault';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddLocationComponent implements OnInit, AfterViewInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  latitude: any;
  longitude: any;
  iconBase = 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png';
  isHidden = false;
  public showMap = false;
  // map sends
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild(ModalDirective) modal: ModalDirective;
  @ViewChild(NgForm) locationForm: NgForm;
  @Input() folder_id: Number;
  @Input() selectedTab: Number;

  @Output() locationAddedEmitter: EventEmitter<any> = new EventEmitter();
  public loading: Boolean = false;
  public map_options: Object = {};
  public is_valid_address: Boolean = false;
  public addLocationModel: AddLocationModel = <AddLocationModel>{};
  public closeBtnName;
  public id: any;
  public tab_id: any;
  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private dashboardService: DashboardService,
    private modalService: BsModalService,
    private router: Router,
    public bsModalRef: BsModalRef
  ) {
  }

  ngOnInit() {
    this.id = this.folder_id;
    this.tab_id = this.selectedTab;
    this.loading = true;
    this.map_options = {
      types: [],
      componentRestrictions: { country: 'UK' }
    };
    this.loading = false;
    const mapProp = {
      center: new google.maps.LatLng(51.5073509, -0.12775829999998223),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  setCenter() {
    const map_created = new google.maps.LatLng(this.addLocationModel.lat, this.addLocationModel.lng);
    this.map.setCenter(map_created);
    this.map.setZoom(15);

    const marker = new google.maps.Marker({
      position: map_created,
      map: this.map,
      icon: this.iconBase,
      title: this.addLocationModel.meta_value
    });
    // marker.addListener('click', this.simpleMarkerHandler);
    marker.addListener('click', () => {
      this.markerHandler(marker);
    });
  }

  simpleMarkerHandler() {
    alert('Simple Component\'s function...');
  }

  markerHandler(marker: google.maps.Marker) {
    Swal(`Selected location: ${marker.getTitle()}`);
  }

  toggleMap() {
    this.isHidden = !this.isHidden;
    this.gmapElement.nativeElement.hidden = this.isHidden;
  }

  checkValidAddress() {
    this.addLocationModel.lat = 0;
    this.addLocationModel.lng = 0;
  }
  handleAddressChange(address: Address) {
    this.addLocationModel.lat = address.geometry.location.lat();
    this.addLocationModel.lng = address.geometry.location.lng();
    this.addLocationModel.meta_value = address.formatted_address;
    this.setCenter();
  }

  saveLocation(event: any) {
    if (this.addLocationModel.file) {
      this.loading = true;
      const formData = new FormData;
      formData.append('meta_key', (this.tab_id === 0) ? 'been' : 'go');
      formData.append('attribute_types', 'locations');
      formData.append('folder_id', this.id);
      formData.append('file', this.addLocationModel.file);
      formData.append('meta_description', this.addLocationModel.meta_description);
      formData.append('meta_value', this.addLocationModel.meta_value);
      formData.append('lat', this.addLocationModel.lat);
      formData.append('lng', this.addLocationModel.lng);

      this.commonService.uploadFile(this.config.apiEndpoint + 'writeFolder', formData)
        .subscribe((data: any) => {
          this.loading = false;
          if (data.status === 200) {
            setTimeout(() => {
              this.locationForm.resetForm();
            }, 800);
            this.commonService.response(data.message, 'success');
            this.commonService.closeSwal(2000);
            setTimeout(() => {
              this.bsModalRef.hide();
              this.locationAddedEmitter.emit(this.tab_id);
            }, 2000);
          } else {
            this.commonService.response(data.message, 'error');
          }
        }, error => {
          this.loading = false;
          this.commonService.response(error.message, 'error');
        });
    }
  }

  upload(event: any) {
    const elem = event.target;
    if (elem.files.length > 0) {
      const formData = new FormData;
      this.addLocationModel.file = elem.files[0];
    }
  }


}
