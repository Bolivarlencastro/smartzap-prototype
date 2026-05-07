import { Injectable } from '@angular/core';
import { ApplicationWithRoles } from '../models';
import { MyAccountV2Client } from './my-account-v2.client';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsApi {
  constructor(private http: MyAccountV2Client) {}

  getApplicationsWithRoles(workspaceId?: string) {
    const customHeaders = workspaceId ? { 'x-client': workspaceId } : null;
    return this.http
      .get<ApplicationWithRoles[]>(`/applications/workspace-applications`, null, false, false, customHeaders)
      .pipe(map((applications) => applications?.filter((application) => application.name !== 'GameUP')));
  }
}
