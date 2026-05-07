import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-content-management-header',
  imports: [TranslocoPipe],
  template: `
    <div class="flex items-center justify-between px-6 w-full h-20">
      <span class="text-2xl font-semibold">
        {{ 'CONTENT_MANAGEMENT.HEADER.TITLE' | transloco }}
      </span>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class ContentManagementHeaderComponent {}
