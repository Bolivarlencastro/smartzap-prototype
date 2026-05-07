import { Injectable } from '@angular/core';

import { CMI, ScormActivitiesApi, ScormParams, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScormService {
  public static readonly STORAGE_ID_KEY = 'scorm.id';
  public static readonly STORAGE_CMI_KEY = 'scorm.cmi';

  constructor(
    private scormApi: ScormActivitiesApi,
    private _profileService: UserProfileService,
  ) {}

  fetch({ viewingAsUser, missionStageContentId, enrollmentId }: ScormParams): Observable<CMI | undefined> {
    if (viewingAsUser) {
      return of(this.fetchLocalStorage(missionStageContentId));
    }

    const { id, name } = this._profileService.getProfile();
    return this.scormApi
      .fetchScormActivity(id, missionStageContentId, enrollmentId)
      .pipe(map((result) => (result.count ? result.results?.[0].cmi : this.buildCmi(id, name))));
  }

  save({ viewingAsUser, missionStageContentId, enrollmentId }: ScormParams, cmi: CMI) {
    if (viewingAsUser) {
      this.saveLocalStorage(missionStageContentId, cmi);
      return of(cmi);
    }

    const { id, name } = this._profileService.getProfile();
    const updatedCmi = structuredClone(cmi);
    updatedCmi.core.student_name = this.buildCompositeName(name);

    return this.scormApi.createScormActivity(id, missionStageContentId, enrollmentId, updatedCmi);
  }

  private fetchLocalStorage(missionStageContentId: string): CMI {
    // New or different CMI data, clear it first
    const storageId = localStorage.getItem(ScormService.STORAGE_ID_KEY);
    if (storageId !== missionStageContentId) {
      localStorage.setItem(ScormService.STORAGE_ID_KEY, missionStageContentId);
      localStorage.removeItem(ScormService.STORAGE_CMI_KEY);
    }

    // Existing data for same ID
    const storageData = localStorage.getItem(ScormService.STORAGE_CMI_KEY);
    if (storageData) {
      return JSON.parse(storageData);
    }

    // New empty data
    const { id, name } = this._profileService.getProfile();
    return this.buildCmi(id, name);
  }

  private saveLocalStorage(missionStageContentId: string, cmi: CMI) {
    localStorage.setItem(ScormService.STORAGE_ID_KEY, missionStageContentId);
    localStorage.setItem(ScormService.STORAGE_CMI_KEY, JSON.stringify(cmi));
  }

  private buildCmi(userId: string, userName: string): CMI {
    return {
      suspend_data: '',
      launch_data: '',
      comments: '',
      comments_from_lms: '',
      core: {
        student_id: userId,
        student_name: this.buildCompositeName(userName),
        lesson_location: '',
        credit: '',
        lesson_status: '', // 'incomplete',
        entry: '',
        lesson_mode: '', // 'normal',
        exit: '',
        session_time: '', // '00:00:00',
        score: {
          raw: '',
          min: '',
          max: '', // '100',
        },
      },
      objectives: {},
      student_data: {
        mastery_score: '',
        max_time_allowed: '',
        time_limit_action: '',
      },
      student_preference: {
        audio: '',
        language: '',
        speed: '',
        text: '',
      },
      interactions: {},
    };
  }

  // Alguns SCORM's precisam de uma string separada por vírgula
  buildCompositeName(userName: string): string {
    const parts = userName.split(' ');

    if (parts.length <= 1) {
      return userName + ',';
    }

    const firstName = parts.shift();
    return `${firstName}, ${parts.join(' ')}`;
  }
}
