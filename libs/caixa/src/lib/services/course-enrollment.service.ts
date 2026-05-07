import { Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  CaixaApi,
  CaixaSmartZapUser,
  CaixaSmartZapUserUpdateDto,
  CreateCourseEnrollmentDto,
  KeepsUtils,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { filter, switchMap, tap } from 'rxjs';
import { CourseEnrollmentData, EnrollmentResult } from '../models';
import { CourseEnrollmentDialogComponent } from '../containers/course-enrollment-dialog/course-enrollment-dialog.component';
import {
  EnrollmentResultDialogAction,
  EnrollmentResultDialogComponent,
} from '../components/enrollment-result-dialog/enrollment-result-dialog.component';
import { UserRegistrationService } from './user-registration.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CAIXA_APP_WHATSAPP_URL, SUPPORT_WHATSAPP_URL } from '../common';
import { EnrollmentCancelConfirmDialogComponent } from '../components/enrollment-cancel-confirm-dialog/enrollment-cancel-confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class CourseEnrollmentService {
  private dialogRef: MatDialogRef<CourseEnrollmentDialogComponent>;

  constructor(
    private readonly http: CaixaApi,
    private readonly messageService: KpMessageService,
    private readonly dialog: MatDialog,
    private readonly userRegistrationService: UserRegistrationService,
    @Inject(CAIXA_APP_WHATSAPP_URL) private whatsAppUrl: string,
  ) {}

  openDialog(isLoggedIn: boolean) {
    this.dialogRef = this.dialog.open(CourseEnrollmentDialogComponent, {
      autoFocus: isLoggedIn ? false : 'first-tabbable',
      panelClass: 'enroll-dialog-container',
      backdropClass: 'cx-dialog-overlay',
      disableClose: true,
    });
  }

  openEnrollmentCancelConfirmationDialog() {
    return this.dialog
      .open(EnrollmentCancelConfirmDialogComponent, {
        autoFocus: 'dialog',
        panelClass: 'enroll-dialog-container',
        backdropClass: 'cx-dialog-overlay',
      })
      .afterClosed();
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  redirectToWhatsApp() {
    KeepsUtils.openUrlInNewTab(this.whatsAppUrl);
  }

  redirectToSupportWhatsApp() {
    KeepsUtils.openUrlInNewTab(SUPPORT_WHATSAPP_URL);
  }

  openEnrollmentResultDialog(result: EnrollmentResult) {
    return this.dialog
      .open<EnrollmentResultDialogComponent, EnrollmentResult, EnrollmentResultDialogAction>(
        EnrollmentResultDialogComponent,
        {
          autoFocus: 'dialog',
          panelClass: 'enroll-dialog-container',
          disableClose: true,
          data: result,
        },
      )
      .afterClosed()
      .pipe(filter((action) => !!action));
  }

  cancelUserEnrollmentAndEnrollIntoCourse(userId: string, courseId: string) {
    return this.http
      .cancelUserEnrollment(userId)
      .pipe(switchMap(() => this.enrollToCourse({ user_id: userId, terms_accept: true }, courseId)));
  }

  cancelCurrentUserEnrollment(userId: string) {
    return this.http
      .cancelUserEnrollment(userId)
      .pipe(tap({ next: () => this.messageService.success('Matrícula cancelada com sucesso!') }));
  }

  updateUserAndEnroll(courseEnrollmentData: CourseEnrollmentData, selectedUser: CaixaSmartZapUser, courseId: string) {
    const updateUserDto: CaixaSmartZapUserUpdateDto = {
      name: selectedUser.name,
      phone: courseEnrollmentData.phone,
      partner_convention_number: selectedUser?.related_partner?.convention_number,
    };
    const courseEnrollmentDto: CreateCourseEnrollmentDto = {
      terms_accept: courseEnrollmentData.terms_accept,
      user_id: selectedUser.id,
    };
    const userId = selectedUser.id;
    return this.userRegistrationService
      .updateUser(updateUserDto, userId)
      .pipe(switchMap(() => this.enrollToCourse(courseEnrollmentDto, courseId)));
  }

  private enrollToCourse(courseEnrollmentDto: CreateCourseEnrollmentDto, courseId: string) {
    return this.http.enroll(courseEnrollmentDto, courseId).pipe(
      tap({
        next: () => this.dialogRef.close(),
        error: (error) => this.handleEnrollmentError(error),
      }),
    );
  }

  private handleEnrollmentError(error: unknown) {
    if (error instanceof HttpErrorResponse && error.status === 409) {
      this.dialogRef.close();
      return;
    }

    this.messageService.error('Não foi possível realizar sua matrícula.');
  }
}
