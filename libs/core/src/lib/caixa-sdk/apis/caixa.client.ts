import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CORE_CONFIG, CoreConfig } from '../../core-config';
import { CAIXA_APPLICATION_TYPE, APPLICATION_TYPE } from './application-type';

@Injectable({
  providedIn: 'root',
})
export class CaixaClient {
  private readonly API_URL = this.coreConfig.apis.smartzapPortal;

  private readonly headers: HttpHeaders;

  protected constructor(
    protected http: HttpClient,
    @Inject(CORE_CONFIG) private coreConfig: CoreConfig,
    @Inject(APPLICATION_TYPE) caixaAppHeader: CAIXA_APPLICATION_TYPE,
  ) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-application': caixaAppHeader.toLowerCase(),
    });
  }

  get<T>(endpoint: string, params?: any) {
    const options = this.createHttpOptions(params);
    return this.http.get<T>(`${this.API_URL}${endpoint}`, options);
  }

  post<T>(endpoint: string, body: any, params?: any) {
    const options = this.createHttpOptions(params);
    return this.http.post<T>(`${this.API_URL}${endpoint}`, body, options);
  }

  patch<T>(endpoint: string, body: any, params?: any) {
    const options = this.createHttpOptions(params);
    return this.http.patch<T>(`${this.API_URL}${endpoint}`, body, options);
  }

  private createHttpOptions(params: Record<string, unknown>): Record<string, unknown> {
    const options: Record<string, unknown> = { headers: this.headers };
    if (params) {
      options['params'] = this.serializeParams(params);
    }

    return options;
  }

  private serializeParams(params: Record<string, any>): HttpParams {
    const paramsCopy = structuredClone(params);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '') {
        delete paramsCopy[key];
      }
    });

    return new HttpParams({ fromObject: paramsCopy });
  }
}
