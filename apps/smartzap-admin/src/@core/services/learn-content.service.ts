import { Injectable } from '@angular/core';
import { KontentAPI } from '@core/api';
import { ContentType, LearnContent } from '@core/model';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LearnContentService {
  private _url = '/learn-content';

  constructor(private _http: KontentAPI) {}

  createLearnContent(learnContentFormData: ContentFormData, messagesContentEmbed: boolean): Observable<LearnContent> {
    const data = this.buildContent(learnContentFormData);

    if (learnContentFormData.type === 'FILE') {
      return this.uploadFile(data, messagesContentEmbed);
    }

    return this._http.post<LearnContent>(this._url, data);
  }

  linkSanitizer(link: string): string {
    if (!link) {
      return '';
    }
    return link.replace('https://youtu.be/', 'https://www.youtube.com/watch?v=');
  }

  fetchLearnContent(contentId: string): Observable<LearnContent> {
    return this._http.get<LearnContent>(`${this._url}/${contentId}`);
  }

  fetchLearnContentType(contentTypeId: string): Observable<ContentType> {
    return this._http.get<ContentType>(`${this._url}/types/${contentTypeId}`);
  }

  fetchLearnContentTypes(): Observable<any> {
    return this._http.get<any>(`${this._url}/types`);
  }

  removeLearnContent(contentId: string): Observable<void> {
    return this._http.delete(`${this._url}/${contentId}`);
  }

  // Private methods
  private buildContent(learnContentFormData: ContentFormData): any {
    const { type, name, description, value } = learnContentFormData;

    switch (type) {
      case 'FILE':
        return { name, description, file: value };
      case 'YOUTUBE':
      case 'VIMEO':
      case 'SOUNDCLOUD':
      case 'GOOGLE_DRIVE':
        return { name, description, link: this.linkSanitizer(value) };
      case 'BLOG':
        return { name, description, blog: value };
      default:
        throw new Error('Inválid Learn Content Type. Should be FILE, LINK or BLOG');
    }
  }

  private uploadFile(
    data: { name: string; description: string; file: any },
    messagesContentEmbed: boolean,
  ): Observable<LearnContent> {
    const { file, name, description } = data;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('is_whatsapp_content', messagesContentEmbed ? 'True' : 'False');
    return this._http.postFormData<LearnContent>(this._url, formData);
  }
}
