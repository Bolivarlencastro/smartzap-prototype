import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, computed, ElementRef, OnDestroy, OnInit, Signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguagesService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { Store } from '@ngrx/store';
import { MissionScreenType, MissionsFilter } from 'app/main/mission/mission.model';
import { LearnContentActions } from 'app/shared/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MissionsActions, missionsFeature } from '../../store';
import { toSignal } from '@angular/core/rxjs-interop';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { FilterActions, ModalFilterItem, QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';
import { CourseFilter, KpCourseFilterComponent } from '@keeps-platform-frontend-workspace/ui/kp-course-filter';
import { LearnContentActionData } from '@keeps-platform-frontend-workspace/ui/models';
import { KpUserOnboardingService } from '@keeps-platform-frontend-workspace/ui/kp-user-onboarding-service';
import { AsyncPipe } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { KpBannerV2Component } from '@keeps-platform-frontend-workspace/ui/kp-banner-v2';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AllMissionsComponent } from '../../components';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss'],
  animations: fuseAnimations,
  imports: [
    InfiniteScrollDirective,
    KpBannerV2Component,
    NgxSkeletonLoaderModule,
    KpCourseFilterComponent,
    AllMissionsComponent,
    AsyncPipe,
  ],
})
export class MissionsComponent implements OnInit, OnDestroy {
  @ViewChild('missions') missions: ElementRef;

  missions$: Observable<LearnContentCardData[]>;
  missionsLoading$: Observable<boolean>;
  recommendations$: Observable<LearnContentCardData[]>;
  recommendationsLoading$: Observable<boolean>;
  filter$: Observable<MissionsFilter>;
  categories$: Observable<ModalFilterItem[]>;
  providers$: Observable<ModalFilterItem[]>;
  emptyMessage$: Observable<string>;
  shouldDisplayBanner$: Observable<boolean>;

  filterActions$: Observable<FilterActions[]>;
  isCreator$: Observable<boolean>;
  isMobile$: Observable<boolean>;
  protected readonly languages: Signal<ModalFilterItem[]>;

  constructor(
    _router: Router,
    private _route: ActivatedRoute,
    private _userProfileService: UserProfileService,
    private _breakpointObserver: BreakpointObserver,
    private languagesService: LanguagesService,
    private store: Store,
    private userOnboardingService: KpUserOnboardingService,
  ) {
    const screenType = _router.url.replace('/', '') as MissionScreenType;
    store.dispatch(
      MissionsActions.init({
        screenType,
      }),
    );

    this.userOnboardingService.openDialog(screenType);

    this.missions$ = store.select(missionsFeature.selectCourses);
    this.missionsLoading$ = store.select(missionsFeature.selectMissionsLoading);
    this.recommendations$ = store.select(missionsFeature.selectRecommendations);
    this.recommendationsLoading$ = store.select(missionsFeature.selectRecommendationsLoading);
    this.filter$ = store.select(missionsFeature.selectFilter);
    this.categories$ = store.select(missionsFeature.selectBuiltCategories);
    this.providers$ = store.select(missionsFeature.selectBuiltProviders);
    this.emptyMessage$ = store.select(missionsFeature.selectEmptyMessage);
    this.shouldDisplayBanner$ = store.select(missionsFeature.selectShouldDisplayBanner);

    this.filterActions$ = this._userProfileService.roles$.pipe(map(() => this.buildFilterActions()));
    this.isCreator$ = this._userProfileService.isCurator$();

    const filterLanguages = toSignal(store.select(missionsFeature.selectFilterLanguages));
    this.languages = computed(() => {
      return this.languagesService.languagesTypes().map((language) => ({
        name: language,
        checked: filterLanguages()?.includes(language),
      }));
    });
  }

  ngOnInit(): void {
    this.isMobile$ = this._breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));
  }

  ngOnDestroy(): void {
    this.store.dispatch(MissionsActions.resetState());
  }

  onScroll(): void {
    this.store.dispatch(MissionsActions.loadMoreMissions());
  }

  onQuickFilter(type: QuickFilterType): void {
    const filter = { type };
    this.store.dispatch(MissionsActions.filter({ filter }));
    this.scrollTop();
  }

  onSearch(search: string): void {
    const filter = { search };
    this.store.dispatch(MissionsActions.filter({ filter }));
    this.scrollTop();
  }

  onFilter(filter: CourseFilter): void {
    this.store.dispatch(MissionsActions.filter({ filter }));
    this.scrollTop();
  }

  private scrollTop(): void {
    this.missions?.nativeElement.scrollIntoView();
  }

  private buildFilterActions(): FilterActions[] {
    return [
      ...(this._userProfileService.isCurator()
        ? [
            {
              name: 'MISSIONS.MY_MISSIONS',
              type: QuickFilterType.MINE,
              icon: 'edit',
            },
          ]
        : []),
      {
        name: 'MISSIONS.MY_LIST',
        type: QuickFilterType.MY_LIST,
        icon: 'bookmark',
      },
    ];
  }

  onLearnContentAction(learnContentAction: LearnContentActionData) {
    this.store.dispatch(LearnContentActions.learnContentAction({ learnContentAction }));
  }
}
