import { Injectable, Signal } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { KeepsNavigationItem } from './keeps-navigation-item';
import { Navigation } from './navigation.types';
import { AbstractNavigationService } from './abstract-navigation.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
  private _logo: ReplaySubject<string> = new ReplaySubject<string>(1);

  readonly navigation: Signal<KeepsNavigationItem[]>;

  /**
   * Constructor
   */
  constructor(abstractNavigation: AbstractNavigationService) {
    this.navigation = abstractNavigation.navigationItems;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for navigation
   */
  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable();
  }

  setLogo(logoSrc: string): void {
    this._logo.next(logoSrc);
  }

  logoSrc$(): Observable<string> {
    return this._logo.asObservable();
  }
}
