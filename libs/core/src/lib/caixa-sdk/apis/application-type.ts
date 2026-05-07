import { InjectionToken } from '@angular/core';

export enum CAIXA_APPLICATION_TYPE {
  AGENCIES = 'AGENCIES',
  PARTNERS = 'PARTNERS',
}

export const APPLICATION_TYPE = new InjectionToken<CAIXA_APPLICATION_TYPE>('caixa-app-type');
