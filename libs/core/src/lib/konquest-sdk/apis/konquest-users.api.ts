import { Injectable } from '@angular/core';
import { KonquestClient } from './konquest.client';
import { UserDataTransfer } from '../models';

@Injectable({
  providedIn: 'root',
})
export class KonquestUsersAPI {
  constructor(private _http: KonquestClient) {}

  transferUserEnrollments(body: any) {
    return this._http.post('/transfers', body);
  }

  deleteUserEnrollments(body: any) {
    return this._http.post('/users/delete-enrollments', body);
  }

  transferUser(data: UserDataTransfer) {
    return this._http.post('/transfers', data);
  }
}
