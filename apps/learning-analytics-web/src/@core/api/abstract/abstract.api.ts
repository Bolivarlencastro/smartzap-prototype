import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class AbstractAPI {
  protected abstract API_URL: string;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(protected http: HttpClient) {}

  public get<T>(path: string, params?: any): Observable<T> {
    const options = this.defineOptions(params);
    return this.http.get<T>(`${this.API_URL}${path}`, options);
  }

  public post<T>(path: string, data: any, params?: any): Observable<T> {
    const body = JSON.stringify(data);
    const options = this.defineOptions(params);
    return this.http.post<T>(`${this.API_URL}${path}`, body, options);
  }

  public postFormData<T>(path: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.API_URL}${path}`, data);
  }

  public put<T>(path: string, data: any, params?: any): Observable<T> {
    const body = JSON.stringify(data);
    const options = this.defineOptions(params);
    return this.http.put<T>(`${this.API_URL}${path}`, body, options);
  }

  public patch<T>(path: string, data: any, params?: any): Observable<T> {
    const body = JSON.stringify(data);
    const options = this.defineOptions(params);
    return this.http.patch<T>(`${this.API_URL}${path}`, body, options);
  }

  public delete<T>(path: string, params?: any): Observable<T> {
    const options = this.defineOptions(params);
    return this.http.delete<T>(`${this.API_URL}${path}`, options);
  }

  public serializeParams(params: any): HttpParams {
    let httpParams = null;
    if (params) {
      httpParams = new HttpParams();
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return httpParams;
  }

  private defineOptions(params?: any): Record<string, unknown> {
    const options = {};

    options['headers'] = this.headers;

    if (params) {
      options['params'] = this.serializeParams(params);
    }
    return options;
  }
}
