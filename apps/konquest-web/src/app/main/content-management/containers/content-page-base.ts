import { computed, Directive, input, Signal } from '@angular/core';
import { LearnContentListFilter, LearnContentManagementType } from '../models/learn-content-list-filter';
import { Store } from '@ngrx/store';
import { LearnContentListItem } from '../models/learn-content-list-item';
import { ContentManagementListActions } from '../store/actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { contentManagementListFeature } from '../store/content-management-list.feature';
import { Language, LanguagesService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { PageEvent } from '@angular/material/paginator';
import { LearnContentListItemEvent } from 'app/main/content-management/models/learn-content-list-item-event';

/**
 * Abstract class used to list learn contents inside the content management page.
 *
 * Each inheritor must call `loadContents()` inside the `ngOnInit` method as it is the first point where the `contentType`
 * input is available.
 */
@Directive()
export abstract class ContentPageBaseComponent {
  // The content type that is going to be displayed on this page, retrieved via the router data
  protected readonly contentType = input<LearnContentManagementType>();
  protected readonly learnContents: Signal<LearnContentListItem[]>;
  protected readonly loading: Signal<boolean>;
  protected readonly totalItems: Signal<number>;
  protected readonly currentPage: Signal<number>;
  protected readonly perPage: Signal<number>;
  protected readonly filter: Signal<LearnContentListFilter>;
  protected readonly languages: Signal<Language[]>;
  protected readonly forceFilterOnlyManaged: boolean;

  constructor(
    protected readonly store: Store,
    protected readonly languagesService: LanguagesService,
    protected readonly userProfileService: UserProfileService,
  ) {
    this.learnContents = toSignal(this.store.select(contentManagementListFeature.selectItems));
    this.loading = toSignal(this.store.select(contentManagementListFeature.selectIsLoading));
    this.totalItems = toSignal(this.store.select(contentManagementListFeature.selectTotalItems));
    this.filter = toSignal(this.store.select(contentManagementListFeature.selectFilter));
    this.languages = this.languagesService.languages;
    this.currentPage = computed(() => {
      const filter = this.filter();
      return filter.page;
    });
    this.perPage = computed(() => {
      const filter = this.filter();
      return filter.per_page;
    });

    this.forceFilterOnlyManaged = this.shouldForceFilterOnlyManaged();
  }

  protected loadContents() {
    this.store.dispatch(
      ContentManagementListActions.loadLearnContentsByType({
        contentType: this.contentType(),
        forceFilterOnlyManaged: this.forceFilterOnlyManaged,
      }),
    );
  }

  protected filterChanged(filter: Partial<LearnContentListFilter>) {
    this.store.dispatch(ContentManagementListActions.setFilter({ filter }));
  }

  protected pageChanged(event: PageEvent) {
    const page = event.pageIndex + 1;
    const perPage = event.pageSize;
    this.store.dispatch(ContentManagementListActions.setPagination({ page, perPage }));
  }

  protected onItemAction(event: LearnContentListItemEvent) {
    this.store.dispatch(ContentManagementListActions.executeAction({ event }));
  }

  private shouldForceFilterOnlyManaged() {
    if (this.userProfileService.isAdmin() || this.userProfileService.isSuperAdmin()) {
      return false;
    }

    return this.userProfileService.hasRoles(['instructor', 'content']);
  }
}
