import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Renderer2, Inject, ElementRef, Input } from '@angular/core';
import { Router, Event as NavigationEvent, NavigationEnd, ActivatedRoute, NavigationStart, ActivationEnd, Data } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

// https://alligator.io/angular/using-renderer2/

// https://loiane.com/2017/08/angular-hide-navbar-login-page/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private routeData;

  public constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private renderer: Renderer2,
    private authService: AuthService,
  ) {
    /*if (authService.isAuthenticated()) {
      this.router.navigate(['dashboard']);
    }*/
    this.router.events
      .subscribe((event) => {
        if (event instanceof ActivationEnd) {
          if (event.snapshot.data.public === false && this.authService.isAuthenticated()) {
            this.router.navigate(['dashboard']);
            return false;
          }
        }
      });

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    ).subscribe(data => {
      this.renderer.removeAttribute(this.document.body, 'class');
      if (data.class && data.class !== '') {
        this.renderer.addClass(this.document.body, data.class);
      }
      this.titleService.setTitle(data.title);
    });
  }

  ngOnInit() {
  }
}
