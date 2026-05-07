import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { createPrototypeAnswer, getPrototypeContent } from '../prototype/prototype-fixtures';

@Injectable()
export class PrototypeMockInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!environment.prototypeMode) {
      return next.handle(request);
    }

    if (request.url.includes('/view/content/')) {
      const contentId = request.url.split('/view/content/').pop()?.split('?')[0] ?? '';
      return this.respond(getPrototypeContent(contentId));
    }

    if (request.url.includes('/view/answers') && request.method === 'POST') {
      return this.respond(createPrototypeAnswer((request.body as any) ?? {}));
    }

    if (request.url.includes('/view/activity') && request.method === 'POST') {
      return this.respond({ id: 'prototype-activity-session' });
    }

    if (request.url.includes('/view/activity') && request.method === 'PATCH') {
      return this.respond({ ok: true });
    }

    return next.handle(request);
  }

  private respond(body: unknown): Observable<HttpEvent<unknown>> {
    return of(new HttpResponse({ status: 200, body })).pipe(delay(150));
  }
}
