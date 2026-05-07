import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  CaixaApi,
  CaixaSmartZapUserSignUpDto,
  CaixaSmartZapUserUpdateDto,
  PartnerType,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { tap } from 'rxjs';
import { UserRegistrationDialogComponent } from '../containers/user-registration-dialog/user-registration-dialog.component';

@Injectable({ providedIn: 'root' })
export class UserRegistrationService {
  private dialogRef: MatDialogRef<UserRegistrationDialogComponent>;

  constructor(
    private readonly http: CaixaApi,
    private readonly messageService: KpMessageService,
    private readonly dialog: MatDialog,
  ) {}

  openDialog() {
    this.dialogRef = this.dialog.open(UserRegistrationDialogComponent, {
      autoFocus: 'first-tabbable',
      panelClass: 'register-dialog-container',
      backdropClass: 'cx-dialog-overlay',
      disableClose: true,
    });
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  signUpUser(userSignUpDto: CaixaSmartZapUserSignUpDto, courseId?: string) {
    const userDto: CaixaSmartZapUserSignUpDto = { ...userSignUpDto };
    if (courseId) {
      userDto.course_id = courseId;
    }
    return this.http.signUpUser(userDto).pipe(
      tap({
        error: () => this.messageService.error('Erro ao realizar o cadastro.'),
      }),
    );
  }

  updateUser(updateUserDto: CaixaSmartZapUserUpdateDto, userId: string) {
    return this.http.updateUser(updateUserDto, userId);
  }

  searchPartner(search: string, partnerType: PartnerType) {
    return this.http.searchPartner(search, partnerType);
  }
}
