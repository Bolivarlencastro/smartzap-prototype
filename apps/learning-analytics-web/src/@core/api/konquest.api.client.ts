import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { AbstractAPI } from './abstract/abstract.api';

@Injectable({ providedIn: 'root' })
export class KonquestApiClient extends AbstractAPI {
  API_URL = `${environment.apps.konquest.api}`;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getCategories(value: string): Observable<any> {
    return this.http.get(`${this.API_URL}/categories`, { params: { search: value } });
  }
}
