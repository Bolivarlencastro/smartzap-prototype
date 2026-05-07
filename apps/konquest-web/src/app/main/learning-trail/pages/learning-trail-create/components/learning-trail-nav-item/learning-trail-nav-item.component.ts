import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-learning-trail-nav-item',
  imports: [CommonModule, MatRippleModule, RouterLink, RouterLinkActive],
  template: `<a
    [routerLink]="disabled ? null : route"
    routerLinkActive="active-item"
    class="flex w-96 py-6 px-9 gap-4 item-container"
    [ngClass]="{
      'text-disabled cursor-default': disabled,
      'cursor-pointer': !disabled,
    }"
    [matRippleDisabled]="disabled"
    matRipple
  >
    <div
      class="w-7 h-7 self-start rounded-full border-2 text-sm flex justify-center items-center font-bold shrink-0 order-counter"
    >
      {{ order }}
    </div>
    <div>
      <h3 data-test="step-title" class="font-bold title">{{ title }}</h3>
      <p>{{ label }}</p>
    </div>
  </a> `,
  styleUrl: './learning-trail-nav-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningTrailNavItemComponent {
  @Input() order!: number;
  @Input() title!: string;
  @Input() label!: string;
  @Input() route!: any[] | string | null;
  @Input() disabled!: boolean;

  @HostBinding('attr.tabindex')
  get tabIndex() {
    return this.disabled ? -1 : 0;
  }

  @HostBinding('class.disabled')
  get isDisabled() {
    return this.disabled;
  }
}
