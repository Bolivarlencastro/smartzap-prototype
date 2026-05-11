import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { certificatesListFeature } from '../store/features';
import { CertificatesListActions } from '../store/actions';

export class CertificatesBaseFacade {
  readonly certificates$: Observable<CustomCertificateDto[]>;
  readonly isLoading$: Observable<boolean>;

  constructor(protected readonly store: Store) {
    this.certificates$ = this.store.select(certificatesListFeature.selectAll);
    this.isLoading$ = this.store.select(certificatesListFeature.selectIsLoading);
  }

  previewCertificate(certificate: CustomCertificateDto) {
    this.store.dispatch(CertificatesListActions.previewCertificate({ certificate }));
  }
}
