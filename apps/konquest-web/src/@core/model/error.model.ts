import { HttpErrorResponse } from '@angular/common/http';

export class KeepsError extends HttpErrorResponse {
  private _customMessage: string;

  constructor(errorResponse: HttpErrorResponse) {
    super(errorResponse);
    this._customMessage = this.getErrorTranlateKey(errorResponse);
  }

  get customMessage(): string {
    return this._customMessage;
  }

  private getErrorTranlateKey(error: any): string {
    if (error?.error?.i18n) {
      return 'API.ERRORS.' + error.error.i18n.toUpperCase();
    }

    return error.message;
  }
}
