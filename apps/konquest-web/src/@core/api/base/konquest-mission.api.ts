import { Injectable } from '@angular/core';
import { ExternalMission, Pagination } from '@core/model';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Mission } from 'app/main/mission/mission.model';
import { Observable } from 'rxjs';
import { KonquestAPI } from './konquest.api';

const PATH = '/missions';

@Injectable({ providedIn: 'root' })
export class KonquestMissionAPI {
  constructor(
    protected http: KonquestAPI,
    private _authService: AuthService,
  ) {}

  createScormMission(data: any): Observable<any> {
    return this.http.post<any>(`${PATH}/scorm`, {
      ...data,
      user_creator: this._authService.userId,
    });
  }

  updateScormMission(data: any, missionId: any): Observable<any> {
    return this.http.patch<any>(`${PATH}/scorm/${missionId}`, data);
  }

  fetchMissionsRecommendations(params: Record<string, unknown>): Observable<Pagination<Mission>> {
    return this.http.get(`${PATH}/my-recommendations`, params);
  }

  fetchMissionsDashboardPriority(params?: Record<string, unknown>): Observable<Mission> {
    return this.http.get(`${PATH}/dashboard/priority`, params);
  }

  /**
   * Create an external mission
   *
   * @param mission
   * @returns
   */
  createExternalMission(mission: ExternalMission) {
    return this.http.post<ExternalMission>('/missions/external', mission);
  }

  /**
   * Update an external mission
   * @param mission
   * @param id
   * @returns
   */
  updateExternalMission(id: string, mission: ExternalMission) {
    return this.http.patch(`/missions/external/${id}`, mission);
  }
}
