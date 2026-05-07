import { Store } from '@ngrx/store';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';
import { certificatesListFeature } from '../store/features';
import { CertificatesListActions } from '../store/actions';

export class CertificatesBaseFacade {
  public readonly certificates$: Observable<CustomCertificateDto[]>;
  public readonly isLoading$: Observable<boolean>;

  constructor(protected store: Store) {
    this.certificates$ = this.store.select(certificatesListFeature.selectAll);
    this.isLoading$ = this.store.select(certificatesListFeature.selectIsLoading);
  }

  previewCertificate(certificate: CustomCertificateDto) {
    this.store.dispatch(CertificatesListActions.previewCertificate({ certificate }));
  }
}
