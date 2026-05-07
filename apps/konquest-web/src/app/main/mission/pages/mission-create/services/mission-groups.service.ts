import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KonquestAPI } from '@core/api';
import { Pagination } from '@core/model';
import { Group } from 'app/main/group/groups/group.model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MissionGroupsService {
  private _baseUrl = '/groups';

  constructor(
    private _http: KonquestAPI,
    private _messageService: KpMessageService,
  ) {}

  filterGroups(searchTerm: string): Observable<Pagination<Group>> {
    return this._http.get<Pagination<Group>>(`${this._baseUrl}`, { search: searchTerm });
  }

  getGroups(missionId: string): Observable<Pagination<Group>> {
    return this._http.get<Pagination<Group>>(`${this._baseUrl}`, { mission_id: missionId });
  }

  addGroup(missionId: string, groupId: string): Observable<any> {
    return this._http.post(`${this._baseUrl}/${groupId}/missions`, { missions: [missionId] }).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.ADD_GROUP')),
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.ADD_GROUP')),
      }),
    );
  }

  removeGroup(missionId: string, groupId: string): Observable<any> {
    return this._http.delete(`${this._baseUrl}/${groupId}/missions/${missionId}`).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.DELETE_GROUP')),
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.DELETE_GROUP')),
      }),
    );
  }
}
