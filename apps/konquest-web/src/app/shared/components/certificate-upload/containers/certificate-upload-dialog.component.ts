import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CertificateUploadActions, certificateUploadFeature } from '../store';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CertificateUploadFormComponent } from '../components/certificate-upload-form/certificate-upload-form.component';
import { CertificateHistoryComponent } from '../components/certificate-history/certificate-history.component';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-certificate-upload-dialog',
  template: `
    <div class="flex justify-between" mat-dialog-title>
      <span class="text-lg">{{ 'MISSION.DETAIL.SUBMIT_CERTIFICATE' | transloco }}</span>
      <button mat-icon-button mat-dialog-close [attr.aria-label]="'GENERAL.CLOSE' | transloco">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <div mat-dialog-content class="flex flex-col">
      <app-certificate-upload-form #uploadForm></app-certificate-upload-form>
      <app-certificate-history [history]="history$ | async"></app-certificate-history>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-stroked-button id="button-mission-detail-dialog-cancel" mat-dialog-close>
        {{ 'GENERAL.CANCEL' | transloco }}
      </button>
      <button
        mat-flat-button
        color="primary"
        id="button-mission-detail-dialog-start"
        [disabled]="!uploadForm.selectedFile || (uploadDisabled$ | async)"
        (click)="submit(uploadForm.selectedFile)"
      >
        {{ 'GENERAL.SUBMIT' | transloco }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatIconButton,
    MatDialogClose,
    MatIcon,
    CdkScrollable,
    MatDialogContent,
    CertificateUploadFormComponent,
    CertificateHistoryComponent,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class CertificateUploadDialogComponent {
  protected readonly history$: Observable<string>;
  protected readonly uploadDisabled$: Observable<boolean>;

  constructor(private store: Store) {
    this.history$ = store.select(certificateUploadFeature.selectCertificateHistory);
    this.uploadDisabled$ = store.select(certificateUploadFeature.selectUploadDisabled);
  }

  submit(certificate: File): void {
    this.store.dispatch(CertificateUploadActions.uploadCertificate({ certificate }));
  }
}
