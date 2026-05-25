import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoPipe } from '@jsverse/transloco';
import { PushTemplate } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { of, startWith, switchMap } from 'rxjs';
import { PmDispatchSummaryComponent } from '../../components/pm-dispatch-summary/pm-dispatch-summary.component';
import { PmTemplatePreviewComponent } from '../../components/pm-template-preview/pm-template-preview.component';
import { ContactsForm, ScheduleForm, TemplateForm } from '../../models/creation';
import { CreationActions, creationFeature } from '../../store';

@Component({
  selector: 'pm-review-step',
  imports: [TranslocoPipe, MatStepperModule, MatButtonModule, PmTemplatePreviewComponent, PmDispatchSummaryComponent],
  template: `
    <div class="review-layout">
      <pm-dispatch-summary
        [templateName]="templateName()"
        [destination]="destination()"
        [contactsCount]="contactsCount()"
        [startDate]="startDate()"
        [estimatedCost]="estimatedCost()"
        [hasSufficientBalance]="hasSufficientBalance()"
      />

      <pm-template-preview
        class="preview-wrapper"
        [title]="'PUSH_MANAGER.CREATION.REVIEW.PREVIEW_TITLE' | transloco"
        [selectedTemplate]="currentTemplate()"
        [variablesFormGroup]="variablesFormGroup()"
      />
    </div>

    <div class="w-full pt-2 flex justify-end gap-1">
      <button matButton matStepperPrevious class="text-xs">{{ 'PUSH_MANAGER.CREATION.GO_BACK' | transloco }}</button>
      <button
        matButton="filled"
        [disabled]="submitting() || validating() || !hasSufficientBalance()"
        (click)="finish()"
        class="text-xs"
      >
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
  scheduleForm = input<FormGroup<ScheduleForm>>();
  contactsForm = input<FormGroup<ContactsForm>>();
  templates = input<PushTemplate[]>();

  private readonly store = inject(Store);
  private readonly vm = toSignal(this.store.select(creationFeature.selectViewModel));

  private readonly templateId = toSignal(
    toObservable(this.templateForm).pipe(
      switchMap(
        (form) => form?.get('templateId')?.valueChanges.pipe(startWith(form?.get('templateId')?.value)) ?? of(null),
      ),
    ),
    { initialValue: null },
  );

  private readonly scheduleValue = toSignal(
    toObservable(this.scheduleForm).pipe(
      switchMap((form) => form?.valueChanges.pipe(startWith(form.getRawValue())) ?? of(null)),
    ),
    { initialValue: null },
  );

  currentTemplate = computed(() => this.templates()?.find((t) => t.id === this.templateId()) ?? null);
  variablesFormGroup = computed(() => this.templateForm()?.get('variables') as FormGroup);

  templateName = computed(() => this.vm()?.validationResult?.template_name ?? '');
  contactsCount = computed(() => this.vm()?.validationResult?.valid_rows ?? 0);
  estimatedCost = computed(() => this.vm()?.validationResult?.estimated_cost ?? '');
  validating = computed(() => this.vm()?.validating ?? false);
  submitting = computed(() => this.vm()?.submitting ?? false);
  hasSufficientBalance = computed(() => this.vm()?.validationResult?.has_sufficient_balance ?? true);

  destination = computed(() => {
    const sv = this.scheduleValue();
    return sv?.courseName || sv?.campaign || '';
  });

  startDate = computed(() => {
    const sv = this.scheduleValue();
    if (!sv?.date || !sv?.hour) {
      return null;
    }

    const [h, m] = sv.hour.split(':').map(Number);
    const d = new Date(sv.date);
    d.setHours(h, m, 0, 0);
    return d;
  });

  finish() {
    const sf = this.scheduleForm()?.getRawValue();
    const tf = this.templateForm()?.getRawValue();
    const cf = this.contactsForm()?.getRawValue();

    if (!sf || !tf || !cf) {
      return;
    }

    const [h, m] = sf.hour.split(':').map(Number);
    const d = new Date(sf.date);
    d.setHours(h, m, 0, 0);

    const pad = (n: number) => String(n).padStart(2, '0');
    const scheduleAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    this.store.dispatch(
      CreationActions.createCampaign({
        params: {
          name: sf.courseName ?? sf.campaign,
          template_id: tf.templateId,
          file: cf.contacts,
          template_variables: JSON.stringify(tf.variables ?? {}),
          scheduled_at: scheduleAt,
        },
      }),
    );
  }
}
