import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  HostListener,
  Input,
  QueryList,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { KpSpeedDialOptionComponent } from './kp-speed-dial-option.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'kp-speed-dial',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './kp-speed-dial.component.html',
  animations: [
    trigger('fadeInOut', [
      state(
        '0, void',
        style({
          opacity: 0,
        }),
      ),
      state(
        '1, *',
        style({
          opacity: 1,
        }),
      ),
      transition('1 => 0', animate('150ms ease-out')),
      transition('0 => 1', animate('150ms ease-in')),
      transition('void <=> *', animate('150ms ease-in')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpSpeedDialComponent {
  @Input() icon = 'more_vert';
  @ContentChildren(KpSpeedDialOptionComponent) options: QueryList<KpSpeedDialOptionComponent>;
  protected isOpen = false;

  @HostBinding('attr.tabindex')
  get tabIndex() {
    return 0;
  }

  get speedDialOpen() {
    return this.isOpen;
  }

  @HostListener('focusin')
  @HostListener('focus')
  @HostListener('mouseenter')
  open() {
    this.isOpen = true;
  }

  @HostListener('mouseleave')
  close() {
    this.isOpen = false;
  }

  @HostListener('focusout', ['$event'])
  @HostListener('blur', ['$event'])
  focusLost(event: FocusEvent) {
    if (!this.isChildren(event.relatedTarget as HTMLElement)) {
      this.close();
    }
  }

  onAnchorClick(event: MouseEvent) {
    event.stopPropagation();
  }

  private isChildren(element: HTMLElement) {
    return element?.classList?.contains('kp-speed-dial-option');
  }
}
