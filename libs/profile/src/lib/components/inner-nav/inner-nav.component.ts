import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { MatDivider } from '@angular/material/divider';
import { NgTemplateOutlet } from '@angular/common';
import { InnerNavItemComponent } from './components/inner-nav-item/inner-nav-item.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-inner-nav',
  templateUrl: './inner-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTabNav,
    MatTabLink,
    RouterLink,
    MatTabNavPanel,
    MatDivider,
    NgTemplateOutlet,
    InnerNavItemComponent,
    TranslocoPipe,
  ],
  styles: [
    `
      .active-bg {
        background-color: var(--mat-sys-inverse-on-surface);
      }
    `,
  ],
})
export class InnerNavComponent {
  @Input() items: any[];
  @Input() title: string;
  @Input() isMobile: boolean;

  constructor(private _router: Router) {}

  isActive(path: string): boolean {
    return this._router.url === `/profile/${path}`;
  }
}
