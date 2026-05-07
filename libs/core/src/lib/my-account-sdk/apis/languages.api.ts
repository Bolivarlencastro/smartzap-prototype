import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Language } from '../models';
import { MyAccountV2Client } from './my-account-v2.client';

@Injectable({
  providedIn: 'root',
})
export class LanguagesApi {
  private readonly featurePath = '/languages';

  constructor(private _http: MyAccountV2Client) {}

  fetchLanguages(): Observable<Language[]> {
    return this._http.get(this.featurePath);
  }
}
