import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP_STATUS } from '@core/enums/http-status';
import { KeepsError } from '@core/model/error.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import Keycloak from 'keycloak-js';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  public static readonly FORBIDDEN_MESSAGE = 'Desculpe, você não possui permissão para acessar esse recurso.';

  constructor(
    private keycloak: Keycloak,
    private _messageService: KpMessageService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        return this.handleError(error);
      }),
    );
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    if (errorResponse.error instanceof ErrorEvent) {
      return throwError(() => errorResponse);
    }

    switch (errorResponse.status) {
      case HTTP_STATUS.Unauthorized:
        this.handle401Error();
        break;
      case HTTP_STATUS.Forbidden:
        this._messageService.error(ErrorInterceptor.FORBIDDEN_MESSAGE);
        break;
      case HTTP_STATUS.BadRequest:
      case HTTP_STATUS.NotFound:
      case HTTP_STATUS.InternalServerError:
      default:
      // Do nothing
    }

    return throwError(() => new KeepsError(errorResponse));
  }

  private async handle401Error(): Promise<void> {
    if (this.keycloak.authenticated) {
      await this.keycloak.logout();
    }
  }
}
