import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AbstractAPI } from './abstract/abstract.api';

@Injectable({ providedIn: 'root' })
export class AnalyticsAPI extends AbstractAPI {
  API_URL = environment.apps.learnAnalytics.api;

  constructor(protected override http: HttpClient) {
    super(http);
  }
}
