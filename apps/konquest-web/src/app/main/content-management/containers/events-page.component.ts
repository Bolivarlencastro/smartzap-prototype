import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';

import { ContentPageBaseComponent } from './content-page-base';
import { EventsListComponent } from '../components/events-list/events-list.component';
import { MissionCategory } from 'app/main/mission/mission.model';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { categoriesFeature } from 'app/shared/store';
import { ContentManagementListActions } from '../store/actions';
import { EventsFiltersComponent } from '../components/filters/events-filters.component';
import { LanguagesService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

@Component({
  selector: 'app-events-page',
  imports: [EventsListComponent, EventsFiltersComponent, KpTableLayoutComponent],
  template: `
    <kp-table-layout
      class="grow"
      [totalItems]="totalItems()"
      [pageIndex]="currentPage() - 1"
      [pageSize]="perPage()"
      (pageChange)="pageChanged($event)"
      (searchChange)="filterChanged({ search: $event })"
    >
      <app-events-filters
        kpTableFilterAfter
        [categories]="categories()"
        [isContentCreator]="forceFilterOnlyManaged"
        (filterChange)="filterChanged($event)"
      ></app-events-filters>

      <app-events-list
        kpTable
        [learnContents]="learnContents()"
        [isLoading]="loading()"
        (itemAction)="onItemAction($event)"
      ></app-events-list>
    </kp-table-layout>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent extends ContentPageBaseComponent implements OnInit {
  protected readonly categories: Signal<MissionCategory[]>;

  constructor(
    protected override readonly store: Store,
    protected override readonly languagesService: LanguagesService,
    protected override readonly userProfileService: UserProfileService,
  ) {
    super(store, languagesService, userProfileService);
    this.categories = toSignal(this.store.select(categoriesFeature.selectMissions));
  }

  ngOnInit() {
    this.loadContents();
    this.store.dispatch(ContentManagementListActions.loadCoursesFilterData());
  }
}
