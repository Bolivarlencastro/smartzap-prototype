import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';
import { EMPTY, Observable } from 'rxjs';

const I18N_URL = '/assets/i18n/';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  API_URL = environment.apps.konquest.api;
  API_MYACCOUNT_URL = environment.apps.myAccount.apiV2;

  constructor(private _workspaceService: WorkspaceService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { id = null } = this._workspaceService.getCurrentWorkspace() || {};

    const existingXClient = request.headers.get('x-client');
    const excludedUrlsIndex = environment.bearerExcludedUrls.findIndex((url) => request.url.includes(url));
    const isWorkspaceUrl = request.url === `${this.API_MYACCOUNT_URL}/workspaces`;
    const isI18nUrl = request.url.includes(I18N_URL);

    if (isWorkspaceUrl || excludedUrlsIndex >= 0 || isI18nUrl) {
      return next.handle(request);
    }

    if (!existingXClient && !id) {
      console.warn(
        'This request has been blocked because it does not have an x-client. If necessary add this url to the allowed requests list\n',
        request.url,
      );
      return EMPTY;
    }

    request = request.clone({
      setHeaders: {
        'x-client': existingXClient || id || '',
      },
    });

    return next.handle(request);
  }
}
