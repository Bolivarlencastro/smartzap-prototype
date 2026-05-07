import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class AbstractApi {
  protected abstract API_URL: string;

  constructor(protected _http: HttpClient) {}

  public get<T>(path: string, params?: any): Observable<T> {
    return this._http.get<T>(`${this.API_URL}${path}`, { params });
  }

  public post<T>(path: string, body: any): Observable<T> {
    return this._http.post<T>(`${this.API_URL}${path}`, body);
  }

  public put<T>(path: string, body: any): Observable<T> {
    return this._http.put<T>(`${this.API_URL}${path}`, body);
  }

  public patch<T>(path: string, body: any): Observable<T> {
    return this._http.patch<T>(`${this.API_URL}${path}`, body);
  }

  public delete<T>(path: string): Observable<T> {
    return this._http.delete<T>(`${this.API_URL}${path}`);
  }
}
