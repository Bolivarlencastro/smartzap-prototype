import { InjectionToken } from '@angular/core';

export interface ProfilePageData {
  title: string;
  subtitle: string;
}

export const PROFILE_CONFIG = new InjectionToken<ProfileConfig>('kp-profile-config');

export interface ProfileConfig {
  keycloak: { url: string; realm: string; clientId: string };
}
