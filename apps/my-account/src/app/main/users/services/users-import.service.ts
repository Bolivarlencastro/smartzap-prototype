import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyAccountV2Client, SetUserApplicationRolesDto, UsersApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { UsersImportDialogComponent } from 'app/main/users/containers';
import { tap } from 'rxjs/operators';
import { UserImportErrorCode, UserImportErrorItemDto, UserImportItemDto } from 'app/main/users/user-import-types';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { KeepsError } from '@core/model';

const ERROR_CODE_MESSAGES_MAP: Record<UserImportErrorCode, string> = {
  ANOTHER_IMPORT_IN_PROGRESS: 'USERS.IMPORT_USER_MESSAGES.ANOTHER_IMPORT_IN_PROGRESS',
  FILE_SIZE_EXCEEDED: 'USERS.IMPORT_USER_MESSAGES.FILE_SIZE_EXCEEDED',
  INVALID_CSV_STRUCTURE: 'USERS.IMPORT_USER_MESSAGES.INVALID_CSV_STRUCTURE',
  INVALID_FILE_TYPE: 'USERS.IMPORT_USER_MESSAGES.INVALID_FILE_TYPE',
  MISSING_MANDATORY_COLUMNS: 'USERS.IMPORT_USER_MESSAGES.MISSING_MANDATORY_COLUMNS',
  UNREADABLE_CSV: 'USERS.IMPORT_USER_MESSAGES.UNREADABLE_CSV',
};

const GENERIC_ERROR_MESSAGE = 'USERS.IMPORT_USER_MESSAGES.GENERIC_IMPORT_ERROR';

@Injectable({
  providedIn: 'root',
})
export class UsersImportService {
  constructor(
    private readonly dialog: MatDialog,
    private readonly usersApi: UsersApi,
    private readonly myAccountClient: MyAccountV2Client,
    private readonly messageService: KpMessageService,
  ) {}

  private importFile: File;
  private dialogRef: MatDialogRef<UsersImportDialogComponent>;

  openDialog() {
    this.dialogRef = this.dialog.open(UsersImportDialogComponent, { width: '512px', autoFocus: 'dialog' });
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  setImportFile(file: File) {
    this.importFile = file;
  }

  importUsers(applicationRoles: SetUserApplicationRolesDto[], temporaryPassword: boolean) {
    const rolesIds: string[] = [];

    applicationRoles.forEach((applicationRoles) => {
      rolesIds.push(...applicationRoles.roles);
    });

    return this.usersApi
      .importUsersByFile(this.importFile, rolesIds, temporaryPassword)
      .pipe(tap({ next: () => this.handleImportUsersSuccess(), error: (error) => this.handleImportUsersError(error) }));
  }

  listUserImports() {
    return this.myAccountClient.get<UserImportItemDto[]>('/user-imports');
  }

  listImportErrors(importId: string) {
    return this.myAccountClient.get<UserImportErrorItemDto[]>(`/user-imports/${importId}/errors`);
  }

  private handleImportUsersSuccess() {
    this.messageService.success('USERS.IMPORT_USER_MESSAGES.IMPORT_SUCCESS');
  }

  private handleImportUsersError(error: unknown) {
    if (error instanceof KeepsError) {
      const errorCode = error.error['errorCode'] as UserImportErrorCode;
      const message = ERROR_CODE_MESSAGES_MAP[errorCode] || GENERIC_ERROR_MESSAGE;
      this.messageService.error(message);
      return;
    }
    this.messageService.error(GENERIC_ERROR_MESSAGE);
  }
}
