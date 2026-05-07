import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * NGRX Data assume that Well-formed resource urls end in a '/'.
 * However, the my account api does not accept.
 */
@Injectable()
export class SlashInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const secureReq = req.clone({
      url: req.url.endsWith('/') ? req.url.slice(0, -1) : req.url,
    });
    return next.handle(secureReq);
  }
}
