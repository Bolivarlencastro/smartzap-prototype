import { Injectable } from '@angular/core';
import { MyAccountV2Client } from './my-account-v2.client';
import { ApplicationService } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApplicationServicesApi {
  private readonly basePath = '/application-services';

  constructor(private _http: MyAccountV2Client) {}

  getApplicationServices() {
    return this._http.get<ApplicationService[]>(this.basePath);
  }
}
