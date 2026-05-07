export type CustomCertificateTemplate = 'trail' | 'mission';
export type CustomCertificateOrientation = 'portrait' | 'landscape';

export interface CustomCertificatesFilter {
  search?: string;
  page?: number;
  per_page?: number;
  template?: CustomCertificateTemplate;
}

export type CustomCertificateListParamDto = {
  search?: string;
  page?: number;
  limit?: number;
  'filter.template'?: `$eq:${CustomCertificateTemplate}`;
};

export type CustomCertificateDto = {
  id?: string;
  name: string;
  template: CustomCertificateTemplate;
  orientation: CustomCertificateOrientation;
  displayPerformance?: boolean;
  displayBrand?: boolean;
  displayTotalTime?: boolean;
  displayConclusionDate?: boolean;
  textColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  brandImage?: string;
  signedBy?: string;
  default?: boolean;
};

export type VinculateCertificateLearnContentDto = {
  certificateId: string;
  learnContentId: string;
};

export type LearnContentCertificateChange = {
  certificate: CustomCertificateDto;
  learnContentId: string;
};
