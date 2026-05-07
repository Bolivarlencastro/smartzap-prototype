import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._authService.getToken();
    const clientId = this._authService.clientId;

    if (!token || !clientId) {
      return next.handle(request);
    }

    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token,
        'x-client': clientId,
      },
    });

    return next.handle(request);
  }
}
