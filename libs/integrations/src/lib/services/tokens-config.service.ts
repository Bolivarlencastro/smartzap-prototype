import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map, Observable, tap } from 'rxjs';
import { TokensConfigDialogComponent } from '../containers';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  AluraIntegrationsApi,
  IntegrationTokensDto,
  IntegrationTokenType,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable({
  providedIn: 'root',
})
export class TokensConfigService {
  private dialogRef: MatDialogRef<TokensConfigDialogComponent>;

  constructor(
    private aluraIntegrationApi: AluraIntegrationsApi,
    private dialog: MatDialog,
    private messageService: KpMessageService,
  ) {}

  openTokensConfigDialog(): void {
    this.dialogRef = this.dialog.open(TokensConfigDialogComponent, { autoFocus: 'dialog', width: '390px' });
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  loadTokens() {
    return this.aluraIntegrationApi.getWorkspaceTokens();
  }

  saveTokens(tokens: IntegrationTokensDto) {
    return this.aluraIntegrationApi
      .saveTokens(tokens)
      .pipe(
        tap({ next: () => this.messageService.success(marker('INTEGRATIONS.INTEGRATION_LIST.TOGGLE.ENABLE_SUCCESS')) }),
      );
  }

  integrationTokenValidator(tokenType: IntegrationTokenType): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.aluraIntegrationApi
        .validateIntegrationToken(tokenType, control.value)
        .pipe(map((valid) => (valid ? null : { invalidToken: true })));
    };
  }
}
