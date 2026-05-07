import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { KonquestAPI } from '@core/api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KeepsError } from '@core/model/error.model';
import { ImportType } from './group.model';

const BASE_PATH = '/groups';

const IMPORT_PATH = {
  USER: 'users/import',
  MISSION: 'missions/import',
  CHANNEL: 'channels/import',
};

@Injectable({ providedIn: 'root' })
export class GroupAPI {
  constructor(
    private _http: KonquestAPI,
    private _messageService: KpMessageService,
  ) {}

  fetchByQuery(queryParams?: any): Observable<any> {
    return this._http.get(`${BASE_PATH}`, queryParams);
  }

  fetchOne(id: string): Observable<any> {
    return this._http.get(`${BASE_PATH}/${id}`);
  }

  create(data: any): Observable<any> {
    return this._http.post(BASE_PATH, data).pipe(
      tap(() => this._messageService.success(marker('GROUPS.MESSAGES.SUCESSFULLY_CREATED'))),
      catchError((error) => this.errorHandler(error)),
    );
  }

  update(id: string, data: any): Observable<any> {
    return this._http.put(`${BASE_PATH}/${id}`, data).pipe(
      tap(() => this._messageService.success(marker('GROUPS.MESSAGES.SUCCESSFULLY_UPDATED'))),
      catchError((error) => this.errorHandler(error)),
    );
  }

  deleteOne(id: string): Observable<any> {
    return this._http.delete(`${BASE_PATH}/${id}`).pipe(
      tap(() => this._messageService.success(marker('GROUPS.MESSAGES.SUCESSFULLY_REMOVED'))),
      catchError((error) => this.errorHandler(error)),
    );
  }

  import(data: any, type: ImportType, enrollment_goal_date: string | undefined): Observable<any> {
    const url = IMPORT_PATH[type];
    const { file } = data;
    const form = new FormData();
    form.append('file', file, file.name);

    if (enrollment_goal_date) {
      form.append('enrollment_goal_date', enrollment_goal_date);
    }

    return this._http.postFormData(`${BASE_PATH}/${url}`, form);
  }

  private errorHandler(error: KeepsError): Observable<never> {
    if (error.error?.non_field_errors) {
      this._messageService.error(marker('GROUPS.MESSAGES.EXISTING_GROUP'));
    } else {
      this._messageService.error(error.error?.detail);
    }
    return throwError(() => error);
  }
}
