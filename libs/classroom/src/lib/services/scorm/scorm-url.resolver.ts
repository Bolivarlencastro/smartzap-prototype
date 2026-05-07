import { inject, Injectable, isDevMode } from '@angular/core';
import { APPLICATION_DOMAIN } from '@keeps-platform-frontend-workspace/kp-keeps';

/**
 * Regex to identify the SCORM content URL.
 */
const SCORM_CONTENT_URL = /^.*\/scorm\/([^/]+)\/(.*)$/;
const SCORM_V2_CONTENT_URL = /^.*\/clients\/(.*)\/scorm\/([^/]+\/.*)$/;

@Injectable()
export class ScormUrlResolver {
  private readonly applicationDomain = inject(APPLICATION_DOMAIN);

  /**
   * Returns the updated SCORM content URL.
   * When running in stage or production, replaces the Kontent bucket url with the application domain allowing the SCORM API to access global windows object.
   *
   * When running the application locally, we are loading the SCORM contents from another domain.
   * In the browser this causes a CORS error because the content is in a different domain from the application.
   * Additionally, the SCORM is loaded in an iframe, which needs to be in the same domain as the application to access its global API.
   *
   * To get around this issue, we use the Angular's development server proxy to proxy the SCORM contents to the application
   * domain, avoid the CORS erros and allowing access to the API.
   *
   * - Firstly, update the `useScormProxy` variable below to `true`; this enables the update of the content url to a value that will be intercepted by the proxy.
   *
   * - To enable the proxy in the development server, open the `project.json` file of the application
   * and add the `proxyConfig` option pointing to the `scorm-proxy.config.json` file in the `serve` target:
   *
   * ```JSON
   * "serve": {
   *   "executor": "@nx/angular:dev-server",
   *   "options": {
   *     "proxyConfig": "apps/konquest-web/scorm-proxy.config.json"
   *   },
   * }
   * ```
   */
  resolveUrl(url: string, useScormProxy = false) {
    const isProd = !isDevMode();

    // If running in prod or not locally, return the original URL
    if (isProd || !useScormProxy) {
      return url.replace('contents', `konquest`);
    }

    return this.resolveLocalUrl(url);
  }

  private resolveLocalUrl(url: string) {
    if (SCORM_V2_CONTENT_URL.test(url)) {
      return url.replace(SCORM_V2_CONTENT_URL, `/scorm-proxy-v2/$1/scorm/$2`);
    }

    return url.replace(SCORM_CONTENT_URL, '/scorm-proxy/$1/$2');
  }
}
