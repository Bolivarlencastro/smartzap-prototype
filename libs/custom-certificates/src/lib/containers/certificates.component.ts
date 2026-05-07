import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { CertificatesHeaderComponent, CertificatesListComponent } from '../components';
import { CustomCertificateDto, CustomCertificatesFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { PageEvent } from '@angular/material/paginator';
import { CertificatesListFacade, NewCertificateDialogFacade } from '../facades';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'kp-certificates',
  template: `
    <kp-certificates-header (newItemEvent)="newCertificate()"></kp-certificates-header>
    <kp-table-layout
      class="grow"
      [totalItems]="totalItems()"
      [pageIndex]="(filter()?.page ?? 1) - 1"
      [pageSize]="filter()?.per_page ?? 10"
      [searchPlaceholder]="'CUSTOM_CERTIFICATES.SEARCH_FOR'"
      (pageChange)="pageChanged($event)"
      (searchChange)="onSearch($event)"
    >
      <kp-certificates-list
        kpTable
        [certificates]="certificates()"
        [isLoading]="isLoading()"
        (editCertificate)="editCertificate($event)"
        (deleteCertificate)="deleteCertificate($event)"
        (toggleDefault)="toggleDefaultCertificate($event)"
        (previewCertificate)="previewCertificate($event)"
      ></kp-certificates-list>
    </kp-table-layout>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, CertificatesHeaderComponent, CertificatesListComponent, KpTableLayoutComponent],
})
export class CertificatesComponent implements OnInit, OnDestroy {
  protected readonly certificates: Signal<CustomCertificateDto[]>;
  protected readonly isLoading: Signal<boolean>;
  protected readonly filter: Signal<CustomCertificatesFilter>;
  protected readonly totalItems: Signal<number>;

  private readonly newCertificateDialogFacade = inject(NewCertificateDialogFacade);
  private readonly certificatesListFacade = inject(CertificatesListFacade);

  constructor() {
    this.certificates = toSignal(this.certificatesListFacade.certificates$);
    this.isLoading = toSignal(this.certificatesListFacade.isLoading$);
    this.filter = toSignal(this.certificatesListFacade.filter$);
    this.totalItems = toSignal(this.certificatesListFacade.totalItems$);
  }

  ngOnInit(): void {
    this.certificatesListFacade.loadCertificates();
  }

  ngOnDestroy() {
    this.certificatesListFacade.resetState();
  }

  newCertificate() {
    this.newCertificateDialogFacade.newCertificate();
  }

  previewCertificate(certificate: CustomCertificateDto) {
    this.certificatesListFacade.previewCertificate(certificate);
  }

  onSearch(search: string) {
    this.certificatesListFacade.search(search);
  }

  pageChanged(event: PageEvent) {
    this.certificatesListFacade.pageChange({ page: event.pageIndex + 1, per_page: event.pageSize });
  }

  editCertificate(certificate: CustomCertificateDto) {
    this.newCertificateDialogFacade.editCertificate(certificate);
  }

  deleteCertificate(certificate: CustomCertificateDto) {
    this.certificatesListFacade.deleteCertificate(certificate);
  }

  toggleDefaultCertificate(certificate: CustomCertificateDto) {
    this.certificatesListFacade.toggleDefaultCertificate(certificate);
  }
}
