import { Injectable } from '@angular/core';
import { KonquestAPI } from '@core/api';
import { catchError, Observable, of } from 'rxjs';
import { GroupUserActionData, GroupUserQueryParams } from './group-user.model';
import { EnrollmentType } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

const URL = '/groups';

@Injectable()
export class GroupUserAPI {
  constructor(
    private _http: KonquestAPI,
    private _messageService: KpMessageService,
  ) {}

  fetchByQuery(groupId: string, queryParams?: GroupUserQueryParams): Observable<any> {
    return this._http.get(`${URL}/${groupId}/users`, {
      ...queryParams,
    });
  }

  addMany(payload: GroupUserActionData): Observable<any> {
    const { groupId, userIds: users, enrollment } = payload;
    const body = {
      users,
      enrollment_goal_date: enrollment?.date,
      enrollment_required_mission: enrollment?.enrollmentType === EnrollmentType.REQUIRED,
      regulatory_compliance_cycle_id: enrollment?.cycle?.id,
    };

    return this._http.post(`${URL}/${groupId}/users`, body).pipe(
      catchError((error) => {
        this._messageService.error(error?.error?.detail);
        return of(error);
      }),
    );
  }

  delete(groupId: string, userId: string, removeEnrollments = false): Observable<any> {
    return this._http.delete(`${URL}/${groupId}/users/${userId}`, {
      delete_enrollment: removeEnrollments ? 'True' : null,
    });
  }
}
