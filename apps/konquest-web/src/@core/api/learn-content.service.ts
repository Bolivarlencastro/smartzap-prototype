import { Injectable } from '@angular/core';
import { KontentLearnContentAPI } from '@core/api/base';
import { ContentType } from '@core/model';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LearnContentService {
  constructor(private _learnContentAPI: KontentLearnContentAPI) {}

  createLearnContent(contentData: ContentFormData): Observable<any> {
    if (contentData.value instanceof File) {
      return this._learnContentAPI.createFile(
        contentData.name,
        contentData.value,
        {
          reportProgress: true,
          observe: 'events',
        },
        contentData.time || undefined,
        contentData.type,
      );
    }

    const data = this.buildContent(contentData);
    return this._learnContentAPI.create(data);
  }

  createLearnContentFromLink(name: string, link: string) {
    return this._learnContentAPI.create({ name, link });
  }

  uploadFileWithoutMonitoring(content: ContentFormData, time?: number) {
    return this._learnContentAPI.createFile(content.name, content.value, undefined, time, content.type);
  }

  createHtmlLearnContentFromLink(name: string, url: string, time: number) {
    return this._learnContentAPI.create({ name, html: url, time_minutes: time });
  }

  fetchLearnContentType(contentTypeId: string | undefined): Observable<ContentType> {
    return this._learnContentAPI.getContentType(contentTypeId);
  }

  // Private methods
  private buildContent(contentForm: ContentFormData): any {
    const { type, name, value, time } = contentForm;

    switch (type) {
      case 'FILE':
        return { name, file: value };
      case 'H5P':
        return { name, html: value, time_minutes: time };
      case 'GENIALLY':
        if (typeof value !== 'string') {
          return { name, file: value, time_minutes: time };
        } else {
          return { name, html: value, time_minutes: time };
        }
      case 'YOUTUBE':
      case 'VIMEO':
      case 'SOUNDCLOUD':
      case 'GOOGLE_DRIVE':
      case 'LINK':
        return { name, link: value ?? '' };
      default:
        throw new Error('Invalid Learn Content Type.');
    }
  }
}
