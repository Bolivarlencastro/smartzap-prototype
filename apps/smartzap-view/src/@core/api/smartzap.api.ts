import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractApi } from '@core/api/abstract.api';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class SmartzapApi extends AbstractApi {
  API_URL = environment.api;
  constructor(protected override _http: HttpClient) {
    super(_http);
  }
}
