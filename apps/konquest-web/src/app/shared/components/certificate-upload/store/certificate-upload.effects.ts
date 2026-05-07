import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CertificateUploadService } from '../certificate-upload.service';
import * as CertificateUploadActions from './certificate-upload.actions';
import { certificateUploadFeature } from './certificate-upload.feature';

@Injectable()
export class CertificateUploadEffects {
  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CertificateUploadActions.openDialog),
        map(() => this._certificateUploadService.openDialog()),
      );
    },
    { dispatch: false },
  );

  uploadCertificate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CertificateUploadActions.uploadCertificate),
      concatLatestFrom(() => [this.store.select(certificateUploadFeature.selectEnrollmentId)]),
      switchMap(([{ certificate }, enrollmentId]) =>
        this._certificateUploadService.submitCertificate(enrollmentId, certificate).pipe(
          map(() => CertificateUploadActions.uploadCertificateSuccess()),
          catchError(() => of(CertificateUploadActions.uploadCertificateFailure())),
        ),
      ),
    );
  });

  uploadCertificateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CertificateUploadActions.uploadCertificateSuccess),
      tap(() => this._certificateUploadService.closeDialog()),
      map(() => CertificateUploadActions.resetState()),
    );
  });

  loadCertificateHistory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CertificateUploadActions.openDialog),
      concatLatestFrom(() => this.store.select(certificateUploadFeature.selectEnrollmentId)),
      switchMap(([_, enrollmentId]) =>
        this._certificateUploadService.loadCertificateHistory(enrollmentId).pipe(
          map((history) => CertificateUploadActions.loadCertificateHistorySuccess({ history })),
          catchError(() => of(CertificateUploadActions.loadCertificateHistoryFailure())),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    private _certificateUploadService: CertificateUploadService,
  ) {}
}
