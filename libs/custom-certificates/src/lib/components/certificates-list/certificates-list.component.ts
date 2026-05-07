import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CertificateActiveFieldsPipe } from '../../pipes';

@Component({
  selector: 'kp-certificates-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatSlideToggleModule,
    TranslocoModule,
    MatListModule,
    MatButtonModule,
    NgxSkeletonLoaderModule,
    CertificateActiveFieldsPipe,
  ],
  templateUrl: './certificates-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    'type',
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
