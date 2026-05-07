import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Notification, NotificationType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpNotification } from '@keeps-platform-frontend-workspace/ui/kp-notification';
import { TranslocoService } from '@jsverse/transloco';
import { subHours } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SmartzapAPI } from '../api';

export enum SmartZapNotificationType {
  REPORT_DOWNLOAD = 'DOWNLOAD',
  ERROR_POPUP = 'Popup',
  COURSE_REDIRECT = 'Redirect',
  COURSE_DOWNLOAD = 'Download',
}

export interface SmartzapNotification extends Notification {
  content: string;
  created: string;
  updated: string;
  type: NotificationType;
}

export interface KpNotificationSmartzapModel extends KpNotification {
  entity: SmartzapNotification;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private baseUrl = '/user/notification';

  constructor(
    private _http: SmartzapAPI,
    private _translateService: TranslocoService,
    private _router: Router,
  ) {}

  fetchNotifications(): Observable<KpNotificationSmartzapModel[]> {
    return this._http
      .get(this.baseUrl, { read: false })
      .pipe(map((response: any) => this.toKpNotification(response.result)));
  }

  readNotification(notificationId: string): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${notificationId}`, {
      read: true,
    });
  }

  selectNotification(notification: KpNotificationSmartzapModel): void {
    const { entity } = notification;
    const { type } = entity;

    if (type.action === SmartZapNotificationType.REPORT_DOWNLOAD) {
      window.open(entity.content, '_blank');
      return;
    }

    this._router.navigate(['/', 'courses', entity.content]);
  }

  clearAllNotifications(): Observable<any> {
    return this._http.post(`${this.baseUrl}/batch-read`, null);
  }

  private toKpNotification(results: SmartzapNotification[]): KpNotificationSmartzapModel[] {
    if (!results) {
      return [];
    }

    return results.map((notification) => {
      const title = this._translateService.translate(`REPORTS.${notification.message}`);
      const created_at = subHours(new Date(notification.updated), 3).toISOString();
      const kpNotification: KpNotificationSmartzapModel = {
        id: notification.id,
        title,
        created_at,
        entity: notification,
      };
      return kpNotification;
    });
  }
}
