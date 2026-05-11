import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { CertificatesListActions, NewCertificateDialogActions } from '../actions';
import { newCertificateDialogFeature } from '../features';
import { CustomCertificatesService } from '../../services/custom-certificates.service';

@Injectable()
export class NewCertificateDialogEffects {
  openCreationDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        NewCertificateDialogActions.openNewCertificateDialog,
        NewCertificateDialogActions.openEditCertificateDialog,
      ),
      switchMap(() =>
        this.certificatesService.openNewCertificateDialog().pipe(map(() => NewCertificateDialogActions.resetState())),
      ),
    );
  });

  closeDialogAfterSaving$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NewCertificateDialogActions.saveCertificateSuccess),
      map(() => {
        this.certificatesService.closeDialog();
        return CertificatesListActions.loadCertificates();
      }),
    );
  });

  saveCertificate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NewCertificateDialogActions.saveCertificate),
      concatLatestFrom(() => this.store.select(newCertificateDialogFeature.selectCertificate)),
      switchMap(([{ certificate }, currentCertificate]) =>
        this.certificatesService
          .saveCertificate(currentCertificate?.id, { ...currentCertificate, ...certificate })
          .pipe(
            tap({ next: () => this.messageService.success('CUSTOM_CERTIFICATES.MESSAGES.SAVE.SUCCESS') }),
            map((saved) => NewCertificateDialogActions.saveCertificateSuccess({ certificate: saved })),
            catchError(() => {
              this.messageService.error('CUSTOM_CERTIFICATES.MESSAGES.SAVE.FAILURE');
              return of(NewCertificateDialogActions.saveCertificateFailure());
            }),
          ),
      ),
    );
  });

  setImage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NewCertificateDialogActions.setImage),
        map(({ image, imageDef }) => this.certificatesService.setFile(image, imageDef)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly certificatesService: CustomCertificatesService,
    private readonly store: Store,
    private readonly messageService: KpMessageService,
  ) {}
}
