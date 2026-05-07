import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  private _visible = new BehaviorSubject(false);
  public readonly visible$ = this._visible.asObservable();

  constructor(private _router: Router) {
    this._init();
  }

  private _init(): void {
    // Subscribe to the router events to show/hide the loading bar
    this._router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      this.show();
    });

    this._router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel,
        ),
      )
      .subscribe(() => {
        this.hide();
      });
  }

  show(): void {
    this._visible.next(true);
  }

  hide(): void {
    this._visible.next(false);
  }
}
