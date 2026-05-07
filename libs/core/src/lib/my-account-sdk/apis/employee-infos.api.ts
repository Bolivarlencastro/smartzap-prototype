import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeInfosApiParams, EmployeeInfosApiResponse, EmployeeInfosType } from '../models';
import { MyAccountV2Client } from './my-account-v2.client';

const EMPLOYEE_INFOS_PATH = '/users/employee-infos';

@Injectable({
  providedIn: 'root',
})
export class EmployeeInfosApi {
  constructor(private _http: MyAccountV2Client) {}

  fetchEmployeeInfosByType(
    type: EmployeeInfosType,
    params: Partial<EmployeeInfosApiParams>,
  ): Observable<EmployeeInfosApiResponse> {
    return this._http.get(`${EMPLOYEE_INFOS_PATH}/${type}`, params);
  }
}
