import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractAPI } from '../abstract-api';
import { CORE_CONFIG, CoreConfig } from '../core-config';

@Injectable({
  providedIn: 'root',
})
export class SearchClient extends AbstractAPI {
  override API_URL = `${this.coreConfig.apis.apiSearchUrl ?? ''}/v1`;

  constructor(
    protected override http: HttpClient,
    @Inject(CORE_CONFIG) private readonly coreConfig: CoreConfig,
  ) {
    super(http);
  }
}
