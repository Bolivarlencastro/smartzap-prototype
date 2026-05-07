import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter, take, tap } from 'rxjs';

@Injectable()
export class FuseSplashScreenService {
  /**
   * Constructor
   */
  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
  ) {
    // Hide it on the first NavigationEnd event
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
        tap(() => this.completeProgress()),
        delay(500),
      )
      .subscribe(() => {
        this.hide();
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show the splash screen
   */
  show(): void {
    this._document.body.querySelector('#fuse-splash-screen').classList.remove('fuse-splash-screen-hidden');
  }

  /**
   * Hide the splash screen
   */
  hide(): void {
    this._document.body.querySelector('#fuse-splash-screen').classList.add('fuse-splash-screen-hidden');
  }

  private completeProgress() {
    const progressBar = this._document.body.querySelector('.progress');

    if (progressBar) {
      progressBar.style.width = '100%';
      progressBar.style.transition = 'width 0.5s ease-in-out';
    }
  }
}
