import { Injectable } from '@angular/core';
import { ContentType, LearnContent } from '@core/model';
import { Observable } from 'rxjs';
import { KontentAPI } from './kontent.api';
import { LearnContentType } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';

const PATH = '/learn-content';

@Injectable({ providedIn: 'root' })
export class KontentLearnContentAPI {
  constructor(protected http: KontentAPI) {}

  /**
   * Create a Scorm content
   *
   * @param file the scorm .zip file
   *
   * @returns LearnContent
   */
  scormUpload(file: File | null, duration: string): Observable<any> {
    const formData = new FormData();
    formData.append('scorm_package', file);
    formData.append('duration', duration);
    return this.http.postFormData2(`${PATH}/scorm`, formData);
  }

  /**
   * Create a content
   *
   * @param data the content
   *
   * @returns LearnContent
   */
  create(data: any): Observable<LearnContent> {
    return this.http.post(`${PATH}`, data);
  }

  /**
   * Create a content given an file
   *
   * @param name the content name
   * @param file the content file
   *
   * @returns
   */
  createFile(
    name: string,
    file: File,
    options?: any,
    time?: number,
    type?: LearnContentType,
  ): Observable<LearnContent> {
    const formData = new FormData();
    formData.append('name', name);

    switch (type) {
      case 'SCORM':
        formData.append('time_minutes', time + '');
        formData.append('scorm_package', file);
        break;
      case 'GENIALLY':
      case 'H5P':
        formData.append('time_minutes', time + '');
        formData.append('index_file', 'genially.html');
        formData.append('html_file', file);
        break;
      default:
        formData.append('file', file);
    }

    return this.http.postFormData(PATH, formData, options);
  }

  /**
   *  Get a content given a valid id
   *
   * @param id content id
   *
   * @returns LearnContent
   */
  get(id: string): Observable<LearnContent> {
    return this.http.get(`${PATH}/${id}`);
  }

  /**
   *  Get a content type given a valid id
   *
   * @param id content type id
   *
   * @returns ContentType
   */
  getContentType(id: string): Observable<ContentType> {
    return this.http.get(`${PATH}/types/${id}`);
  }

  /**
   * Get content types
   */
  getContentTypes(): Observable<any> {
    return this.http.get<any>(`${PATH}/types`);
  }

  /**
   * Remove a content given a valid id
   *
   * @param id content id
   */
  delete(id: string): Observable<void> {
    return this.http.delete(`${PATH}/${id}`);
  }
}
