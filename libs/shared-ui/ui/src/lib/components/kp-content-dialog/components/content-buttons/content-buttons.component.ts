import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentButton } from '../../models';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'kp-content-dialog-buttons',
  templateUrl: 'content-buttons.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, NgClass, MatTooltip, MatIcon, TranslocoPipe],
})
export class KpContentDialogButtonsComponent {
  @Input() buttons!: ContentButton[];
  @Output() contentSelected = new EventEmitter<ContentButton>();

  getTooltip(button: ContentButton): string | null {
    return button.tooltip ? button.tooltip : null;
  }
}
