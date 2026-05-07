import { Injectable } from '@angular/core';
import {
  GamificationApi,
  GamificationListFilterDto,
  GamificationListDto,
  GamificationListType,
  Pagination,
  GamificationSubModule,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable, map } from 'rxjs';

@Injectable()
export class GamificationService {
  constructor(private gamificationAPI: GamificationApi) {}

  getData(
    path: GamificationListType,
    filter: GamificationListFilterDto,
    isMobile: boolean,
  ): Observable<Pagination<GamificationListDto>> {
    if (isMobile) {
      filter = { ...filter, page: 1, per_page: 999 };
    }

    const data = new Map<GamificationListType, Observable<Pagination<GamificationListDto>>>([
      ['points-statement', this.getPointsStatement(filter)],
      ['general', this.getGeneralRanking(filter)],
      ['leadership', this.getLeadershipRanking(filter)],
      ['directorates', this.getBoardRanking(filter)],
      ['subdirectorates', this.getSubDirectorateRanking(filter)],
      ['area', this.getAreaRanking(filter)],
    ]);

    return data.get(path).pipe(
      map((response) => ({
        ...response,
        results: response.results.map((item) => ({ ...item, id: this.getItemId(item) })),
      })),
    );
  }

  getPointsStatement(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this.gamificationAPI.getPointsStatement(filter);
  }

  getGeneralRanking(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this.gamificationAPI.getGeneralRanking(filter);
  }

  getLeadershipRanking(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this.gamificationAPI.getLeadershipRanking(filter);
  }

  getBoardRanking(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this.gamificationAPI.getBoardRanking(filter);
  }

  getSubDirectorateRanking(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this.gamificationAPI.getSubDirectorateRanking(filter);
  }

  getAreaRanking(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this.gamificationAPI.getAreaRanking(filter);
  }

  getPersonalScore(): Observable<number> {
    return this.gamificationAPI.getStatisticsUser().pipe(map((statistics) => statistics.total_points));
  }

  getSubModules(): Observable<GamificationSubModule[]> {
    return this.gamificationAPI.getGamificationSubModules();
  }

  private getItemId(item: GamificationListDto): string {
    return item.id || item.user_id || item.director || item.manager || item.area_of_activity;
  }
}
