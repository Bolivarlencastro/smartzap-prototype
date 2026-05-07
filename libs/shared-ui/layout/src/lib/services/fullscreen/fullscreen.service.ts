import { Inject, Injectable, signal, DOCUMENT } from '@angular/core';
import { FSDocument, FSDocumentElement } from '../../components';

@Injectable({ providedIn: 'root' })
export class FullscreenService {
  private _fsDoc: FSDocument;
  private _fsDocEl: FSDocumentElement;
  isFullscreen = signal(false);

  constructor(@Inject(DOCUMENT) private _document: Document) {
    this._initialConfig();
  }

  toggleFullscreen() {
    if (this._isFullscreen()) {
      this._closeFullscreen();
    } else {
      this._openFullscreen();
    }
  }

  private _getBrowserFullscreenElement(): Element | null {
    if (typeof this._fsDoc.fullscreenElement !== 'undefined') {
      return this._fsDoc.fullscreenElement;
    }

    if (typeof this._fsDoc.mozFullScreenElement !== 'undefined') {
      return this._fsDoc.mozFullScreenElement;
    }

    if (typeof this._fsDoc.msFullscreenElement !== 'undefined') {
      return this._fsDoc.msFullscreenElement;
    }

    if (typeof this._fsDoc.webkitFullscreenElement !== 'undefined') {
      return this._fsDoc.webkitFullscreenElement;
    }

    return null;
  }

  private _openFullscreen() {
    if (this._fsDocEl.requestFullscreen) {
      this._fsDocEl.requestFullscreen();
      return;
    }

    // Firefox
    if (this._fsDocEl.mozRequestFullScreen) {
      this._fsDocEl.mozRequestFullScreen();
      return;
    }

    // Chrome, Safari and Opera
    if (this._fsDocEl.webkitRequestFullscreen) {
      this._fsDocEl.webkitRequestFullscreen();
      return;
    }

    // IE/Edge
    if (this._fsDocEl.msRequestFullscreen) {
      this._fsDocEl.msRequestFullscreen();
    }
  }

  private _closeFullscreen() {
    if (this._fsDoc.exitFullscreen) {
      this._fsDoc.exitFullscreen();
      return;
    }

    // Firefox
    if (this._fsDoc.mozCancelFullScreen) {
      this._fsDoc.mozCancelFullScreen();
      return;
    }

    // Chrome, Safari and Opera
    if (this._fsDoc.webkitExitFullscreen) {
      this._fsDoc.webkitExitFullscreen();
    }

    // IE/Edge
    else if (this._fsDoc.msExitFullscreen) {
      this._fsDoc.msExitFullscreen();
    }
  }

  private _initialConfig() {
    this._fsDoc = this._document as FSDocument;
    this._fsDocEl = this._document.documentElement as FSDocumentElement;
    this._document.addEventListener('fullscreenchange', () => this.isFullscreen.set(this._isFullscreen()));
  }

  private _isFullscreen(): boolean {
    return this._getBrowserFullscreenElement() !== null;
  }
}
