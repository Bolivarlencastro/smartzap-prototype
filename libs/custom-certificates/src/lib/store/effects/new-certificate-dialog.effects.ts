import { Injectable } from '@angular/core';
import { CustomCertificatesService } from '../../service/custom-certificates.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CertificatesListActions, NewCertificateDialogActions } from '../actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { newCertificateDialogFeature } from '../features';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Injectable()
export class NewCertificateDialogEffects {
  openCreationDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        NewCertificateDialogActions.openNewCertificateDialog,
        NewCertificateDialogActions.openEditCertificateDialog,
      ),
      switchMap(() =>
        this.certificatesDialogService
          .openNewCertificateDialog()
          .pipe(map(() => NewCertificateDialogActions.resetState())),
      ),
    );
  });

  dialogClosed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NewCertificateDialogActions.saveCertificateSuccess),
      map(() => NewCertificateDialogActions.resetState()),
    );
  });

  closeDialogAfterSaving$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NewCertificateDialogActions.saveCertificateSuccess),
      map(() => {
        this.certificatesDialogService.closeDialog();
        return CertificatesListActions.loadCertificates();
      }),
    );
  });

  saveCertificate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NewCertificateDialogActions.saveCertificate),
      concatLatestFrom(() => this.store.select(newCertificateDialogFeature.selectCertificate)),
      switchMap(([{ certificate }, currentCertificate]) =>
        this.certificatesDialogService
          .saveCertificate(currentCertificate?.id, { ...currentCertificate, ...certificate })
          .pipe(
            tap({
              next: () => this.messageService.success(marker('CUSTOM_CERTIFICATES.MESSAGES.SAVE.SUCCESS')),
              error: () => this.messageService.error(marker('CUSTOM_CERTIFICATES.MESSAGES.SAVE.FAILURE')),
            }),
            map((certificate) => NewCertificateDialogActions.saveCertificateSuccess({ certificate })),
            catchError(() => of(NewCertificateDialogActions.saveCertificateFailure())),
          ),
      ),
    );
  });

  setImage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NewCertificateDialogActions.setImage),
        map(({ image, imageDef }) => this.certificatesDialogService.setFile(image, imageDef)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private certificatesDialogService: CustomCertificatesService,
    private store: Store,
    private messageService: KpMessageService,
  ) {}
}
