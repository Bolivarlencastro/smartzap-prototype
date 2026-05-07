import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-inner-nav-item',
  templateUrl: './inner-nav-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatRipple, RouterLink, RouterLinkActive, TranslocoPipe],
  styles: [
    `
      .active-bg,
      .nav:hover {
        background-color: var(--mat-sys-inverse-on-surface);
      }
    `,
  ],
})
export class InnerNavItemComponent {
  @Input() path!: string;
  @Input() description!: string;
  @Input() title!: string;
  @Input() index!: number;
  @Input() icon!: string;
}
