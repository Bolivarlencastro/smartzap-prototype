import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { API_ERROR_KEYS } from 'app/shared/api-erros';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import Keycloak from 'keycloak-js';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    public keycloak: Keycloak,
    private readonly _messageService: KpMessageService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    // CLIENT SIDE ERRORS
    if (errorResponse.error instanceof ErrorEvent) {
      return throwError(() => errorResponse);
    }

    // SERVER SIDE ERROS
    const { status, error } = errorResponse;
    const errorDetails = this.transformErrorFromString(error);
    let i18n;

    switch (status) {
      case 401:
        this.keycloak.logout();
        break;
      case 403:
        this._messageService.error(error);
        break;
      case 400:
      case 404:
      case 422:
        if (!errorDetails) {
          break;
        }
        i18n = this.getFirstErrorMessage(errorDetails);
        break;
      case 500:
      default:
        i18n = API_ERROR_KEYS[error];
    }

    return throwError(() => ({ status, error, i18n }));
  }

  transformErrorFromString(error: unknown): Record<string, string[]> | undefined {
    if (typeof error === 'object' && error !== null) {
      return error as Record<string, string[]>;
    }
    if (typeof error !== 'string') {
      return undefined;
    }
    try {
      const errorMessage = error.replace(/'/g, '"');
      return JSON.parse(errorMessage);
    } catch (_error) {
      return undefined;
    }
  }

  getFirstErrorMessage(error: Record<string, string[]>): string | undefined {
    const [fieldName] = Object.keys(error);
    const [errorName] = error[fieldName] || [];
    if (!fieldName || !errorName) {
      return undefined;
    }
    const errorNameWithoutDots = errorName.replace(/\./g, '');
    return `${fieldName}.${errorNameWithoutDots}`.toUpperCase();
  }
}
