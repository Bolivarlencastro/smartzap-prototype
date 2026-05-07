import { Injectable } from '@angular/core';
import { KonquestClient } from './konquest.client';
import { CMI, ScormResult } from '../models';
import { Pagination } from '../../pagination';

const PATH = '/users/scorm-activities';

@Injectable({
  providedIn: 'root',
})
export class ScormActivitiesApi {
  constructor(private http: KonquestClient) {}

  fetchScormActivity(userId: string, missionStageContentId: string, enrollmentId: string) {
    return this.http.get<Pagination<ScormResult>>(PATH, {
      user: userId,
      content: missionStageContentId,
      enrollment: enrollmentId,
    });
  }

  createScormActivity(userId: string, missionStageContentId: string, enrollmentId: string, updatedCmi: CMI) {
    return this.http.post<CMI>(PATH, {
      user: userId,
      content: missionStageContentId,
      enrollment: enrollmentId,
      cmi: updatedCmi,
    });
  }
}
