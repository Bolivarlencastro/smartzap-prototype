import { TokensConfigService } from './tokens-config.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AluraIntegrationsApi, IntegrationTokensDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, Observable, of } from 'rxjs';
import { TokensConfigDialogComponent } from '../containers';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

describe('TokensConfigService', () => {
  let service: TokensConfigService;
  let aluraApiMock: jest.Mocked<AluraIntegrationsApi>;
  let dialogMock: jest.Mocked<MatDialog>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let dialogRefMock: jest.Mocked<MatDialogRef<any>>;

  beforeEach(() => {
    aluraApiMock = {
      getWorkspaceTokens: jest.fn().mockReturnValue(of(EMPTY)),
      validateIntegrationToken: jest.fn().mockReturnValue(of(true)),
      saveTokens: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<AluraIntegrationsApi>;
    dialogRefMock = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<any>>;
    dialogMock = { open: jest.fn().mockReturnValue(dialogRefMock) } as unknown as jest.Mocked<MatDialog>;
    messageServiceMock = { success: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    service = new TokensConfigService(aluraApiMock, dialogMock, messageServiceMock);
  });

  it('should open the token configuration dialog', () => {
    service.openTokensConfigDialog();

    expect(dialogMock.open).toHaveBeenCalledWith(TokensConfigDialogComponent, {
      autoFocus: 'dialog',
      width: '390px',
    });
  });

  it('should close the previously open dialog', () => {
    service.openTokensConfigDialog();

    service.closeDialog();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should call getWorkspaceTokens', () => {
    service.loadTokens();

    expect(aluraApiMock.getWorkspaceTokens).toHaveBeenCalled();
  });

  it('should save the integration tokens and display a success message', (done) => {
    const mockTokens = { sso: 'mock_token' } as IntegrationTokensDto;

    service.saveTokens(mockTokens).subscribe(() => {
      expect(aluraApiMock.saveTokens).toHaveBeenCalledWith(mockTokens);
      expect(messageServiceMock.success).toHaveBeenCalledWith('INTEGRATIONS.INTEGRATION_LIST.TOGGLE.ENABLE_SUCCESS');
      done();
    });
  });

  describe('integrationTokenValidator', () => {
    it('should return null if an integration token is valid', (done) => {
      const validationFn = service.integrationTokenValidator('sso');
      const mockToken = 'mock_token';

      const result = validationFn({ value: mockToken } as AbstractControl) as Observable<ValidationErrors | null>;

      result.subscribe((validationErrors) => {
        expect(validationErrors).toBeNull();
        expect(aluraApiMock.validateIntegrationToken).toHaveBeenCalledWith('sso', 'mock_token');
        done();
      });
    });

    it('should return the validation error if an integration token is invalid', (done) => {
      aluraApiMock.validateIntegrationToken.mockReturnValueOnce(of(false));
      const validationFn = service.integrationTokenValidator('sso');
      const mockToken = 'mock_token';

      const result = validationFn({ value: mockToken } as AbstractControl) as Observable<ValidationErrors | null>;

      result.subscribe((validationErrors) => {
        expect(validationErrors).toMatchObject({ invalidToken: true });
        done();
      });
    });
  });
});
