import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { ImageResponse, LearnContentsApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';
import { KpMessageService } from '../../services/kp-message.service';

@Injectable({ providedIn: 'root' })
export class ContentDialogService {
  constructor(
    private _http: HttpClient,
    private _learnContentsService: LearnContentsApi,
    private _messageService: KpMessageService,
  ) {}

  loadSoundcloud(url: string) {
    const body = new FormData();
    body.append('format', 'json');
    body.append('url', url);

    return this._http.post('https://soundcloud.com/oembed', body);
  }

  loadVimeo(url: string) {
    return this._http.get(`https://vimeo.com/api/oembed.json?url=${url}`);
  }

  imageUploader(image: File): Observable<ImageResponse> {
    return this._learnContentsService.saveCoverWithSize(image, 230, 230);
  }

  displayMessageTypeNotAccepted(): void {
    this._messageService.error(marker('UI.KP_CONTENT_DIALOG.TYPE_NOT_ACCEPTED'));
  }

  displayMessageFileSizeExceeded(maxSizeMB: number): void {
    this._messageService.error(marker('UI.KP_CONTENT_DIALOG.FILE_SIZE_EXCEEDED'), { maxSizeMB: String(maxSizeMB) });
  }
}
