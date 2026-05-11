import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CertificatesListActions } from '../actions';
import { certificatesListFeature } from '../features';
import { CustomCertificatesService } from '../../services/custom-certificates.service';

@Injectable()
export class CertificateListEffects {
  loadCertificates$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CertificatesListActions.loadCertificates),
      concatLatestFrom(() => this.store.select(certificatesListFeature.selectFilter)),
      switchMap(([, filter]) =>
        this.certificateService.loadCertificates(filter).pipe(
          map((response) => CertificatesListActions.loadCertificatesSuccess({ response })),
          catchError(() => of(CertificatesListActions.loadCertificatesFailure())),
        ),
      ),
    );
  });

  openDialogDelete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CertificatesListActions.openDeleteDialog),
      switchMap(({ certificate }) =>
        this.certificateService.openDeleteDialog().pipe(
          filter((value) => value === true),
          map(() => CertificatesListActions.deleteCertificate({ certificate })),
        ),
      ),
    );
  });

  deleteCertificate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CertificatesListActions.deleteCertificate),
      switchMap(({ certificate }) =>
        this.certificateService.deleteCertificate(certificate.id).pipe(
          tap({ next: () => this.messageService.success('CUSTOM_CERTIFICATES.MESSAGES.DELETE.SUCCESS') }),
          map(() => CertificatesListActions.deleteCertificateSuccess({ id: certificate.id })),
          catchError(() => {
            this.messageService.error('CUSTOM_CERTIFICATES.MESSAGES.DELETE.FAILURE');
            return of(CertificatesListActions.deleteCertificateFailure());
          }),
        ),
      ),
    );
  });

  toggleDefaultCertificate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CertificatesListActions.toggleDefaultCertificate),
      switchMap(({ certificate }) =>
        this.certificateService.toggleDefaultCertificate(certificate.id).pipe(
          tap({ next: () => this.displayToggleSuccessMessage(certificate) }),
          map(() => CertificatesListActions.toggleDefaultCertificateSuccess()),
          catchError(() => {
            this.messageService.error('CUSTOM_CERTIFICATES.MESSAGES.TOGGLE_DEFAULT.FAILURE');
            return of(CertificatesListActions.toggleDefaultCertificateFailure());
          }),
        ),
      ),
    );
  });

  reload$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        CertificatesListActions.search,
        CertificatesListActions.setPagination,
        CertificatesListActions.toggleDefaultCertificateSuccess,
        CertificatesListActions.deleteCertificateSuccess,
      ),
      map(() => CertificatesListActions.loadCertificates()),
    );
  });

  openPreviewDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CertificatesListActions.previewCertificate),
        map(({ certificate }) => this.certificateService.openCertificatePreview(certificate)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly certificateService: CustomCertificatesService,
    private readonly store: Store,
    private readonly messageService: KpMessageService,
  ) {}

  private displayToggleSuccessMessage(_certificate: CustomCertificateDto) {
    this.messageService.success('CUSTOM_CERTIFICATES.MESSAGES.TOGGLE_DEFAULT.COURSES');
  }
}
