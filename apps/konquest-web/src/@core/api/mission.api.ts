import { Injectable } from '@angular/core';
import { Mission } from 'app/main/mission/mission.model';
import { Observable } from 'rxjs';

import { KonquestAPI } from './base';

@Injectable({ providedIn: 'root' })
export class MissionAPI {
  private basePath = '/missions';

  constructor(private _http: KonquestAPI) {}

  getMissionById(id: string): Observable<Mission> {
    return this._http.get<Mission>(`${this.basePath}/${id}`);
  }

  deleteMission(id: string): Observable<void> {
    return this._http.delete<void>(`${this.basePath}/${id}`);
  }

  transferMission(missionId: string, targetWorkspaceId: string, newOwnerId: string): Observable<any> {
    return this._http.post(`${this.basePath}/${missionId}/transfer`, {
      user_creator: newOwnerId,
      target_workspace: targetWorkspaceId,
    });
  }

  duplicateMission(missionId: string, targetWorkspaceId: string, newOwnerId: string): Observable<any> {
    return this._http.post(`${this.basePath}/${missionId}/duplicate`, {
      user_creator: newOwnerId,
      target_workspace: targetWorkspaceId,
    });
  }

  shareMission(missionId: string, targetWorkspaceId: string): Observable<any> {
    return this._http.post(`${this.basePath}/${missionId}/share`, {
      target_workspace: targetWorkspaceId,
    });
  }
}
