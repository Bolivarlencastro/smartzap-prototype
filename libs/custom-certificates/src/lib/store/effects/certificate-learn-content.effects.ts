import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CustomCertificatesService } from '../../service/custom-certificates.service';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { CertificateLearnContentActions } from '../actions';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { certificatesListFeature } from '../features';

@Injectable()
export class CertificateLearnContentEffects {
  vinculateLearnContent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificateLearnContentActions.vinculateLearnContent),
      switchMap(({ event }) =>
        this.certificatesService.vinculateCertificate(event.certificate.id, event.learnContentId).pipe(
          map(() => {
            this.messageService.success(marker('CUSTOM_CERTIFICATES.MESSAGES.LEARN_CONTENT.VINCULATE_SUCCESS'));
            return CertificateLearnContentActions.vinculateLearnContentSuccess({ certificate: event.certificate });
          }),
          catchError((error) => {
            this.messageService.error(marker('CUSTOM_CERTIFICATES.MESSAGES.LEARN_CONTENT.VINCULATE_ERROR'));
            return of(CertificateLearnContentActions.vinculateLearnContentFailure({ error }));
          }),
        ),
      ),
    ),
  );

  desvinculateLearnContent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificateLearnContentActions.desvinculateLearnContent),
      concatLatestFrom(() => this.store.select(certificatesListFeature.selectLearnContentCertificate)),
      filter(([_, certificate]) => !!certificate),
      switchMap(([{ learnContentId }]) =>
        this.certificatesService.desvinculateCertificate(learnContentId).pipe(
          map(() => {
            this.messageService.success(marker('CUSTOM_CERTIFICATES.MESSAGES.LEARN_CONTENT.DESVINCULATE_SUCCESS'));
            return CertificateLearnContentActions.desvinculateLearnContentSuccess();
          }),
          catchError((error) => {
            this.messageService.error(marker('CUSTOM_CERTIFICATES.MESSAGES.LEARN_CONTENT.DESVINCULATE_ERROR'));
            return of(CertificateLearnContentActions.desvinculateLearnContentFailure({ error }));
          }),
        ),
      ),
    ),
  );

  loadLearnContentCertificate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificateLearnContentActions.loadLearnContentCertificate),
      switchMap(({ learnContentId }) =>
        this.certificatesService.loadLearnContentCertificate(learnContentId).pipe(
          map((certificate) => CertificateLearnContentActions.loadLearnContentCertificateSuccess({ certificate })),
          catchError((error) => of(CertificateLearnContentActions.loadLearnContentCertificateFailure({ error }))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private certificatesService: CustomCertificatesService,
    private messageService: KpMessageService,
    private store: Store,
  ) {}
}
