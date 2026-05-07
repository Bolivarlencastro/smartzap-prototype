import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class URLService {
  /**
   * Verify if is an soundcoud url.
   *
   * @param url
   */
  isSoundCloudUrl(url: string): boolean {
    if (!url) {
      return false;
    }

    const regex = /http(s)?:\/\/soundcloud\.com/;
    return regex.test(url);
  }

  /**
   * Create a valid sound cloud url player from an url informed via param.
   *
   * @param url
   */
  buildSoundCloudPlayerUrl(url: string): string {
    const isValidUrl = this.isSoundCloudUrl(url);

    if (!isValidUrl) {
      throw new Error('Should inform an SoundCloud URL');
    }

    return 'https://w.soundcloud.com/player/?url=' + url;
  }
}
