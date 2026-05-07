import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractAPI } from '../../abstract-api';
import { CORE_CONFIG, CoreConfig } from '../../core-config';

@Injectable({
  providedIn: 'root',
})
export class KontentClient extends AbstractAPI {
  API_URL = `${this.coreConfig.apis.apiKontentUrl}`;

  constructor(
    protected override http: HttpClient,
    @Inject(CORE_CONFIG) private coreConfig: CoreConfig,
  ) {
    super(http);
  }
}
