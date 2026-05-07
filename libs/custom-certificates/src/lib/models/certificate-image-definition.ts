import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export type CertificateImageDefinition = keyof Pick<CustomCertificateDto, 'backgroundImage' | 'brandImage'>;
