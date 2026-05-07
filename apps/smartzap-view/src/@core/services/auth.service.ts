import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token: string;
  private _userId: string;
  private _clientId: string;
  private _jwtHelperService = new JwtHelperService();

  enablePrototypeSession(): void {
    this._token = 'prototype-token';
    this._userId = 'prototype-user';
    this._clientId = 'smartzap-prototype';
  }

  authenticate(token: string): void {
    let tokenDecoded: any;

    try {
      tokenDecoded = this._jwtHelperService.decodeToken(token);
    } catch (_error) {
      return;
    }

    if (!tokenDecoded || this._jwtHelperService.isTokenExpired(token)) {
      return;
    }

    this._token = token;
    this._userId = tokenDecoded.sub;
    this._clientId = tokenDecoded['x-client'];
  }

  isAuthenticated() {
    return !!this._token;
  }

  getToken(): string {
    return this._token;
  }

  get userId(): string {
    return this._userId;
  }

  get clientId(): string {
    return this._clientId;
  }
}
