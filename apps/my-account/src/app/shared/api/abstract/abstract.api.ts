import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    const options = this.defineOptions(ignoreLoadingInterceptor ?? false, observeResponse, params);
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
    const options = this.defineOptions(ignoreLoadingInterceptor ?? false, observeResponse, params);
    return this.http.post<T>(`${this.API_URL}${path}`, body, options);
  }

  public postFormData<T>(path: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.API_URL}${path}`, data);
  }

  public put<T>(
    path: string,
    data: any,
    params?: any,
    ignoreLoadingInterceptor?: boolean,
    observeResponse = false,
  ): Observable<T> {
    const body = JSON.stringify(data);
    const options = this.defineOptions(ignoreLoadingInterceptor ?? false, observeResponse, params);
    return this.http.put<T>(`${this.API_URL}${path}`, body, options);
  }

  public patch<T>(
    path: string,
    data: any,
    params?: any,
    ignoreLoadingInterceptor?: boolean,
    observeResponse = false,
  ): Observable<T> {
    const body = JSON.stringify(data);
    const options = this.defineOptions(ignoreLoadingInterceptor ?? false, observeResponse, params);
    return this.http.patch<T>(`${this.API_URL}${path}`, body, options);
  }

  public delete<T>(path: string, params?: any, ignoreLoadingInterceptor?: boolean): Observable<T> {
    const options = this.defineOptions(ignoreLoadingInterceptor ?? false, false, params);
    return this.http.delete<T>(`${this.API_URL}${path}`, options);
  }

  public serializeParams(params: any): HttpParams | null {
    let httpParams: HttpParams | null | undefined = null;
    if (params) {
      httpParams = new HttpParams();
      Object.keys(params).forEach((key) => {
        httpParams = httpParams?.append(key, params[key]);
      });
    }
    return httpParams;
  }

  private defineOptions(
    ignoreLoadingInterceptor: boolean,
    observeResponse = false,
    params?: any,
  ): Record<string, unknown> {
    const options: Record<string, HttpHeaders | HttpParams | string | null> = {};

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
}
