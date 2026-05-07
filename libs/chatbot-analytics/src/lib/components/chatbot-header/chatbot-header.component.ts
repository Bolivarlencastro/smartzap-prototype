import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'kp-chatbot-header',
  imports: [MatIconButton, MatIconModule, MatDialogClose, TranslocoModule],
  template: `
    <div class="flex justify-between items-center">
      <div class="text-lg">
        {{ 'CHATBOT.HEADER.TITLE' | transloco }}: {{ 'CHATBOT.REPORT_TYPE.' + name() | transloco }}
      </div>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotHeaderComponent {
  name = input<string>();
}
