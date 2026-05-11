import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';

@Pipe({ name: 'certificateActiveFields' })
export class CertificateActiveFieldsPipe implements PipeTransform {
  constructor(private readonly translateService: TranslocoService) {}

  transform(certificate: CustomCertificateDto): string {
    if (!certificate) {
      return '';
    }

    const fields: Array<{ display: boolean; key: string }> = [
      { display: certificate.displayPerformance, key: 'CUSTOM_CERTIFICATES.CREATE_FORM.PERFORMANCE' },
      { display: certificate.displayTotalTime, key: 'CUSTOM_CERTIFICATES.CREATE_FORM.TOTAL_HOURS' },
      { display: certificate.displayConclusionDate, key: 'CUSTOM_CERTIFICATES.CREATE_FORM.CONCLUSION_DATE' },
    ];

    return fields
      .filter((f) => f.display)
      .map((f) => this.translateService.translate(f.key))
      .join('; ');
  }
}
