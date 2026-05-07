import { Injectable } from '@angular/core';
import { KonquestAPI } from '@core/api';
import { User } from '@core/model';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type EnrollmentError = {
  user: { id: string; email: string };
  mission: { id: string; name: string };
  error: { i18n: string; detail: string };
};

export type SelectedUser = {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  hasError: boolean;
};

interface MissionEnrollmentsReportResponse {
  name: string;
  url: string;
}

interface ParseUsersResponse {
  founds: Array<Omit<SelectedUser, 'hasError'>>;
  not_founds: string[];
}

@Injectable({ providedIn: 'root' })
export class MissionEnrollmentService {
  constructor(private readonly _http: KonquestAPI) {}

  delete(enrollmentId: string): Observable<void> {
    return this._http.delete(`/mission-enrollments/${enrollmentId}`);
  }

  batchDelete(enrollmentIds: string[]) {
    return this._http.post('/mission-enrollments/batch-delete', {
      enrollment_ids: enrollmentIds,
    });
  }

  generateReport(missionId: string): Observable<MissionEnrollmentsReportResponse> {
    return this._http.post<MissionEnrollmentsReportResponse>('/mission-enrollments/report', { mission_id: missionId });
  }

  batchEnroll(missionId: string, userIds: string[]): Observable<EnrollmentError[]> {
    return this._http
      .post<{ enrollment_errors: EnrollmentError[] }>('/mission-enrollments/batch/sync', {
        missions: [missionId],
        users: userIds,
      })
      .pipe(map((response) => response?.enrollment_errors));
  }

  parseUsersFromSheet(file: File): Observable<{ success: User[]; failed: User[] }> {
    const formData = new FormData();
    formData.append('file', file);

    return this._http.postFormData<ParseUsersResponse>('/accounts/users/parser', formData).pipe(
      map(({ founds, not_founds }) => {
        const successUsers = founds.map((user) => new User(user));
        const failedUsers = not_founds.map((userEmail) => new User({ id: this.getUniqueId(), email: userEmail }));
        return { success: successUsers, failed: failedUsers };
      }),
    );
  }

  private getUniqueId(): string {
    return KeepsUtils.generateGUID();
  }
}
