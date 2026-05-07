import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { take } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { KpSnackbarTemplateComponent } from '../components/kp-snackbar-template';

const DEFAULT_SNACKBAR_DURATION = 5 * 1000;
const ERROR_SNACKBAR_DURATION = 10 * 1000;

const DEFAULT_SNACKBAR_CONFIG: MatSnackBarConfig<string> = {
  verticalPosition: 'bottom',
  horizontalPosition: 'center',
};

type KpSnackbarType = 'success' | 'error' | 'info';

@Injectable({ providedIn: 'root' })
export class KpMessageService {
  constructor(
    private matSnackbar: MatSnackBar,
    private _translateService: TranslocoService,
  ) {}

  success(message: string, interpolateParams?: Record<string, string>): void {
    this.openSnackbar(message, 'success', interpolateParams);
  }

  error(message: string, interpolateParams?: Record<string, string>): void {
    if (!message) {
      return;
    }

    this.openSnackbar(message, 'error', interpolateParams, ERROR_SNACKBAR_DURATION);
  }

  info(message: string, interpolateParams?: Record<string, string>) {
    this.openSnackbar(message, 'info', interpolateParams);
  }

  private openSnackbar(
    message: string,
    type: KpSnackbarType,
    interpolateParams?: Record<string, string>,
    duration = DEFAULT_SNACKBAR_DURATION,
  ) {
    this._translateService
      .selectTranslate(message, interpolateParams)
      .pipe(take(1))
      .subscribe((translatedMessage) => {
        const snackbarConfig: MatSnackBarConfig<string> = {
          ...DEFAULT_SNACKBAR_CONFIG,
          duration,
          data: translatedMessage,
          panelClass: `kp-snackbar-${type}`,
        };

        this.matSnackbar.openFromComponent(KpSnackbarTemplateComponent, snackbarConfig);
      });
  }
}
