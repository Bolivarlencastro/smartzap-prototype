import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

declare const SwaggerUIBundle: any;
declare const SwaggerUIStandalonePreset: any;
import { swaggerData } from './swagger-api.data';

@Component({
  standalone: true,
  selector: 'kp-swagger-root',
  template: ` <div #swagger></div> `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('swagger') swaggerDom: ElementRef<HTMLDivElement> | undefined;

  ngAfterViewInit() {
    SwaggerUIBundle({
      urls: swaggerData,
      domNode: this.swaggerDom?.nativeElement,
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout',
    });
  }
}
