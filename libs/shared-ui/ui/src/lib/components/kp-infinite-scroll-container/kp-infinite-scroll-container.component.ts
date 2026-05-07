import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { coerceCssPixelValue } from '@angular/cdk/coercion';

@Component({
  selector: 'kp-infinite-scroll-container',
  imports: [InfiniteScrollDirective],
  templateUrl: './kp-infinite-scroll-container.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpInfiniteScrollContainerComponent {
  @Input() windowScroll = false;
  @Input() scrollThrottle = 250;
  @Input() scrollDistance = 2;

  @Input({ required: true })
  set hostHeight(value: string | number) {
    this.scrollHostHeight = coerceCssPixelValue(value);
  }

  @Output() scrolled = new EventEmitter<void>();

  protected scrollHostHeight: string;

  onScroll() {
    this.scrolled.emit();
  }
}
