import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { PushTemplate } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'pm-template-preview',
  imports: [TranslocoPipe, MatIcon],
  template: `
    <span class="text-xs opacity-75">{{ title() }}</span>

    @if (selectedTemplate()) {
      <div class="content">
        <div class="notification">
          <div class="wa-icon">W</div>
          <div class="flex flex-col">
            <span class="text-2xxs font-bold">WhatsApp Business</span>
            <span class="text-2xxs opacity-65">Online</span>
          </div>
        </div>

        <div class="message" [innerHTML]="processedContent()"></div>
      </div>
    } @else {
      <div class="default-content">
        <mat-icon class="s-14">mobile_chat</mat-icon>
        <span class="text-xs font-bold">{{
          'PUSH_MANAGER.CREATION.TEMPLATE.PREVIEW.NO_CONTENT_MESSAGE' | transloco
        }}</span>
      </div>
    }
  `,
  styles: [
    `
      :host {
        @apply flex flex-col gap-3;
        height: 420px;
      }

      .content {
        @apply h-full w-full rounded-xl flex flex-col gap-3 p-3 shadow-inner overflow-y-auto;
        background-color: #e5ddd5;

        .notification {
          @apply p-2.5 flex items-center gap-3 rounded-xl;
          background-color: #f2eeea;

          .wa-icon {
            @apply w-10 h-10 rounded-full flex items-center justify-center font-bold;

            color: white;
            background-color: #25d366;
          }
        }

        .message {
          @apply rounded-xl rounded-tl-none p-3.5 text-xs;

          background-color: white;
          max-width: 90%;
        }
      }

      .default-content {
        @apply h-full w-full rounded-xl flex flex-col items-center justify-center gap-2 opacity-50 p-3;
        border: 3px dashed var(--mat-sys-outline-variant);
        background-color: var(--mat-sys-inverse-on-surface);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmTemplatePreviewComponent implements OnInit {
  title = input<string>();
  selectedTemplate = input<PushTemplate>();
  variablesFormGroup = input<FormGroup>();

  processedContent = signal<string>('');

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => this.processContent());
  }

  ngOnInit() {
    this.initListeners();
  }

  private initListeners() {
    this.variablesFormGroup()
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.processContent());
  }

  private processContent() {
    const template = this.selectedTemplate();
    if (!template) {
      return;
    }

    const formGroup = this.variablesFormGroup();
    let content = template?.body_preview;

    for (const variable of template?.variables ?? []) {
      const value = formGroup?.get(variable?.name)?.value || `{{${variable?.name}}}`;
      const regex = new RegExp(`\\{\\{${variable?.name}\\}\\}`, 'g');
      content = content.replace(regex, this.escapeHtml(value));
    }

    content = content.replace(/\n/g, '<br>');
    this.processedContent.set(content);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
