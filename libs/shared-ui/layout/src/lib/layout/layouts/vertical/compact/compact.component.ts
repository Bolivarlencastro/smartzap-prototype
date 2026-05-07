import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Signal, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '../../../../components';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { FuseMediaWatcherService } from '../../../../services';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'compact-layout',
  templateUrl: './compact.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CompactLayoutComponent implements OnInit, OnDestroy {
  @Input() enableGlobalSearch = false;
  @Input() fullscreenTooltip = '';
  @Output() logoClick = new EventEmitter<void>();
  isScreenSmall: boolean;
  logoSrc: Observable<string>;
  navigation: Signal<FuseNavigationItem[]>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    protected _navigationService: NavigationService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
  ) {
    this.logoSrc = _navigationService.logoSrc$();
    this.navigation = _navigationService.navigation;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle navigation
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }
}
