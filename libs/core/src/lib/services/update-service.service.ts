import {
  DestroyRef,
  EnvironmentProviders,
  inject,
  Injectable,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserProfileService } from './user-profile.service';
import { LanguageTypes } from '../my-account-sdk';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';

export const provideUpdates = (): EnvironmentProviders => {
  return makeEnvironmentProviders([UpdateService, provideEnvironmentInitializer(() => inject(UpdateService))]);
};

type UpdateMessage = { message: string; cta: string };
const TRANSLATIONS: Record<LanguageTypes, UpdateMessage> = {
  en: { message: 'A new version is ready to use!', cta: 'Reload' },
  es: { message: 'Una nueva versión está lista para uso!', cta: 'Recargar' },
  'pt-BR': { message: 'Uma nova versão está pronta para uso!', cta: 'Recarregar' },
  'pt-PT': { message: 'Uma nova versão está pronta para uso!', cta: 'Recarregar' },
};

@Injectable()
class UpdateService {
  private updates = inject(SwUpdate);
  private destroyRef = inject(DestroyRef);
  private snackbar = inject(MatSnackBar);
  private userService = inject(UserProfileService);

  constructor() {
    if (!this.updates.isEnabled) {
      return;
    }

    this.registerUpdatesWatcher();
  }

  private registerUpdatesWatcher() {
    this.updates.versionUpdates.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      switch (event.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${event.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${event.currentVersion.hash}`);
          console.log(`New app version ready for use: ${event.latestVersion.hash}`);
          this.displayUpdateReadyMessage();
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${event.version.hash}': ${event.error}`);
          break;
      }
    });
  }

  private displayUpdateReadyMessage() {
    const userLanguage = this.userService.getUserLocale();
    const message = TRANSLATIONS[userLanguage];
    console.log('Displaying update ready message...');
    this.snackbar
      .open(message.message, message.cta, { duration: 60 * 1000, panelClass: 'kp-snackbar-success' })
      .onAction()
      .pipe(take(1))
      .subscribe(() => {
        console.log('Reloading the page...');
        window.location.reload();
      });
  }
}
