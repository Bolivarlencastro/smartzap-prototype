import { Inject, Injectable } from '@angular/core';
import { AbstractAPI } from '../../abstract-api';
import { HttpClient } from '@angular/common/http';
import { CORE_CONFIG, CoreConfig } from '../../core-config';

@Injectable({
  providedIn: 'root',
})
export class SisyphusClient extends AbstractAPI {
  API_URL = `${this.coreConfig.apis.apiSisyphusUrl}`;

  constructor(
    protected override http: HttpClient,
    @Inject(CORE_CONFIG) private coreConfig: CoreConfig,
  ) {
    super(http);
  }
}
