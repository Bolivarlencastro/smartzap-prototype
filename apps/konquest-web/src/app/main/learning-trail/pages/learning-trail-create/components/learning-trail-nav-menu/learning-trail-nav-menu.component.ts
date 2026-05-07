import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { getLearningTrailNavItems } from './learning-trail-nav-item';
import { LearningTrailNavItemComponent } from '../learning-trail-nav-item/learning-trail-nav-item.component';

@Component({
  selector: 'app-learning-trail-nav-menu',
  imports: [TranslocoModule, LearningTrailNavItemComponent],
  template: `<div class="w-96">
    <nav>
      @for (item of navItems; track item; let i = $index) {
        <app-learning-trail-nav-item
          [order]="i + 1"
          [title]="item.title | transloco"
          [label]="item.label | transloco"
          [route]="item.route"
          [disabled]="i > 0 && !learningTrailDefined"
        ></app-learning-trail-nav-item>
      }
    </nav>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningTrailNavMenuComponent {
  navItems = getLearningTrailNavItems();
  @Input() learningTrailDefined = false;
}
