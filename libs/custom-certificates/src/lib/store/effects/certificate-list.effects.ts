import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { CustomCertificatesService } from '../../service/custom-certificates.service';
import { Store } from '@ngrx/store';
import { CertificatesListActions } from '../actions';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { certificatesListFeature } from '../features';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable()
export class CertificateListEffects {
  loadCertificates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificatesListActions.loadCertificates),
      concatLatestFrom(() => this.store.select(certificatesListFeature.selectFilter)),
      switchMap(([_, filter]) =>
        this.certificateService.loadCertificates(filter).pipe(
          map((response) => CertificatesListActions.loadCertificatesSuccess({ response })),
          catchError(() => of(CertificatesListActions.loadCertificatesFailure())),
        ),
      ),
    ),
  );

  loadCertificatesForLearnContent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CertificatesListActions.loadCertificatesForLearnContent),
      switchMap(({ template }) => {
        return this.certificateService.loadCertificates({ template }).pipe(
          map((response) => CertificatesListActions.loadCertificatesSuccess({ response })),
          catchError(() => of(CertificatesListActions.loadCertificatesFailure())),
        );
      }),
    );
  });

  openDialogDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificatesListActions.openDeleteDialog),
      switchMap(({ certificate }) =>
        this.certificateService.openDeleteDialog().pipe(
          filter((value) => value === true),
          map(() => CertificatesListActions.deleteCertificate({ certificate })),
        ),
      ),
    ),
  );

  deleteCertificate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificatesListActions.deleteCertificate),
      switchMap(({ certificate }) =>
        this.certificateService.deleteCertificate(certificate.id).pipe(
          tap({
            next: () => this.messageService.success(marker('CUSTOM_CERTIFICATES.MESSAGES.DELETE.SUCCESS')),
            error: () => this.messageService.success(marker('CUSTOM_CERTIFICATES.MESSAGES.DELETE.FAILURE')),
          }),
          map(() => CertificatesListActions.deleteCertificateSuccess({ id: certificate.id })),
          catchError(() => of(CertificatesListActions.deleteCertificateFailure())),
        ),
      ),
    ),
  );

  toggleDefaultCertificate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificatesListActions.toggleDefaultCertificate),
      switchMap(({ certificate }) =>
        this.certificateService.toggleDefaultCertificate(certificate.id).pipe(
          map(() => CertificatesListActions.toggleDefaultCertificateSuccess()),
          tap({
            next: () => this.displayCertificateToggleSuccessMessage(certificate),
            error: () => this.messageService.success(marker('CUSTOM_CERTIFICATES.MESSAGES.TOGGLE_DEFAULT.FAILURE')),
          }),
          catchError(() => of(CertificatesListActions.toggleDefaultCertificateFailure())),
        ),
      ),
    ),
  );

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
    () =>
      this.actions$.pipe(
        ofType(CertificatesListActions.previewCertificate),
        map(({ certificate }) => this.certificateService.openCertificatePreview(certificate)),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private certificateService: CustomCertificatesService,
    private store: Store,
    private messageService: KpMessageService,
  ) {}

  private displayCertificateToggleSuccessMessage(certificate: CustomCertificateDto) {
    const courses = marker('CUSTOM_CERTIFICATES.MESSAGES.TOGGLE_DEFAULT.COURSES');
    const trails = marker('CUSTOM_CERTIFICATES.MESSAGES.TOGGLE_DEFAULT.TRAILS');
    this.messageService.success(certificate.template === 'mission' ? courses : trails);
  }
}
