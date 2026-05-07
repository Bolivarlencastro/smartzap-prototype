import { HttpInterceptorFn } from '@angular/common/http';
import { CheckInService } from '../services/check-in.service';
import { inject } from '@angular/core';

const I18N_URL = '/assets/i18n/';

export const xClientInterceptor: HttpInterceptorFn = (req, next) => {
  const checkInService = inject(CheckInService);
  const workspace = checkInService.sessionData()?.workspaceId;
  const isI18nUrl = req.url.includes(I18N_URL);

  if (isI18nUrl) {
    return next(req);
  }

  const updatedRequest = req.clone({ setHeaders: { 'x-client': workspace } });
  return next(updatedRequest);
};
