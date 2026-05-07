import {
  Component,
  DOCUMENT,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UiService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { filter, Subject, takeUntil } from 'rxjs';
import { AppConfig } from '../config/fuse-config';
import { FuseConfigService, FusePlatformService } from '../services';
import { NavigationService } from '../services/navigation/navigation.service';
import { FUSE_VERSION } from '../version';
import { Layout } from './layout.types';

@Component({
  selector: 'fuse-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class LayoutComponent implements OnInit, OnDestroy {
  @Input() enableGlobalSearch = false;
  @Input() fullscreenTooltip = '';
  @Output() logoClick = new EventEmitter<void>();
  config: AppConfig;
  layout: Layout;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private readonly defaultWorkspaceLogo = 'https://assets.keepsdev.com/images/avatars/company_blue.png';

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,
    private _router: Router,
    private _fuseConfigService: FuseConfigService,
    private _fusePlatformService: FusePlatformService,
    private _uiService: UiService,
    private _navigationService: NavigationService,
  ) {
    this._uiService.workspaceIcon$
      .pipe(
        filter((iconUrl) => !!iconUrl),
        takeUntil(this._unsubscribeAll),
      )
      .subscribe((iconUrl: string) => {
        this._navigationService.setLogo(iconUrl || this.defaultWorkspaceLogo);
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this._fuseConfigService.config$.pipe(takeUntil(this._unsubscribeAll)).subscribe((config: AppConfig) => {
      // Store the config
      this.config = config;

      // Update the layout
      this._updateLayout();
    });

    // Subscribe to NavigationEnd event
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll),
      )
      .subscribe(() => {
        // Update the layout
        this._updateLayout();
      });

    // Set the app version
    this._renderer2.setAttribute(this._document.querySelector('[ng-version]'), 'fuse-version', FUSE_VERSION);

    // Set the OS name
    this._renderer2.addClass(this._document.body, this._fusePlatformService.osName);
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
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update the selected layout
   */
  private _updateLayout(): void {
    // Get the current activated route
    let route = this._activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    // 1. Set the layout from the config
    this.layout = this.config.layout;

    // 2. Get the query parameter from the current route and
    // set the layout and save the layout to the config
    const layoutFromQueryParam = route.snapshot?.queryParamMap.get('layout') as Layout;
    if (layoutFromQueryParam) {
      this.layout = layoutFromQueryParam;
      if (this.config) {
        this.config.layout = layoutFromQueryParam;
      }
    }

    // 3. Iterate through the paths and change the layout as we find
    // a config for it.
    //
    // The reason we do this is that there might be empty grouping
    // paths or componentless routes along the path. Because of that,
    // we cannot just assume that the layout configuration will be
    // in the last path's config or in the first path's config.
    //
    // So, we get all the paths that matched starting from root all
    // the way to the current activated route, walk through them one
    // by one and change the layout as we find the layout config. This
    // way, layout configuration can live anywhere within the path and
    // we won't miss it.
    //
    // Also, this will allow overriding the layout in any time so we
    // can have different layouts for different routes.
    const paths = route.pathFromRoot;
    paths.forEach((path) => {
      // Check if there is a 'layout' data
      if (path?.routeConfig?.data?.['layout']) {
        // Set the layout
        this.layout = path.routeConfig.data['layout'];
      }
    });
  }
}
