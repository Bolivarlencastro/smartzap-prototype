import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { KonquestAPI } from '@core/api';
import { GroupLearningTrailActionData } from './group-learning-trail.model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

const URL = '/groups';

@Injectable()
export class GroupLearningTrailAPI {
  constructor(
    private _http: KonquestAPI,
    private _messageService: KpMessageService,
  ) {}

  fetchByQuery(id: string, queryParams?: any): Observable<any> {
    return this._http.get(`${URL}/${id}/learning-trails`, {
      ...queryParams,
    });
  }

  addMany(payload: GroupLearningTrailActionData): Observable<any> {
    const { groupId, learningTrailIds: learning_trails, enrollment } = payload;
    const body = {
      learning_trails,
      enrollment_goal_date: enrollment?.date,
      regulatory_compliance_cycle_id: enrollment?.cycle?.id,
    };
    return this._http.post(`${URL}/${groupId}/learning-trails`, body).pipe(
      catchError((error) => {
        this._messageService.error(error?.error?.detail);
        return of(error);
      }),
    );
  }

  delete(groupId: string, learningTrailId: string): Observable<any> {
    return this._http.delete(`${URL}/${groupId}/learning-trails/${learningTrailId}`);
  }
}
