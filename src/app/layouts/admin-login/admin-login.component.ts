import { Component, OnInit, Renderer2, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { APP_CONFIG, AppConfig } from '../../app-config.module';
import { Router, Event as NavigationEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit, AfterViewInit {
  public isLoggedInData: Boolean = false;
    constructor(@Inject(DOCUMENT) private document: Document,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private renderer: Renderer2) {
    if (authService.isAuthenticated()) {
      this.isLoggedInData = true;
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }
}
