import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { CheckInService } from './check-in.service';
import { SessionData } from '../models/session-data';
import { SupportMaterialsService } from './support-materials.service';

@Injectable({ providedIn: 'root' })
export class InitService {
  constructor(
    private readonly keycloak: Keycloak,
    private readonly checkInService: CheckInService,
    private readonly supportMaterialsService: SupportMaterialsService,
  ) {}

  async init(): Promise<void> {
    try {
      await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        pkceMethod: 'S256',
      });

      if (!this.keycloak.authenticated) {
        this.redirectToLogin();
        return;
      }

      const urlData = this.getDataFromUrl();
      if (!urlData) {
        return;
      }

      const sessionData: SessionData = { ...urlData, user: this.keycloak.idTokenParsed?.sub };
      this.checkInService.setSessionData(sessionData);
      this.checkInService.autoCheckIn(sessionData.dateId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private redirectToLogin() {
    this.keycloak.login().then();
  }

  private getDataFromUrl(): Omit<SessionData, 'user'> | undefined {
    const path = window.location.href;
    const dataRegex = new RegExp(/\/([^/]+)$/gm);
    const base64Data = dataRegex.exec(path)?.at(0)?.replace(/\//gm, '');

    if (!base64Data) {
      console.warn('No data found in URL');
      return undefined;
    }

    let encodedData: string;
    try {
      encodedData = atob(base64Data);
    } catch (error) {
      console.warn('Error decoding base64 string:', error);
      return undefined;
    }

    let decodedData: string;
    try {
      decodedData = decodeURIComponent(encodedData);
    } catch (error) {
      console.warn('Error decoding URI string:', error);
      return undefined;
    }

    try {
      return JSON.parse(decodedData);
    } catch (error) {
      console.warn('Error parsing JSON string:', error);
      return undefined;
    }
  }
}
