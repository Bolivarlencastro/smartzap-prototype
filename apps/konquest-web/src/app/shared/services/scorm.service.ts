import { Injectable } from '@angular/core';
import { KonquestAPI } from '@core/api';
import { Pagination } from '@core/model';
import { CMI } from '@core/model/scorm-cmi.model';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable, map, of } from 'rxjs';

export interface ScormParams {
  owner: boolean;
  missionStageContentId: string;
  enrollmentId: string;
}

export interface ScormResult {
  cmi: CMI;
  content: string; // "4b02d795-32b3-4bad-9b09-66aa4f01bfda"
  created_date: string; // "2023-05-02T20:18:18.385509Z"
  deleted: boolean; // false
  deleted_date: string; // null
  enrollment: string; // "baf2615a-ed0d-41dc-b805-05c010cd0a8d"
  id: string; // "bbef95d1-fb79-48ab-afb0-5dfd1a7dead3"
  updated_date: string; // "2023-05-02T20:38:12.245238Z"
  user: string; // "57b61d0e-1f36-4427-b98c-c45ef1019c06"
}

@Injectable({ providedIn: 'root' })
export class ScormService {
  public static readonly STORAGE_ID_KEY = 'scorm.id';
  public static readonly STORAGE_CMI_KEY = 'scorm.cmi';

  readonly BASE_PATH = '/users/scorm-activities';

  constructor(
    private _konquestApi: KonquestAPI,
    private _profileService: UserProfileService,
  ) {}

  fetch({ owner, missionStageContentId, enrollmentId }: ScormParams): Observable<CMI | undefined> {
    if (owner) {
      return of(this.fetchLocalStorage(missionStageContentId));
    }

    const { id, name } = this._profileService.getProfile();
    return this._konquestApi
      .get<Pagination<ScormResult>>(this.BASE_PATH, {
        user: id,
        content: missionStageContentId,
        enrollment: enrollmentId,
      })
      .pipe(map((result) => (result.count ? result.results?.[0].cmi : this.buildCmi(id, name))));
  }

  save({ owner, missionStageContentId, enrollmentId }: ScormParams, cmi: CMI) {
    if (owner) {
      this.saveLocalStorage(missionStageContentId, cmi);
      return of(cmi);
    }

    const { id, name } = this._profileService.getProfile();
    const updatedCmi = structuredClone(cmi);
    updatedCmi.core.student_name = this.buildCompositeName(name);

    return this._konquestApi.post(this.BASE_PATH, {
      user: id,
      content: missionStageContentId,
      enrollment: enrollmentId,
      cmi: updatedCmi,
    });
  }

  private fetchLocalStorage(missionStageContentId: string): CMI {
    // New or different CMI data, clear it first
    const storageId = localStorage.getItem(ScormService.STORAGE_ID_KEY);
    if (storageId != missionStageContentId) {
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

  // Alguns SCORMS precisam de uma string separada por virgula
  buildCompositeName(userName: string): string {
    const parts = userName.split(' ');

    if (parts.length <= 1) {
      return userName + ',';
    }

    const firstName = parts.shift();
    return `${firstName}, ${parts.join(' ')}`;
  }
}
