import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { WHATSAPP_FORMATS } from './kp-whatsapp-markdown-helper.model';

@Component({
  selector: 'kp-whatsapp-markdown-helper',
  templateUrl: './kp-whatsapp-markdown-helper.component.html',
  styleUrl: './kp-whatsapp-markdown-helper.component.scss',
  imports: [TranslocoPipe, MatIcon, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpWhatsAppMarkdownHelperComponent {
  protected isExpanded = signal(false);
  protected readonly formats = WHATSAPP_FORMATS;

  protected toggle(): void {
    this.isExpanded.update((v) => !v);
  }
}
