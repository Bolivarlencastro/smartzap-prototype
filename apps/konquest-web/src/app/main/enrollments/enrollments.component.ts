import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { Subject, takeUntil } from 'rxjs';
import { EnrollmentNavItem } from './models/enrollment-list';
import { EnrollmentsService } from './services/enrollments.service';
import { KpUserOnboardingService } from '@keeps-platform-frontend-workspace/ui/kp-user-onboarding-service';

import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
  imports: [MatTabNav, MatTabLink, RouterLinkActive, RouterLink, MatTabNavPanel, RouterOutlet, TranslocoPipe],
})
export class EnrollmentsComponent implements OnInit, OnDestroy {
  navLinks: EnrollmentNavItem[] = [];
  isMobile: boolean;

  private onDestroy$ = new Subject<void>();

  constructor(
    private enrollmentsService: EnrollmentsService,
    private _breakpointObserver: BreakpointObserver,
    private userOnboardinService: KpUserOnboardingService,
  ) {
    this.navLinks = this.enrollmentsService.getNavLinks();
  }

  ngOnInit(): void {
    this.userOnboardinService.openDialog('enrollments');
    this._breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  displayNavLabel(item: EnrollmentNavItem): string {
    return this.isMobile ? item.mobileLabel : item.label;
  }

  ngOnDestroy(): void {
    this.onDestroy$.complete();
  }
}
