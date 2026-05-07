import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractAPI } from '../../abstract-api';
import { CORE_CONFIG, CoreConfig } from '../../core-config';

@Injectable({
  providedIn: 'root',
})
export class KonquestClient extends AbstractAPI {
  API_URL = `${this.coreConfig.apis.apiKonquestUrl}`;

  constructor(
    protected override http: HttpClient,
    @Inject(CORE_CONFIG) private coreConfig: CoreConfig,
  ) {
    super(http);
  }
}
