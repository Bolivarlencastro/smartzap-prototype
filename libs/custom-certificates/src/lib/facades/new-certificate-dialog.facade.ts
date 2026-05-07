import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { newCertificateDialogFeature } from '../store/features';
import { NewCertificateDialogActions } from '../store/actions';
import { CertificateImageDefinition } from '../models/certificate-image-definition';

@Injectable()
export class NewCertificateDialogFacade {
  readonly certificate$: Observable<CustomCertificateDto | undefined>;
  readonly isSaving$: Observable<boolean>;

  constructor(private store: Store) {
    this.certificate$ = store.select(newCertificateDialogFeature.selectCertificate);
    this.isSaving$ = store.select(newCertificateDialogFeature.selectIsSaving);
  }

  newCertificate() {
    this.store.dispatch(NewCertificateDialogActions.openNewCertificateDialog());
  }

  editCertificate(certificate: CustomCertificateDto) {
    this.store.dispatch(NewCertificateDialogActions.openEditCertificateDialog({ certificate }));
  }

  saveCertificate(certificate: CustomCertificateDto) {
    this.store.dispatch(NewCertificateDialogActions.saveCertificate({ certificate }));
  }

  uploadImage(image: File, imageDef: CertificateImageDefinition) {
    this.store.dispatch(NewCertificateDialogActions.setImage({ image, imageDef }));
  }
}
