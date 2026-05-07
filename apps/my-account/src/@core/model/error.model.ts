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

  private getErrorTranlateKey(errorObject): string {
    const message = errorObject.error.detail || 'Unknown Error';

    if (message.includes('Invalid File Type')) {
      return 'API.ERROS.INVALID_FILE_TYPE';
    }

    if (message.includes('Invalid URL')) {
      return 'API.ERROS.INVALID_URL';
    }

    if (message.includes('Invalid Youtube URL')) {
      return 'API.ERROS.INVALID_YOUTUBE_URL';
    }

    if (message.includes('Invalid Vimeo URL')) {
      return 'API.ERROS.INVALID_VIMEO_URL';
    }

    if (message.includes('Invalid Soundcloud URL')) {
      return 'API.ERROS.INVALID_SOUNDCLOUD_URL';
    }

    if (message.includes('Unknown Error')) {
      return 'API.ERROS.UNKNOWN_ERROR';
    }

    return message;
  }
}
