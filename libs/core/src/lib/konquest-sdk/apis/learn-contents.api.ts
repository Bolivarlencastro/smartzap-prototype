import { Injectable } from '@angular/core';
import { KonquestClient } from './konquest.client';
import { Observable } from 'rxjs';
import { ImageResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LearnContentsApi {
  constructor(private _http: KonquestClient) {}

  saveCoverWithSize(image: File, width: number, height: number): Observable<ImageResponse> {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('width', width.toString());
    formData.append('height', height.toString());

    return this._http.postFormData<any>('/learn-contents/cover-images-by-size', formData);
  }
}
