import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Renderer2, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { Router, Event as NavigationEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
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
