import { Pipe, PipeTransform } from '@angular/core';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TranslocoService } from '@jsverse/transloco';

const TOTAL_HOURS = marker('CUSTOM_CERTIFICATES.CREATE_FORM.TOTAL_HOURS');
const PERFORMANCE = marker('CUSTOM_CERTIFICATES.CREATE_FORM.PERFORMANCE');
const CONCLUSION_DATE = marker('CUSTOM_CERTIFICATES.CREATE_FORM.CONCLUSION_DATE');

type FieldMapItem = { display: boolean; key: string };

@Pipe({
  name: 'certificateActiveFields',
  standalone: true,
})
export class CertificateActiveFieldsPipe implements PipeTransform {
  constructor(private readonly translateService: TranslocoService) {}

  transform(certificate: CustomCertificateDto): string {
    if (!certificate) {
      return '';
    }

    const fieldsMap: FieldMapItem[] = [
      { display: certificate.displayPerformance, key: PERFORMANCE },
      { display: certificate.displayTotalTime, key: TOTAL_HOURS },
      { display: certificate.displayConclusionDate, key: CONCLUSION_DATE },
    ];

    const activeFields: string[] = fieldsMap
      .filter((field) => field.display)
      .map((field) => this.translateService.translate(field.key));

    return activeFields.join('; ');
  }
}
