import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GamificationSubModule } from '../../my-account-sdk';
import { Pagination } from '../../pagination';
import { GamificationListDto, GamificationListFilterDto, GamificationStatistics } from '../models';
import { GamificationClient } from './gamification.client';
import { MyAccountV2Client } from '../../my-account-sdk/apis/my-account-v2.client';

const POINTS_STATEMENT_PATH = '/extract-user';
const GENERAL_RANKING_PATH = '/ranking/general';
const LEADERSHIP_RANKING_PATH = '/ranking/leaders';
const BOARD_RANKING_PATH = '/ranking/directors';
const SUB_DIRECTORATE_RANKING_PATH = '/ranking/managers';
const AREA_RANKING_PATH = '/ranking/activity-areas';
const STATISTICS_USER_PATH = '/statistics-user';
const GAMIFICATION_PATH = `/gamification`;

@Injectable({
  providedIn: 'root',
})
export class GamificationApi {
  constructor(
    private _http: GamificationClient,
    private myAccountClient: MyAccountV2Client,
  ) {}

  getPointsStatement(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this._http.get<Pagination<GamificationListDto>>(POINTS_STATEMENT_PATH, filter);
  }

  getGeneralRanking(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this._http.get<Pagination<GamificationListDto>>(GENERAL_RANKING_PATH, filter);
  }

  getLeadershipRanking(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this._http.get<Pagination<GamificationListDto>>(LEADERSHIP_RANKING_PATH, filter);
  }

  getBoardRanking(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this._http.get<Pagination<GamificationListDto>>(BOARD_RANKING_PATH, filter);
  }

  getSubDirectorateRanking(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this._http.get<Pagination<GamificationListDto>>(SUB_DIRECTORATE_RANKING_PATH, filter);
  }

  getAreaRanking(filter: GamificationListFilterDto): Observable<Pagination<GamificationListDto>> {
    return this._http.get<Pagination<GamificationListDto>>(AREA_RANKING_PATH, filter);
  }

  getStatisticsUser(): Observable<GamificationStatistics> {
    return this._http.get<GamificationStatistics>(STATISTICS_USER_PATH);
  }

  getGamificationSubModules(): Observable<GamificationSubModule[]> {
    return this.myAccountClient.get<GamificationSubModule[]>(GAMIFICATION_PATH);
  }

  updateGamificationSubModule(id: string, data: Partial<GamificationSubModule>): Observable<GamificationSubModule> {
    return this.myAccountClient.put<GamificationSubModule>(`${GAMIFICATION_PATH}/${id}`, data);
  }
}
