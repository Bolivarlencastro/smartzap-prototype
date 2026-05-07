import { CertificatesBaseFacade } from './certificates-base-facade';
import { Store } from '@ngrx/store';
import {
  CustomCertificateDto,
  CustomCertificateTemplate,
  LearnContentCertificateChange,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { CertificateLearnContentActions, CertificatesListActions } from '../store/actions';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { certificatesListFeature } from '../store/features';

@Injectable()
export class CertificateLearnContentFacade extends CertificatesBaseFacade {
  public readonly learnContentCertificate$: Observable<CustomCertificateDto>;

  constructor(store: Store) {
    super(store);
    this.learnContentCertificate$ = store.select(certificatesListFeature.selectLearnContentCertificate);
  }

  loadCertificatesForLearnContent(template: CustomCertificateTemplate) {
    this.store.dispatch(CertificatesListActions.loadCertificatesForLearnContent({ template }));
  }

  loadLearnContentCertificate(learnContentId: string) {
    this.store.dispatch(CertificateLearnContentActions.loadLearnContentCertificate({ learnContentId }));
  }

  saveLearnContentCertificate(event: LearnContentCertificateChange) {
    if (event.certificate) {
      this.store.dispatch(CertificateLearnContentActions.vinculateLearnContent({ event }));
      return;
    }

    this.store.dispatch(
      CertificateLearnContentActions.desvinculateLearnContent({ learnContentId: event.learnContentId }),
    );
  }
}
