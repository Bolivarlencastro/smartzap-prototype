import { Injectable } from '@angular/core';
import { KonquestAPI } from '@core/api';
import { catchError, Observable, of } from 'rxjs';
import { GroupMissionActionData } from './group-mission.model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { EnrollmentType } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';

const URL = '/groups';

@Injectable()
export class GroupMissionAPI {
  constructor(
    private _http: KonquestAPI,
    private _messageService: KpMessageService,
  ) {}

  fetchByQuery(id: string, queryParams?: any): Observable<any> {
    return this._http.get(`${URL}/${id}/missions`, {
      ...queryParams,
    });
  }

  addMany(payload: GroupMissionActionData): Observable<any> {
    const { groupId, missionIds: missions, enrollment } = payload;
    const body = {
      missions,
      enrollment_goal_date: enrollment?.date,
      enrollment_required_mission: enrollment?.enrollmentType === EnrollmentType.REQUIRED,
      regulatory_compliance_cycle_id: enrollment?.cycle?.id,
    };
    return this._http.post(`${URL}/${groupId}/missions`, body).pipe(
      catchError((error) => {
        this._messageService.error(error?.error?.detail);
        return of(error);
      }),
    );
  }

  delete(groupId: string, missionId: string): Observable<any> {
    return this._http.delete(`${URL}/${groupId}/missions/${missionId}`);
  }
}
