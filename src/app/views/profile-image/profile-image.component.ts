import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Inject } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
  providers: [
    CommonService
  ],
})
export class ProfileImageComponent implements OnInit, AfterViewInit {
  @Input() user_profile_data: User;
  public loading: Boolean = false;

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private commonService: CommonService,
  ) {
  }
  ngOnInit() {
    this.loading = true;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  // Function to upload user image
  upload(event: any) {
    this.loading = true;
    const elem = event.target;
    if (elem.files.length > 0) {
      const formData = new FormData;
      formData.append('image', elem.files[0]);
      this.commonService.uploadFile(this.config.apiEndpoint + 'uploadProfileImage', formData)
        .subscribe((data: any) => {
          event.srcElement.value = null;
          this.loading = false;
          if (data.status === 200) {
            this.user_profile_data = { image: data.image };
            this.commonService.response(data.message, 'success');
          } else {
            this.commonService.response(data.message, 'error');
          }
        }, (data: any) => {
          this.loading = false;
          this.commonService.response(data.message, 'error');
        });
    }
  }

}
