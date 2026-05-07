import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomCertificateDto, CustomCertificatesFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { certificatesListFeature } from '../store/features';
import { CertificatesListActions } from '../store/actions';
import { CertificatesBaseFacade } from './certificates-base-facade';

@Injectable()
export class CertificatesListFacade extends CertificatesBaseFacade {
  readonly filter$: Observable<CustomCertificatesFilter>;
  readonly totalItems$: Observable<number>;

  constructor(store: Store) {
    super(store);
    this.filter$ = this.store.select(certificatesListFeature.selectFilter);
    this.totalItems$ = this.store.select(certificatesListFeature.selectTotalItems);
  }

  loadCertificates() {
    this.store.dispatch(CertificatesListActions.loadCertificates());
  }

  deleteCertificate(certificate: CustomCertificateDto) {
    this.store.dispatch(CertificatesListActions.openDeleteDialog({ certificate }));
  }

  toggleDefaultCertificate(certificate: CustomCertificateDto) {
    this.store.dispatch(CertificatesListActions.toggleDefaultCertificate({ certificate }));
  }

  pageChange(pagination: CustomCertificatesFilter) {
    this.store.dispatch(CertificatesListActions.setPagination({ pagination }));
  }

  search(search: string) {
    this.store.dispatch(CertificatesListActions.search({ search }));
  }

  resetState() {
    this.store.dispatch(CertificatesListActions.resetState());
  }
}
