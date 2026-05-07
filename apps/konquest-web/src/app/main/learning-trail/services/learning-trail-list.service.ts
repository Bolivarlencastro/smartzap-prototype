import { computed, Injectable, Signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { UserCreator } from '@core/model';
import {
  AuthService,
  EnrollmentStatuses,
  LanguagesService,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { ModalFilterItem, QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { navigateToPulse, RouteDialogService } from 'app/shared/services';
import {
  LearningTrail,
  LearningTrailFilter,
  LearningTrailListPayload,
  LearningTrailNavigationContext,
} from '../model/learning-trail';
import { LearningTrailDetailComponent } from '../pages/detail/learning-trail-detail.component';
import { mapTrailsToContentCard, mapTrailsToLearnContentCard } from 'app/shared/utils/card-helpers';
import { isEvent } from '@app/shared/utils/event.utils';
import { TrailsSearchService } from 'app/main/mission/services/trails-search.service';
import { TrailsListParams } from '@core/model/search-api';

@Injectable({ providedIn: 'root' })
export class LearningTrailListService {
  public static readonly KEY_LEARNING_TRAIL_FILTER_LANGUAGE = 'LEARNING_TRAIL_FILTER_LANGUAGE';
  readonly languages: Signal<ModalFilterItem[]>;

  private readonly _isContentCreator: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isContentCreator$ = this._isContentCreator.asObservable();

  detailDialogRef!: MatDialogRef<LearningTrailDetailComponent>;

  constructor(
    private _dialog: MatDialog,
    private _learningTrailAPI: LearningTrailAPI,
    private _authService: AuthService,
    private _userProfileService: UserProfileService,
    private routeDialogService: RouteDialogService,
    private _router: Router,
    private trailsSearchService: TrailsSearchService,
    private languagesService: LanguagesService,
  ) {
    this.listenToRoles();
    this.languages = this.buildLanguagesFilterOptions();
  }

  getFilterLanguages(): string[] {
    const cache = localStorage.getItem(LearningTrailListService.KEY_LEARNING_TRAIL_FILTER_LANGUAGE);

    if (cache) {
      return JSON.parse(cache);
    }

    return [];
  }

  openDetailDialog(): void {
    this.detailDialogRef = this._dialog.open(LearningTrailDetailComponent, {
      autoFocus: 'dialog',
      panelClass: 'route-dialog-container',
    });

    this.detailDialogRef.afterClosed().subscribe((context) => {
      if (context?.pulseId) {
        this.navigateToPulse(context);
      } else if (context) {
        this.navigateToMission(context);
      }
      this.routeDialogService.onDialogClosed();
    });
  }

  closeDialog() {
    this.detailDialogRef?.close();
  }

  loadLearningTrails(
    quickFilterType: QuickFilterType,
    currentFilter: LearningTrailFilter,
  ): Observable<LearningTrailListPayload> {
    this.saveFilterLanguages(currentFilter.language || []);
    const isSuperAdmin = this._userProfileService.isSuperAdmin();

    const filter = this.getFilter(quickFilterType, currentFilter);

    return this.trailsSearchService.fetchTrails(filter).pipe(
      map(({ items, total, last_page, page }) => {
        return {
          count: total,
          finished: last_page === page,
          results: mapTrailsToContentCard(items, isSuperAdmin),
        };
      }),
    );
  }

  loadLearningTrailById(id: string): Observable<LearningTrail> {
    return this._learningTrailAPI.getById(id);
  }

  loadLearningTrailRecommendations() {
    const filter = { per_page: 3, user: this._authService.userId };
    return this._learningTrailAPI
      .getRecommendationsLearningTrails(filter)
      .pipe(map(({ results }) => mapTrailsToLearnContentCard(results, true)));
  }

  private navigateToPulse(context: LearningTrailNavigationContext): void {
    navigateToPulse(this._router, context.pulseId);
  }

  private navigateToMission(context: LearningTrailNavigationContext): void {
    const { mission, trailId, openDetail } = context;
    const isEventModel = isEvent(mission?.mission_model);
    const route = isEventModel ? 'E' : 'C';
    const openMissionModal =
      openDetail ||
      isEventModel ||
      ((mission.user_creator as UserCreator).id !== this._authService.userId && !mission.enrollment?.status);
    const path = openMissionModal ? `/${route}/${mission.id}` : `/course/${mission.id}`;
    const queryParams = openMissionModal ? {} : { queryParams: { rollbackPath: [`/T/${trailId}?rti=true`] } };
    this._router.navigate([path], queryParams);
  }

  private listenToRoles(): void {
    this._userProfileService.roles$.pipe(filter((roles) => !!roles?.length)).subscribe(() => {
      const isCreator = this._userProfileService.isCurator();
      this._isContentCreator.next(isCreator);
    });
  }

  private getFilter(selectedQuickFilterType: QuickFilterType, filter: TrailsListParams): TrailsListParams {
    const managed = selectedQuickFilterType === QuickFilterType.MINE ? true : undefined;
    const is_active = selectedQuickFilterType === QuickFilterType.MINE ? undefined : true;
    const language = filter.language;
    const exclude_enrollment_status = managed
      ? undefined
      : [
          EnrollmentStatuses.COMPLETED,
          EnrollmentStatuses.INACTIVATED,
          EnrollmentStatuses.EXPIRED,
          EnrollmentStatuses.GIVE_UP,
          EnrollmentStatuses.REPROVED,
        ];
    return { ...filter, managed, is_active, language, exclude_enrollment_status };
  }

  private saveFilterLanguages(languages: string[]): void {
    if (languages?.length) {
      localStorage.setItem(LearningTrailListService.KEY_LEARNING_TRAIL_FILTER_LANGUAGE, JSON.stringify(languages));
      return;
    }
    localStorage.removeItem(LearningTrailListService.KEY_LEARNING_TRAIL_FILTER_LANGUAGE);
  }

  private buildLanguagesFilterOptions(): Signal<ModalFilterItem[]> {
    return computed(() => {
      const selectedOptions = this.getFilterLanguages();
      return this.languagesService.languagesTypes().map((language) => ({
        name: language,
        checked: selectedOptions.includes(language),
      }));
    });
  }
}
