import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';

import { CoursesListComponent } from '../components/courses-list/courses-list.component';
import { ContentPageBaseComponent } from './content-page-base';
import { CoursesFiltersComponent } from '../components/filters/courses-filters.component';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { Store } from '@ngrx/store';
import { LanguagesService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { toSignal } from '@angular/core/rxjs-interop';
import { categoriesFeature, providersFeature } from 'app/shared/store';
import { MissionCategory, MissionProvider } from 'app/main/mission/mission.model';
import { ContentManagementListActions } from '../store/actions';

@Component({
  selector: 'app-courses-page',
  imports: [CoursesListComponent, CoursesFiltersComponent, KpTableLayoutComponent],
  template: `
    <kp-table-layout
      class="grow"
      [totalItems]="totalItems()"
      [pageIndex]="currentPage() - 1"
      [pageSize]="perPage()"
      (pageChange)="pageChanged($event)"
      (searchChange)="filterChanged({ search: $event })"
    >
      <app-courses-filters
        kpTableFilterAfter
        [languages]="languages()"
        [categories]="categories()"
        [providers]="providers()"
        [isContentCreator]="forceFilterOnlyManaged"
        (filterChange)="filterChanged($event)"
      ></app-courses-filters>

      <app-courses-list
        kpTable
        [learnContents]="learnContents()"
        [isLoading]="loading()"
        (itemAction)="onItemAction($event)"
      ></app-courses-list>
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
export class CoursesPageComponent extends ContentPageBaseComponent implements OnInit {
  protected readonly categories: Signal<MissionCategory[]>;
  protected readonly providers: Signal<MissionProvider[]>;

  constructor(
    protected override readonly store: Store,
    protected override readonly languagesService: LanguagesService,
    protected override readonly userProfileService: UserProfileService,
  ) {
    super(store, languagesService, userProfileService);
    this.categories = toSignal(store.select(categoriesFeature.selectMissions));
    this.providers = toSignal(store.select(providersFeature.selectProviders));
  }

  ngOnInit() {
    this.loadContents();
    this.store.dispatch(ContentManagementListActions.loadCoursesFilterData());
  }
}
