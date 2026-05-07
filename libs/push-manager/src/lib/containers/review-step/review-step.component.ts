import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoPipe } from '@jsverse/transloco';
import { of, startWith, switchMap } from 'rxjs';
import { PmDispatchSummaryComponent } from '../../components/pm-dispatch-summary/pm-dispatch-summary.component';
import { PmTemplatePreviewComponent } from '../../components/pm-template-preview/pm-template-preview.component';
import { TemplateForm } from '../../models/creation';
import { PushTemplate } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'pm-review-step',
  imports: [TranslocoPipe, MatStepperModule, MatButtonModule, PmTemplatePreviewComponent, PmDispatchSummaryComponent],
  template: `
    <div class="review-layout">
      <pm-dispatch-summary />

      <pm-template-preview
        class="preview-wrapper"
        [title]="'PUSH_MANAGER.CREATION.REVIEW.PREVIEW_TITLE' | transloco"
        [selectedTemplate]="currentTemplate()"
        [variablesFormGroup]="variablesFormGroup()"
      />
    </div>

    <div class="w-full pt-2 flex justify-end gap-1">
      <button matButton matStepperPrevious class="text-xs">{{ 'PUSH_MANAGER.CREATION.GO_BACK' | transloco }}</button>
      <button matButton="filled" matStepperNext class="text-xs">
        {{ 'PUSH_MANAGER.CREATION.FINISH' | transloco }}
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        @apply flex flex-col gap-4;
      }

      .review-layout {
        @apply flex flex-col gap-4;

        @media (min-width: 64rem) {
          flex-direction: row;
          align-items: stretch;
          justify-content: center;
        }

        pm-dispatch-summary {
          @apply flex-1;

          @media (min-width: 64rem) {
            max-width: 40rem;
          }
        }

        .preview-wrapper {
          @media (min-width: 64rem) {
            flex-shrink: 0;
            width: 18rem;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStepComponent {
  templateForm = input<FormGroup<TemplateForm>>();
  templates = input<PushTemplate[]>();

  private readonly templateId = toSignal(
    toObservable(this.templateForm).pipe(
      switchMap(
        (form) => form?.get('templateId')?.valueChanges.pipe(startWith(form?.get('templateId')?.value)) ?? of(null),
      ),
    ),
    { initialValue: null },
  );

  currentTemplate = computed(() => this.templates()?.find((t) => t.id === this.templateId()) ?? null);
  variablesFormGroup = computed(() => this.templateForm()?.get('variables') as FormGroup);
}
