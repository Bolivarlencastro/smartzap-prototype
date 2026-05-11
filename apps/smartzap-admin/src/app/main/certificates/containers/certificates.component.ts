import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { TranslocoPipe } from '@jsverse/transloco';
import { CustomCertificateDto, CustomCertificatesFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpTableLayoutComponent } from 'libs/shared-ui/ui/src/lib/components/kp-table-layout';
import { CertificatesHeaderComponent } from '../components/certificates-header/certificates-header.component';
import { CertificatesListComponent } from '../components/certificates-list/certificates-list.component';
import { CertificatesListFacade } from '../facades/certificates-list.facade';
import { NewCertificateDialogFacade } from '../facades/new-certificate-dialog.facade';

@Component({
  selector: 'kp-certificates',
  template: `
    <kp-certificates-header (newItemEvent)="newCertificate()"></kp-certificates-header>
    <kp-table-layout
      class="grow"
      [totalItems]="totalItems()"
      [pageIndex]="(filter()?.page ?? 1) - 1"
      [pageSize]="filter()?.per_page ?? 10"
      [searchPlaceholder]="'CUSTOM_CERTIFICATES.SEARCH_FOR' | transloco"
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
  styles: `
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, CertificatesHeaderComponent, CertificatesListComponent, KpTableLayoutComponent],
})
export class CertificatesComponent implements OnInit, OnDestroy {
  protected readonly certificates: Signal<CustomCertificateDto[]>;
  protected readonly isLoading: Signal<boolean>;
  protected readonly filter: Signal<CustomCertificatesFilter>;
  protected readonly totalItems: Signal<number>;

  private readonly listFacade = inject(CertificatesListFacade);
  private readonly dialogFacade = inject(NewCertificateDialogFacade);

  constructor() {
    this.certificates = toSignal(this.listFacade.certificates$, { initialValue: [] });
    this.isLoading = toSignal(this.listFacade.isLoading$, { initialValue: false });
    this.filter = toSignal(this.listFacade.filter$);
    this.totalItems = toSignal(this.listFacade.totalItems$, { initialValue: 0 });
  }

  ngOnInit() {
    this.listFacade.loadCertificates();
  }

  ngOnDestroy() {
    this.listFacade.resetState();
  }

  newCertificate() {
    this.dialogFacade.newCertificate();
  }

  previewCertificate(certificate: CustomCertificateDto) {
    this.listFacade.previewCertificate(certificate);
  }

  onSearch(search: string) {
    this.listFacade.search(search);
  }

  pageChanged(event: PageEvent) {
    this.listFacade.pageChange({ page: event.pageIndex + 1, per_page: event.pageSize });
  }

  editCertificate(certificate: CustomCertificateDto) {
    this.dialogFacade.editCertificate(certificate);
  }

  deleteCertificate(certificate: CustomCertificateDto) {
    this.listFacade.deleteCertificate(certificate);
  }

  toggleDefaultCertificate(certificate: CustomCertificateDto) {
    this.listFacade.toggleDefaultCertificate(certificate);
  }
}
