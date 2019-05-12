import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Inject } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdsCreateModel, AdsModel, AdStatModel } from '../../models/ads';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ads-component',
  templateUrl: './ads-component.component.html',
  styleUrls: ['./ads-component.component.scss']
})
export class AdsComponentComponent implements OnInit {
  @Input() slug: any;
  public loading: Boolean = false;
  public adsCreateModel: AdsCreateModel = <AdsCreateModel>{};
  public adsModel: AdsModel = <AdsModel>{};
  public adStatModel: AdStatModel = <AdStatModel>{};

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private commonService: CommonService,
    private http: HttpClient,
    private router: Router,
    location: Location
  ) { }

  ngOnInit() {
    this.getDetail();
  }

  getDetail() {
    this.loading = true;
    this.adsCreateModel.slug = this.slug;
    this.commonService.getService(this.config.apiEndpoint + 'getAds', this.adsCreateModel, true)
      .pipe(map(data => data.body))
      .subscribe(data => {
        console.log(data.headers);
        this.loading = false;
        if (data.status === 200) {
          this.adsModel = data.data;
        }
      }, error => {
      });
  }
  redirect(input) {
    if (input.link !== undefined) {
      this.loading = true;
      this.adStatModel.id = input.id;
      this.commonService.createService(this.config.apiEndpoint + 'saveAdStats', this.adStatModel)
        .pipe(map(data => data.body))
        .subscribe((data: any) => {
          this.loading = false;
          if (data.status === 200) {
            (window as any).open(input.link, '_blank');
          }
        }, error => {
        });
    }
  }
}
