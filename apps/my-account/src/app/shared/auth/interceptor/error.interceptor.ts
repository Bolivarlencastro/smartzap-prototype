import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { KeepsError } from '@core/model/error.model';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import Keycloak from 'keycloak-js';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    public keycloak: Keycloak,
    private _messageService: KpMessageService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err) => this.handleError(err)));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    if (errorResponse.error instanceof ErrorEvent) {
      // CLIENT SIDE ERRORS
      return throwError(() => errorResponse);
    }

    switch (errorResponse.status) {
      case 401:
        this.keycloak.logout();
        break;
      case 403:
        this._messageService.error(errorResponse?.error?.detail || marker(`ERROR.NOT_PERMISSION_ACCESS_THIS_SERVICE`));
        break;
      case 400:
      case 404:
      case 500:
      default:
      // Do nothing
    }

    // SEVER SIDE ERRORS
    return throwError(() => new KeepsError(errorResponse));
  }
}
