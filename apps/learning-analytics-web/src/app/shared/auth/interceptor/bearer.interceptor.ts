import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BEARER_URLS = environment.bearerUrls;

@Injectable()
export class BearerInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (BEARER_URLS.find((url) => request.url.includes(url))) {
      const token = request.headers.get('Authorization');
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer' + token,
        },
      });
    }

    return next.handle(request);
  }
}
