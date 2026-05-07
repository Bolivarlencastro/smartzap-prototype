import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AbstractAPI } from './abstract/abstract.api';

@Injectable({ providedIn: 'root' })
export class KonquestAPI extends AbstractAPI {
  API_URL = environment.apps.konquest.api;

  constructor(protected override http: HttpClient) {
    super(http);
  }
}
