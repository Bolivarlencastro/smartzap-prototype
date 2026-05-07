import { Injectable } from '@angular/core';
import { CustomCertificatesClient } from './custom-certificates.client';
import {
  CertificateValidationDto,
  CustomCertificateDto,
  CustomCertificateListParamDto,
  CustomCertificatesFilter,
  VinculateCertificateLearnContentDto,
} from '../models';
import { Paginated } from '../../pagination';

@Injectable({
  providedIn: 'root',
})
export class CustomCertificatesApi {
  private readonly basePath = '/certificates';

  constructor(private http: CustomCertificatesClient) {}

  list(filter: CustomCertificatesFilter) {
    const queryParams: CustomCertificateListParamDto = {
      search: filter.search || '',
      page: filter.page || 1,
      limit: filter.per_page || 100,
    };

    if (filter.template) {
      queryParams['filter.template'] = `$eq:${filter.template}`;
    }
    return this.http.get<Paginated<CustomCertificateDto>>(this.basePath, queryParams);
  }

  create(certificate: CustomCertificateDto, backgroundImage?: File, brandImage?: File) {
    const formData = this.buildFormData(certificate, backgroundImage, brandImage);
    return this.http.postFormData<CustomCertificateDto>(this.basePath, formData);
  }

  update(id: string, certificate: CustomCertificateDto, backgroundImage?: File, brandImage?: File) {
    const formData = this.buildFormData(certificate, backgroundImage, brandImage);
    return this.http.patchFormData<CustomCertificateDto>(`${this.basePath}/${id}`, formData);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }

  getById(id: string) {
    return this.http.get<CustomCertificateDto>(`${this.basePath}/${id}`);
  }

  toggleDefault(id: string) {
    return this.http.post<void>(`${this.basePath}/toggle-default`, { certificateId: id });
  }

  vinculateLearnContent(certificateLearnContent: VinculateCertificateLearnContentDto) {
    return this.http.post<VinculateCertificateLearnContentDto>(`${this.basePath}/vinculate`, certificateLearnContent);
  }

  desvinculateLearnContent(learnContentId: string) {
    return this.http.delete<void>(`${this.basePath}/vinculate/${learnContentId}`);
  }

  getLearnContentCertificate(learnContentId: string) {
    return this.http.get<CustomCertificateDto>(`${this.basePath}/vinculate/${learnContentId}`);
  }

  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.postFormData<{ url: string }>(`${this.basePath}/images`, formData);
  }

  validateCertificate(verificationCode: string) {
    return this.http.get<CertificateValidationDto>(`/validate/${verificationCode}`);
  }

  private buildFormData(certificate: CustomCertificateDto, backgroundImage?: File, brandImage?: File) {
    const formData = new FormData();

    Object.entries(certificate).forEach(([key, value]) => {
      if (typeof value !== 'boolean') {
        formData.append(key, value);
      } else {
        formData.append(key, value ? 'true' : 'false');
      }
    });

    if (backgroundImage) {
      formData.append('backgroundImage', backgroundImage);
    }

    if (brandImage) {
      formData.append('brandImage', brandImage);
    }

    return formData;
  }
}
