import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AbstractAPI } from './abstract/abstract.api';
import { BellNotification, NotificationPage } from '@core/model/notification';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationAPI extends AbstractAPI {
  API_URL = `${environment.apps.notification.api}`;

  constructor(http: HttpClient) {
    super(http);
  }

  // Bell Notifications
  fetchAllNotifications() {
    return this.get<NotificationPage<BellNotification>>('/bell-notifications', null, true);
  }

  readNotification(id: string) {
    return this.post<Observable<void>>(`/bell-notifications/${id}/read`, {});
  }

  readAllNotifications() {
    return this.post<Observable<void>>('/bell-notifications/read-all', {});
  }
}
