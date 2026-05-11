import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { newCertificateDialogFeature } from '../store/features';
import { NewCertificateDialogActions } from '../store/actions';
import { CertificateImageDefinition } from '../model';

@Injectable()
export class NewCertificateDialogFacade {
  readonly certificate$: Observable<CustomCertificateDto | undefined>;
  readonly isSaving$: Observable<boolean>;

  constructor(private readonly store: Store) {
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
