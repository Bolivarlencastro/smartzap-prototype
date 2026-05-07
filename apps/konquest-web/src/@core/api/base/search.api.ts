import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AbstractAPI } from './abstract/abstract.api';

@Injectable({ providedIn: 'root' })
export class SearchAPI extends AbstractAPI {
  API_URL = `${environment.apps.search.api}`;

  constructor(protected override http: HttpClient) {
    super(http);
  }
}
