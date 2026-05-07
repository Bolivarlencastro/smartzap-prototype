import { CertificateActiveFieldsPipe } from './certificate-active-fields.pipe';
import { TranslocoService } from '@jsverse/transloco';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CertificateActiveFieldsPipe', () => {
  let translateService: jest.Mocked<TranslocoService>;

  beforeEach(() => {
    translateService = { translate: jest.fn((value) => value) } as unknown as jest.Mocked<TranslocoService>;
  });

  it('should return the active fields of a custom certificate translated', () => {
    const pipe = new CertificateActiveFieldsPipe(translateService);
    const customCertificate = {
      displayConclusionDate: true,
      displayPerformance: true,
      displayTotalTime: true,
    } as CustomCertificateDto;

    const result = pipe.transform(customCertificate);

    expect(result).toBe(
      'CUSTOM_CERTIFICATES.CREATE_FORM.PERFORMANCE; CUSTOM_CERTIFICATES.CREATE_FORM.TOTAL_HOURS; CUSTOM_CERTIFICATES.CREATE_FORM.CONCLUSION_DATE',
    );
  });

  it('should return an empty string whe no fields are active', () => {
    const pipe = new CertificateActiveFieldsPipe(translateService);
    const customCertificate = {
      displayConclusionDate: false,
      displayPerformance: false,
      displayTotalTime: false,
    } as CustomCertificateDto;

    const result = pipe.transform(customCertificate);

    expect(result).toBe('');
  });

  it('should handle falsy values', () => {
    const pipe = new CertificateActiveFieldsPipe(translateService);
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform({} as CustomCertificateDto)).toBe('');
  });
});
