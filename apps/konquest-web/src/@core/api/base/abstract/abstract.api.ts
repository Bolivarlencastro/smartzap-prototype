import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { format, isDate } from 'date-fns';
import { Observable } from 'rxjs';

export const LoadingInterceptorSkipHeader = 'X-Skip-Loading-Interceptor';

export abstract class AbstractAPI {
  protected abstract API_URL: string;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(protected http: HttpClient) {}

  public get<T>(
    path: string,
    params?: any,
    ignoreLoadingInterceptor?: boolean,
    observeResponse = false,
  ): Observable<T> {
    const options = this.defineOptions(ignoreLoadingInterceptor, observeResponse, params);
    const apiUrl = String(path).includes('http', 0) ? '' : this.API_URL;
    return this.http.get<T>(`${apiUrl}${path}`, options);
  }

  public post<T>(
    path: string,
    data: any,
    params?: any,
    ignoreLoadingInterceptor?: boolean,
    observeResponse = false,
  ): Observable<T> {
    const body = JSON.stringify(data);
    const options = this.defineOptions(ignoreLoadingInterceptor, observeResponse, params);
    const apiUrl = String(path).includes('http', 0) ? '' : this.API_URL;
    return this.http.post<T>(`${apiUrl}${path}`, body, options);
  }

  public postFormData<T>(path: string, data: any, options = {}): Observable<T> {
    return this.http.post<T>(`${this.API_URL}${path}`, data, options);
  }

  public postFormData2(path: string, data: any) {
    return this.http.post(`${this.API_URL}${path}`, data, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public put<T>(
    path: string,
    data: any,
    params?: any,
    ignoreLoadingInterceptor?: boolean,
    observeResponse = false,
  ): Observable<T> {
    const body = JSON.stringify(data);
    const options = this.defineOptions(ignoreLoadingInterceptor, observeResponse, params);
    const apiUrl = String(path).includes('http', 0) ? '' : this.API_URL;
    return this.http.put<T>(`${apiUrl}${path}`, body, options);
  }

  public patch<T>(
    path: string,
    data: any,
    params?: any,
    ignoreLoadingInterceptor?: boolean,
    observeResponse = false,
  ): Observable<T> {
    const body = JSON.stringify(data);
    const options = this.defineOptions(ignoreLoadingInterceptor, observeResponse, params);
    const apiUrl = String(path).includes('http', 0) ? '' : this.API_URL;
    return this.http.patch<T>(`${apiUrl}${path}`, body, options);
  }

  public delete<T>(path: string, params?: any, ignoreLoadingInterceptor?: boolean): Observable<T> {
    const options = this.defineOptions(ignoreLoadingInterceptor, false, params);
    const apiUrl = String(path).includes('http', 0) ? '' : this.API_URL;
    return this.http.delete<T>(`${apiUrl}${path}`, options);
  }

  private defineOptions(
    ignoreLoadingInterceptor: boolean,
    observeResponse = false,
    params?: any,
  ): Record<string, unknown> {
    const options = {};

    options['headers'] = ignoreLoadingInterceptor
      ? this.headers.set(LoadingInterceptorSkipHeader, ignoreLoadingInterceptor.toString())
      : this.headers;
    if (observeResponse) {
      options['observe'] = 'response';
    }
    if (params) {
      options['params'] = this.serializeParams(params);
    }
    return options;
  }

  private serializeParams(params: Record<string, unknown>): HttpParams {
    if (!params) {
      return null;
    }

    return new HttpParams({ fromObject: this.normalizeParams(params) });
  }

  private normalizeParams(params: { [param: string]: any }) {
    const paramsCopy = { ...params };

    for (const property in paramsCopy) {
      const value = paramsCopy[property];

      if (value == null) {
        delete paramsCopy[property];
        continue;
      }

      if (isDate(value)) {
        paramsCopy[property] = format(value, 'yyyy-MM-dd');
        continue;
      }

      if (Array.isArray(value)) {
        paramsCopy[property] = value.join(',');
      }
    }

    return paramsCopy;
  }
}
