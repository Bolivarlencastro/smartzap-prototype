import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AbstractAPI } from './abstract/abstract.api';

@Injectable({ providedIn: 'root' })
export class CustomSectionsAPI extends AbstractAPI {
  API_URL = `${environment.apps.customSections.api}`;

  constructor(protected override http: HttpClient) {
    super(http);
  }
}
