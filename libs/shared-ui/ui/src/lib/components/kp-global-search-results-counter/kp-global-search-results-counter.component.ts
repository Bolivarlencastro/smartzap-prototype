import { Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'kp-global-search-results-counter',
  template: `
    <div class="h-8 flex items-center bg-card pl-4 xxs:pl-5 text-[10px] xxs:text-xs">
      <span>{{ 'UI.GLOBAL_SEARCH.RESULTS' | transloco | uppercase }} ({{ counter }})</span>
    </div>
  `,
  imports: [UpperCasePipe, TranslocoPipe],
})
export class KpGlobalSearchResultsCounterComponent {
  @Input() counter: number;
}
