import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeepsError } from '@core/model/error.model';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private _authService: AuthService,
    private _fuseLoadingService: FuseLoadingService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    if (errorResponse.error instanceof ErrorEvent) {
      // Guarantee that all loaders are hidden
      this._fuseLoadingService.hide();

      // CLIENT SIDE ERRORS
      return throwError(() => errorResponse);
    }

    switch (errorResponse.status) {
      case 401:
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this._authService.logout();
        break;
      case 403:
        console.error(errorResponse.error);
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
