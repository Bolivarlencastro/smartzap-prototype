import { Injectable } from '@angular/core';
import { SmartzapAPI } from '@core/api';
import { Observable } from 'rxjs';
import { Billing } from '../model';

@Injectable({ providedIn: 'root' })
export class BillingService {
  constructor(private _http: SmartzapAPI) {}

  fetchBilling(workspaceId: string): Observable<Billing> {
    return this._http.get<Billing>(`/workspace/${workspaceId}/billing`);
  }
}
