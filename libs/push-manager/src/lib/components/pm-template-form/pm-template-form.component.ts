import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { PushTemplateVariables } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'pm-template-form',
  imports: [TranslocoPipe, MatIcon, ReactiveFormsModule, MatFormField, MatLabel, MatInput],
  template: `
    <div class="flex items-center p-4 gap-2 border-b border-default">
      <mat-icon class="text-primary">tune</mat-icon>
      <span class="text-xs opacity-75">{{ 'PUSH_MANAGER.CREATION.TEMPLATE.FORM.TITLE' | transloco }}</span>
    </div>

    @if (templateSelected()) {
      <form [formGroup]="formGroup()" class="h-full w-full overflow-y-auto flex flex-col gap-3 p-4">
        @for (variable of templateVariables(); track variable?.name) {
          <mat-form-field appearance="outline" class="w-full" subscriptSizing="dynamic">
            <mat-label class="text-sm">{{ variable?.name }}</mat-label>
            <input matInput [formControlName]="variable?.name" class="text-sm" />
          </mat-form-field>
        }
      </form>
    } @else {
      <div class="h-full w-full flex flex-col items-center justify-center gap-2 opacity-50 p-3">
        <mat-icon class="s-14">chat_bubble</mat-icon>
        <span class="text-xs font-bold">{{ 'PUSH_MANAGER.CREATION.TEMPLATE.FORM.WAITING_TEMPLATE' | transloco }}</span>
      </div>
    }
  `,
  styles: [
    `
      :host {
        @apply flex flex-col border border-default rounded-xl;

        height: 420px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmTemplateFormComponent {
  templateSelected = input<string>();
  templateVariables = input<PushTemplateVariables[]>([]);
  formGroup = input<FormGroup>();
}
