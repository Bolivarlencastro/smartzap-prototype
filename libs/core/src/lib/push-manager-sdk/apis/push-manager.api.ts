import { Injectable } from '@angular/core';
import { PushManagerClient } from './push-manager.client';
import { TemplatesResponseModel } from '../models/template';

@Injectable({
  providedIn: 'root',
})
export class PushManagerApi {
  constructor(private readonly http: PushManagerClient) {}

  fetchTemplates() {
    return this.http.get<TemplatesResponseModel>('/templates');
  }
}
