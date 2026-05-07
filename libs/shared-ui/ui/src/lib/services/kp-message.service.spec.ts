import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { KpMessageService } from './kp-message.service';
import { of } from 'rxjs';
import { KpSnackbarTemplateComponent } from '../components/kp-snackbar-template';

describe('KpMessageService', () => {
  let snackbarMock: jest.Mocked<MatSnackBar>;
  let translateServiceStub: jest.Mocked<TranslocoService>;
  let service: KpMessageService;

  beforeEach(() => {
    snackbarMock = {
      openFromComponent: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    translateServiceStub = {
      selectTranslate: jest.fn().mockImplementation((value) => of(value)),
    } as unknown as jest.Mocked<TranslocoService>;

    service = new KpMessageService(snackbarMock, translateServiceStub);
  });

  it('should display an success message', () => {
    service.success('success message');

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      KpSnackbarTemplateComponent,
      expect.objectContaining({
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        data: 'success message',
        panelClass: 'kp-snackbar-success',
      }),
    );
  });

  it('should display an error message', () => {
    service.error('error message');

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      KpSnackbarTemplateComponent,
      expect.objectContaining({
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        data: 'error message',
        panelClass: 'kp-snackbar-error',
      }),
    );
  });

  it('should display an info message', () => {
    service.info('info message');

    expect(snackbarMock.openFromComponent).toHaveBeenCalledWith(
      KpSnackbarTemplateComponent,
      expect.objectContaining({
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        data: 'info message',
        panelClass: 'kp-snackbar-info',
      }),
    );
  });
});
