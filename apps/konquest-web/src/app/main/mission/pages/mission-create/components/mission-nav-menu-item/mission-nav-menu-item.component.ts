import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatRipple } from '@angular/material/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-mission-nav-menu-item',
  templateUrl: './mission-nav-menu-item.component.html',
  styleUrls: ['./mission-nav-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLinkActive, MatRipple, RouterLink, NgClass],
})
export class MissionNavMenuItemComponent {
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
