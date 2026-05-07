import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KeepsError } from '@core/model/error.model';
import { CategoryAPI } from '@core/api/category.api';
import { Category } from '@core/model/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(
    private categoryApi: CategoryAPI,
    private _messageService: KpMessageService,
  ) {}

  fetchOne(id: string): Observable<Category> {
    return this.categoryApi.fetchOne(id);
  }

  fetchByQuery(queryParams?: Record<string, unknown>): Observable<Category[]> {
    return this.categoryApi.fetchByQuery(queryParams).pipe(map((response) => response.results));
  }

  create(data: any): Observable<Category> {
    return this.categoryApi.create(data).pipe(
      tap(() => this._messageService.success(marker('CATEGORY.MESSAGES.SUCESSFULLY_CREATED'))),
      catchError((error) => this.errorHandler(error)),
    );
  }

  update(id: string, data: any): Observable<Category> {
    return this.categoryApi.update(id, data).pipe(
      tap(() => this._messageService.success(marker('CATEGORY.MESSAGES.SUCCESSFULLY_UPDATED'))),
      catchError((error) => this.errorHandler(error)),
    );
  }

  deleteOne(id: string): Observable<any> {
    return this.categoryApi.deleteOne(id).pipe(
      tap(() => this._messageService.success(marker('CATEGORY.MESSAGES.SUCESSFULLY_REMOVED'))),
      catchError((error) => this.errorHandler(error)),
    );
  }

  private errorHandler(error: KeepsError): Observable<never> {
    if (error.error?.non_field_errors) {
      this._messageService.error(marker('CATEGORY.MESSAGES.EXISTING_CATEGORY'));
    } else {
      this._messageService.error(error.error?.detail);
    }
    return throwError(() => error);
  }
}
