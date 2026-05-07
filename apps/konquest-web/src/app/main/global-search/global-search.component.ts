import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { updateDialogSize } from '@core/model/dialog.model';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { GlobalSearchItem, ItemType } from '@keeps-platform-frontend-workspace/ui/kp-global-search-item';
import {
  ContentTypeTab,
  ContentTypeTabs,
  KpGlobalSearchListComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-global-search-list';
import {
  GlobalSearchFilter,
  GlobalSearchFilterOptions,
  KpGlobalSearchSideFilterComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-global-search-side-filter';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { GlobalSearchActions } from './store/actions';
import { GlobalSearchSelectors } from './store/selectors';
import { AsyncPipe } from '@angular/common';
import { KpGlobalSearchMobileComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-mobile';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  imports: [
    KpGlobalSearchMobileComponent,
    KpGlobalSearchInputComponent,
    MatIconButton,
    MatIcon,
    KpGlobalSearchListComponent,
    KpGlobalSearchSideFilterComponent,
    AsyncPipe,
  ],
})
export class GlobalSearchComponent implements OnInit {
  @ViewChild(KpGlobalSearchListComponent) list: KpGlobalSearchListComponent;

  items$: Observable<GlobalSearchItem[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  loadingMore$: Observable<boolean>;
  searchTerm$: Observable<string>;
  activeTab$: Observable<ContentTypeTabs>;
  isMobile$: Observable<boolean>;
  filterOptions$: Observable<GlobalSearchFilterOptions>;
  activeFilters$: Observable<GlobalSearchFilter>;
  tabs$: Observable<ContentTypeTab[]>;

  constructor(
    private store: Store,
    private _breakpointObserver: BreakpointObserver,
    dialogRef: MatDialogRef<GlobalSearchComponent>,
  ) {
    updateDialogSize(dialogRef, _breakpointObserver, { width: '75vw', height: '85vh' });
    this.store.dispatch(GlobalSearchActions.openDialog());
    this.items$ = this.store.select(GlobalSearchSelectors.selectItems);
    this.count$ = this.store.select(GlobalSearchSelectors.selectCount);
    this.loading$ = this.store.select(GlobalSearchSelectors.selectLoading);
    this.loadingMore$ = this.store.select(GlobalSearchSelectors.selectLoadingMore);
    this.searchTerm$ = this.store.select(GlobalSearchSelectors.selectSearchTerm);
    this.activeTab$ = this.store.select(GlobalSearchSelectors.selectActiveTab);
    this.filterOptions$ = this.store.select(GlobalSearchSelectors.selectFilterOptions);
    this.activeFilters$ = this.store.select(GlobalSearchSelectors.selectFilter);
    this.tabs$ = this.store.select(GlobalSearchSelectors.selectTabs);
  }

  ngOnInit(): void {
    this.isMobile$ = this._breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));
  }

  updateFilter(filter: GlobalSearchFilter): void {
    this.store.dispatch(GlobalSearchActions.updateFilter({ filter }));
  }

  cleanFilter(): void {
    this.store.dispatch(GlobalSearchActions.cleanFilter());
  }

  onOpenDetails(item: GlobalSearchItem): void {
    const { type, id, pulse_type } = item;
    switch (type) {
      case ItemType.TRAIL:
        this.store.dispatch(GlobalSearchActions.openTrailDetails({ id }));
        break;
      case ItemType.COURSE:
        this.store.dispatch(GlobalSearchActions.openMissionDetails({ id }));
        break;
      case ItemType.EVENT:
        this.store.dispatch(GlobalSearchActions.openEventDetails({ id }));
        break;
      case ItemType.CHANNEL:
        this.store.dispatch(GlobalSearchActions.openChannelDetails({ id }));
        break;
      case ItemType.PULSE:
        this.store.dispatch(GlobalSearchActions.openPulseDetails({ id, pulse_type }));
        break;
      default:
        throw new Error('Invalid Content Type: ' + type);
    }
  }

  fetchMoreItems() {
    this.store.dispatch(GlobalSearchActions.fetchMoreItems());
  }

  resetState(): void {
    this.store.dispatch(GlobalSearchActions.resetState());
  }

  changeContentType(contentType: ContentTypeTabs): void {
    this.store.dispatch(GlobalSearchActions.updateFilter({ filter: { contentType } }));
  }

  onOpenContent(item: GlobalSearchItem): void {
    if (item.type === ItemType.TRAIL) {
      this.store.dispatch(GlobalSearchActions.openContentOnTrail({ id: item.id }));
      return;
    }

    this.store.dispatch(
      GlobalSearchActions.openContent({
        item: {
          id: item.id,
          mission_model: item.course_model,
          ...(item.external_course && { external_url: item.external_course.course_url }),
        },
      }),
    );
  }

  toggleFilter() {
    this.list.toggleFilter();
  }
}
