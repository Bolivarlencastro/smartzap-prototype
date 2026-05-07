import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { PushTemplate } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'pm-template-model',
  imports: [TranslocoPipe, NgClass],
  template: `
    <div class="flex items-center justify-between p-4 border-b border-default">
      <span class="text-xs opacity-75">{{ 'PUSH_MANAGER.CREATION.TEMPLATE.MODEL.SELECT_MODEL' | transloco }}</span>
      <div class="count">{{ count() }}</div>
    </div>
    <div class="h-full w-full overflow-y-auto flex flex-col gap-0.25">
      @for (template of templates(); track template.id) {
        <div
          class="template"
          (click)="onSelectTemplate(template.id)"
          [ngClass]="{ selected: template.id === templateSelected() }"
        >
          <span class="font-bold text-2xxs">{{ template.title }}</span>
          <div class="text-2xxs opacity-75 break-words line-clamp-2" [innerHTML]="template?.body_preview"></div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        @apply flex flex-col border border-default rounded-xl;

        height: 420px;
      }

      .count {
        @apply rounded-full text-xs h-5 w-5 flex items-center justify-center font-bold;

        background-color: var(--mat-sys-primary-container);
        color: var(--mat-sys-primary);
      }

      .template {
        @apply m-2 p-3 flex flex-col gap-1 cursor-pointer rounded-xl;
      }

      .template:hover,
      .selected {
        background-color: var(--mat-sys-surface-container);
      }

      .selected {
        border: 1px solid var(--mat-sys-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmTemplateModelComponent {
  templates = input<PushTemplate[]>();
  templateSelected = input<string>();
  count = computed(() => this.templates()?.length);
  selectTemplate = output<string>();

  onSelectTemplate(id: string) {
    this.selectTemplate.emit(id);
  }
}
