import { effect, inject, Injectable } from '@angular/core';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import { WorkspaceService } from './workspace.service';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor(
    private _workspaceService: WorkspaceService,
    private _keycloak: Keycloak,
  ) {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      if (keycloakEvent.type === KeycloakEventType.TokenExpired) {
        this._keycloak.updateToken(270000).then(() => console.log('Token updated'));
      }
    });
  }

  logout(): void {
    const redirectUri = this._workspaceService.getCurrentWorkspace()?.logout_url;
    this.clearLocalStorage();
    this._keycloak.logout({ redirectUri }).then();
  }

  get userId(): string | undefined {
    return this._keycloak.tokenParsed?.sub;
  }

  private clearLocalStorage(): void {
    const keysToKeep = new Set(['hideOnboardingTutorial', 'CLASSROOM_THEME']);

    Object.keys(localStorage).forEach((key) => {
      if (!keysToKeep.has(key)) {
        localStorage.removeItem(key);
      }
    });
  }
}
