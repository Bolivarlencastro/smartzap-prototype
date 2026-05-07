import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { Store } from '@ngrx/store';
import { LearningTrailListService } from 'app/main/learning-trail/services/learning-trail-list.service';
import { map, Observable, Subscription } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { LearnContentActions } from 'app/shared/store';
import { CollectionActions } from '../store/actions';
import { CollectionSelectors, RecommendationsSelectors } from '../store/selectors';
import {
  KpLearnContentCardComponent,
  LearnContentCardData,
} from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { ModalFilterItem, QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';
import { LearnContentActionData, LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';
import { KpUserOnboardingService } from '@keeps-platform-frontend-workspace/ui/kp-user-onboarding-service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AsyncPipe } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KpBannerV2Component } from '@keeps-platform-frontend-workspace/ui/kp-banner-v2';
import { KpLearningTrailFilterComponent } from '@keeps-platform-frontend-workspace/ui/kp-learning-trail-filter';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-learning-trails-list',
  templateUrl: './learning-trails-list.component.html',
  styleUrls: ['./learning-trails-list.component.scss'],
  animations: fuseAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InfiniteScrollDirective,
    NgxSkeletonLoaderModule,
    KpBannerV2Component,
    KpLearningTrailFilterComponent,
    KpLearnContentCardComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class LearningTrailsListComponent implements OnInit, OnDestroy {
  learningTrails$: Observable<LearnContentCardData[]>;
  learningTrailsLoading$: Observable<boolean>;

  recommendations$: Observable<LearnContentCardData[]>;
  recommendationsLoading$: Observable<boolean>;

  quickFilterSelected$: Observable<QuickFilterType>;
  protected readonly languages: Signal<ModalFilterItem[]>;
  isContentCreator$: Observable<boolean>;

  showRecommendationsEnrolled$: Observable<boolean>;
  isMobile$: Observable<boolean>;

  private readonly baseLoaderTheme = {
    'border-radius': '12px',
    height: '230px',
    width: '409px',
  };
  protected readonly webLoaderTheme = { ...this.baseLoaderTheme };
  protected readonly mobileLoaderTheme = {
    ...this.baseLoaderTheme,
    height: '188px',
    width: '344px',
  };
  private readonly navigationSub: Subscription;

  constructor(
    private store: Store,
    private _learningTrailListService: LearningTrailListService,
    private _breakpointObserver: BreakpointObserver,
    private userOnboardingService: KpUserOnboardingService,
  ) {
    this.isContentCreator$ = this._learningTrailListService.isContentCreator$;
    this.languages = this._learningTrailListService.languages;

    this.learningTrails$ = this.store.select(CollectionSelectors.selectLearningTrails);
    this.learningTrailsLoading$ = this.store.select(CollectionSelectors.selectIsLoading);
    this.quickFilterSelected$ = this.store.select(CollectionSelectors.selectCurrentQuickFilterType);
    this.showRecommendationsEnrolled$ = this.store.select(CollectionSelectors.selectShowRecommendations);

    this.recommendations$ = this.store.select(RecommendationsSelectors.selectRecommendations);
    this.recommendationsLoading$ = this.store.select(RecommendationsSelectors.selectIsLoading);

    // Restores the filter and dispatches the first load action
    this.store.dispatch(CollectionActions.loadInitialData());
  }

  ngOnInit(): void {
    this.isMobile$ = this._breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));

    this.userOnboardingService.openDialog('learning-trails');
  }

  ngOnDestroy(): void {
    this.store.dispatch(CollectionActions.resetCollectionState());
    this.navigationSub?.unsubscribe();
  }

  onScroll(): void {
    this.store.dispatch(CollectionActions.fetchMoreLearningTrails());
  }

  onQuickFilter(event: QuickFilterType) {
    this.store.dispatch(CollectionActions.filterLearningTrails({ filter: {}, newQuickFilterType: event }));
  }

  onSaveFilter(event: { languages: string[] }) {
    this.store.dispatch(CollectionActions.filterLearningTrails({ filter: { language: event.languages } }));
  }

  onSearch(search: string) {
    this.store.dispatch(CollectionActions.filterLearningTrails({ filter: { search } }));
  }

  onBannerAction(actionData: LearnContentActionData) {
    const { action, learnContent } = actionData;
    this.onLearnContentAction(action, learnContent);
  }

  onLearnContentAction(action: LearnContentCardActionId, learnContent: LearnContentCardData): void {
    const learnContentAction: LearnContentActionData = { action, learnContent, contentType: 'trail' };
    this.store.dispatch(LearnContentActions.learnContentAction({ learnContentAction }));
  }
}
