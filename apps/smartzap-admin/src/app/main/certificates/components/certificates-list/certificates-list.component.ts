import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CertificateActiveFieldsPipe } from '../../pipes';

@Component({
  selector: 'kp-certificates-list',
  templateUrl: './certificates-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UpperCasePipe,
    MatTableModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    TranslocoPipe,
    NgxSkeletonLoaderModule,
    CertificateActiveFieldsPipe,
  ],
})
export class CertificatesListComponent {
  readonly certificates = input<CustomCertificateDto[]>([]);
  readonly isLoading = input<boolean>();
  readonly editCertificate = output<CustomCertificateDto>();
  readonly deleteCertificate = output<CustomCertificateDto>();
  readonly toggleDefault = output<CustomCertificateDto>();
  readonly previewCertificate = output<CustomCertificateDto>();

  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  protected readonly displayedColumns: string[] = [
    'miniature',
    'name',
    'orientation',
    'enabledFields',
    'menu',
    'toggle',
  ];

  onEdit(certificate: CustomCertificateDto) {
    this.editCertificate.emit(certificate);
  }

  onDelete(certificate: CustomCertificateDto) {
    this.deleteCertificate.emit(certificate);
  }

  onToggleDefault(certificate: CustomCertificateDto) {
    this.toggleDefault.emit(certificate);
  }

  onPreviewCertificate(certificate: CustomCertificateDto) {
    this.previewCertificate.emit(certificate);
  }
}
