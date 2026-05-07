import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { filter, map, Observable, take } from 'rxjs';
import { InnerNavItem } from '../components';
import { ProfileService } from '../services';
import { BreakpointObserver } from '@angular/cdk/layout';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { InnerNavComponent } from '../components/inner-nav/inner-nav.component';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-profile',
  template: `
    <app-inner-nav
      [title]="'PROFILE_FEATURE.GENERAL.SETTINGS' | transloco"
      [items]="navItems$ | async"
      [isMobile]="isMobile$ | async"
    >
      <div class="pb-3 flex-1 max-xxs:p-3">
        <h1 class="font-bold text-2xl hidden xxs:block">{{ title$ | async | transloco }}</h1>
        <h2 class="mb-3 text-sm xxs:mt-6 xxs:text-base" [innerHTML]="subtitle$ | async | transloco"></h2>
        <router-outlet></router-outlet>
      </div>
    </app-inner-nav>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InnerNavComponent, RouterOutlet, AsyncPipe, TranslocoPipe],
})
export class ProfileComponent implements OnInit {
  navItems$: Observable<InnerNavItem[]>;
  title$: Observable<string>;
  subtitle$: Observable<string>;
  isMobile$: Observable<boolean>;

  constructor(
    private service: ProfileService,
    private _breakpointObserver: BreakpointObserver,
  ) {
    this.navItems$ = this.service.navItems$;
    this.title$ = this.service.title$;
    this.subtitle$ = this.service.subtitle$;
  }

  ngOnInit(): void {
    this.isMobile$ = this._breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));

    this.service.userProfile$
      .pipe(
        filter((profile) => !!profile),
        take(1),
      )
      .subscribe(() => this.service.fetchUser());
  }
}
