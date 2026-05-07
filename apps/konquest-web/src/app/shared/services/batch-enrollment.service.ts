import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KonquestAPI } from '@core/api';
import { User } from '@core/model';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import {
  BasicUserProfile,
  RegulatoryComplianceApi,
  UserProfile,
  UsersV2Api,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { EnrollmentConfig, EnrollmentType } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BatchEnrollmentDialogComponent } from '../components/batch-enrollment-dialog/containers/batch-enrollment-dialog/batch-enrollment-dialog.component';

export interface BatchEnrollmentRequest {
  users: string[];
  goal_date?: string;
  missions?: string[];
  learning_trails?: string[];
  required?: boolean;
  regulatory_compliance_cycle?: string;
}

export interface ParseUsersResponse {
  founds: User[];
  not_founds: string[];
}

export type BatchEnrollmentType = 'mission' | 'learning-trail' | 'event';

@Injectable({ providedIn: 'root' })
export class BatchEnrollmentService {
  static countErrors(batchEnrollmentsResponse: any): number {
    return batchEnrollmentsResponse?.enrollment_errors?.length || 0;
  }

  static mapUserIdsSelection(users: User[] | UserProfile[] | BasicUserProfile[]): Record<string, string> {
    const record: Record<string, string> = {};

    users.forEach((item: { id: string }) => (record[item.id] = item.id));
    return record;
  }

  static buildEnrollmentRequesPayload(
    learnContentId: string,
    selectedIds: Record<string, string>,
    type: BatchEnrollmentType,
    enrollmentConfig: EnrollmentConfig,
  ): BatchEnrollmentRequest {
    const goal_date = enrollmentConfig?.date;
    const required = enrollmentConfig?.enrollmentType === EnrollmentType.REQUIRED;
    const idsAsArray = Object.keys(selectedIds);
    const regulatory_compliance_cycle = enrollmentConfig?.cycle?.id;
    const request: BatchEnrollmentRequest = { users: idsAsArray };

    if (type === 'event') {
      request.missions = [learnContentId];
    } else {
      request.goal_date = goal_date;
      request.required = required;

      if (type === 'mission') {
        request.missions = [learnContentId];
      } else {
        request.learning_trails = [learnContentId];
      }
    }

    if (enrollmentConfig?.enrollmentType === EnrollmentType.COMPLIANCE && regulatory_compliance_cycle) {
      request.regulatory_compliance_cycle = regulatory_compliance_cycle;
    }

    return request;
  }

  constructor(
    private _konquestApi: KonquestAPI,
    private dialog: MatDialog,
    private usersApiV2: UsersV2Api,
    private messageService: KpMessageService,
    private regulatoryComplianceApi: RegulatoryComplianceApi,
  ) {}

  batch(data: BatchEnrollmentRequest, type: BatchEnrollmentType = 'mission'): Observable<any> {
    const urlMap = new Map<BatchEnrollmentType, string>([
      ['mission', '/mission-enrollments/batch'],
      ['learning-trail', '/learning-trail-enrollments/batch'],
      ['event', '/mission-enrollments/batch/sync'],
    ]);
    return this._konquestApi.post(urlMap.get(type), data).pipe(
      tap({
        next: () => this.messageService.info('BATCH_ACTION.MESSAGE'),
        error: () => this.messageService.error(marker('BATCH_ENROLLMENT.MESSAGES.FAILURE')),
      }),
    );
  }

  parseUsers(xmlFile: File): Observable<ParseUsersResponse> {
    const formData = new FormData();
    formData.append('file', xmlFile);
    return this._konquestApi.postFormData<ParseUsersResponse>(`/accounts/users/parser`, formData).pipe(
      tap({
        error: () => this.messageService.error(marker('BATCH_ENROLLMENT.MESSAGES.PARSE_ERROR')),
      }),
    );
  }

  openDialog(): Observable<any> {
    return this.dialog
      .open(BatchEnrollmentDialogComponent, {
        minWidth: '300px',
        width: '900px',
        maxWidth: '90vw',
        panelClass: ['p-0', 'm-0'],
      })
      .afterClosed();
  }

  filterUsers(search: string, page: number) {
    return this.usersApiV2.listBasicUsers({
      search,
      page,
      'filter.roles.role.application.id': `$in:${environment.apps.konquest.id}`,
    });
  }

  filterCycles(search: string) {
    return this.regulatoryComplianceApi.getCycles({ search, page: 1 }).pipe(map((response) => response.items));
  }
}
