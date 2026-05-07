import { Injectable } from '@angular/core';
import { CoursesResponse, PageResponse } from '@core/model/search-api';
import { QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Mission, MissionScreenType, MissionsFilter } from 'app/main/mission/mission.model';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { map, tap } from 'rxjs/operators';
import { CourseSearchService } from 'app/main/mission/services/courses-search.service';
import { Observable } from 'rxjs';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable()
export class CourseListService {
  public static DEFAULT_ERROR_MESSAGE = marker('MISSIONS.NOT_FIND_MISSIONS');

  constructor(
    private _missionService: MissionServiceV2,
    private _courseSearchService: CourseSearchService,
    private _messageService: KpMessageService,
  ) {}

  fetchRecommendations(): Observable<Mission[]> {
    return this._missionService
      .fetchRecommendedMissions({ per_page: 3, mission_model: ['INTERNAL', 'EXTERNAL_PROVIDER', 'SCORM'] })
      .pipe(
        map((response) => response.results || []),
        tap({ error: (error) => this.errorHandler(error) }),
      );
  }

  fetchMissionProviders() {
    return this._missionService.fetchProviders().pipe(
      map((response) => response?.results || []),
      tap({ error: (error) => this.errorHandler(error) }),
    );
  }

  fetchMissions(
    filter: MissionsFilter,
    screenType: MissionScreenType,
  ): Observable<{
    missions: CoursesResponse[];
    finished: boolean;
  }> {
    const builtFilter = this.getMissionsFilter(filter, screenType);
    return this._courseSearchService.fetchMissions(builtFilter).pipe(
      map((response: PageResponse<CoursesResponse>) => {
        const missions = response.items;
        const finished = response.page >= response.last_page;
        return { missions, finished };
      }),
      tap({ error: (error) => this.errorHandler(error) }),
    );
  }

  private getMissionsFilter(filter: MissionsFilter, screenType: MissionScreenType) {
    const { page, per_page, type, search } = filter;
    const isMissionList = screenType === 'missions';

    const mission_category = filter.categories?.length ? filter.categories : null;
    const provider = isMissionList && filter.providers?.length ? filter.providers : null;
    const language = filter.languages?.length ? filter.languages : null;
    const mission_model = this.getMissionModelFilter(screenType);
    const managed = type === QuickFilterType.MINE;
    const favorites = type === QuickFilterType.MY_LIST;

    const builtFilter = {
      page,
      per_page,
      search,
      mission_model,
      ...(!!mission_category && { mission_category }),
      ...(!!provider && { provider }),
      ...(!!language && { language }),
      ...(!!managed && { managed }),
      ...(!!favorites && { favorites }),
    };

    if (isMissionList && type !== QuickFilterType.MINE) {
      return {
        ...builtFilter,
        development_status: DevelopmentStatus.DONE,
        is_active: true,
      };
    }

    return builtFilter;
  }

  private getMissionModelFilter(screenType: MissionScreenType): string[] {
    const defaultMissionModels = ['INTERNAL', 'EXTERNAL_PROVIDER', 'SCORM'];
    const defaultEventModels = ['LIVE', 'PRESENTIAL'];
    return screenType === 'missions' ? defaultMissionModels : defaultEventModels;
  }

  private errorHandler(error: Error, message?: string): any {
    message = message || CourseListService.DEFAULT_ERROR_MESSAGE;
    this._messageService.error(message);
    return error;
  }

  private toPercentage(value: string | null): string | null {
    return value ? (Number(value) / 100).toString() : null;
  }
}
