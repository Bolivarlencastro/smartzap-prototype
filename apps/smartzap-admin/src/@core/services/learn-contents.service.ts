import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KonquestAPI } from '@core/api';
import { ImageResponse } from '@core/model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable({ providedIn: 'root' })
export class LearnContentsService {
  constructor(
    private readonly _http: KonquestAPI,
    private readonly _messageService: KpMessageService,
  ) {}

  getCoverUrl(image: File): Observable<ImageResponse> {
    const formData = new FormData();
    formData.append('file', image);

    return this._http.postFormData('/learn-contents/cover-images', formData).pipe(
      catchError((error) => {
        this._messageService.error(marker('API.ERROR.UPLOAD_IMAGE'));
        return of(error);
      }),
    );
  }
}
