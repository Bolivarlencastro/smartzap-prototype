import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { KeepsPathLocationStrategy } from './keeps-path-location-strategy';

@Injectable({
  providedIn: 'root',
})
export class KeepsLocation extends Location {
  constructor(private locationStrategy: KeepsPathLocationStrategy) {
    super(locationStrategy);
  }

  /**
   * Custom normalize function that uses the current baseHref value.
   *
   * The default angular Location uses the baseHref defined during the app initialization, but in our case,
   * it can change after the app initialization or be undefined during the init process. Ex.: The user wasn't logged in,
   * another workspace was selected, the current workspace isn't defined in the localStorage, etc.
   */
  override normalize(url: string): string {
    const currentBasePath = stripTrailingSlash(this.locationStrategy.getBaseHref());
    return Location.stripTrailingSlash(stripBasePath(currentBasePath, stripIndexHtml(url)));
  }
}

/**
 * This function was copied to maintain the same functionality as the default Angular Location class.
 *
 * @see [_stripBasePath](https://github.com/angular/angular/blob/f09c5a7bc455a59aea133264cbf9fd9ef7509a7f/packages/common/src/location/location.ts#L307)
 */
function stripBasePath(basePath: string, url: string): string {
  if (!basePath || !url.startsWith(basePath)) {
    return url;
  }
  const strippedUrl = url.substring(basePath.length);
  if (strippedUrl === '' || ['/', ';', '?', '#'].includes(strippedUrl[0])) {
    return strippedUrl;
  }
  return url;
}

/**
 * This function was copied to maintain the same functionality as the default Angular Location class.
 *
 * @see [_stripIndexHtml](https://github.com/angular/angular/blob/f09c5a7bc455a59aea133264cbf9fd9ef7509a7f/packages/common/src/location/location.ts#L318)
 */
function stripIndexHtml(url: string): string {
  return url.replace(/\/index.html$/, '');
}

/**
 * This function was copied to maintain the same functionality as the default Angular Location class.
 *
 * @see [stripTrailingSlash](https://github.com/angular/angular/blob/f09c5a7bc455a59aea133264cbf9fd9ef7509a7f/packages/common/src/location/util.ts#L50)
 */
function stripTrailingSlash(url: string): string {
  const match = url.match(/#|\?|$/);
  const pathEndIdx = (match && match.index) || url.length;
  const droppedSlashIdx = pathEndIdx - (url[pathEndIdx - 1] === '/' ? 1 : 0);
  return url.slice(0, droppedSlashIdx) + url.slice(pathEndIdx);
}
