import { ChangeDetectionStrategy, Component, computed, effect, input, model, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoPipe } from '@jsverse/transloco';
import { PushTemplate } from '@keeps-platform-frontend-workspace/kp-keeps';
import { PmTemplateFormComponent } from '../../components/pm-template-form/pm-template-form.component';
import { PmTemplateModelComponent } from '../../components/pm-template-model/pm-template-model.component';
import { PmTemplatePreviewComponent } from '../../components/pm-template-preview/pm-template-preview.component';
import { TemplateForm } from '../../models/creation';

@Component({
  selector: 'pm-template-step',
  imports: [
    TranslocoPipe,
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,
    PmTemplateModelComponent,
    PmTemplateFormComponent,
    PmTemplatePreviewComponent,
  ],
  template: `
    <form [formGroup]="form()" class="mt-1">
      <div class="container">
        <pm-template-model
          [templates]="templates()"
          [templateSelected]="selectedTemplateId()"
          (selectTemplate)="onSelectTemplate($event)"
        />

        <pm-template-form
          [templateSelected]="selectedTemplateId()"
          [templateVariables]="selectedTemplateVariables()"
          [formGroup]="variablesFormGroup()"
        />

        <pm-template-preview
          [title]="'PUSH_MANAGER.CREATION.TEMPLATE.PREVIEW.TITLE' | transloco"
          [selectedTemplate]="currentTemplate()"
          [variablesFormGroup]="variablesFormGroup()"
        />
      </div>

      <div class="w-full pt-3 flex justify-end">
        <button matButton="filled" matStepperNext [disabled]="form()?.invalid" class="text-xs">
          {{ 'PUSH_MANAGER.CREATION.NEXT' | transloco }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateStepComponent {
  form = model<FormGroup<TemplateForm>>();
  templates = input<PushTemplate[]>();

  selectedTemplateId = signal<string>(null);
  selectedTemplateVariables = computed(() => {
    const selectedId = this.selectedTemplateId();
    const template = this.templates()?.find((t) => t.id === selectedId);
    return template?.variables || [];
  });
  variablesFormGroup = computed(() => {
    return this.form()?.get('variables') as FormGroup;
  });
  currentTemplate = computed(() => {
    const selectedId = this.selectedTemplateId();
    return this.templates()?.find((t) => t.id === selectedId) || null;
  });

  constructor() {
    this.updateVariablesControls();
  }

  onSelectTemplate(id: string) {
    this.form().patchValue({ templateId: id });
    this.selectedTemplateId.set(id);
  }

  private updateVariablesControls() {
    effect(() => {
      const variables = this.currentTemplate()?.variables;
      const variablesGroup = this.form().get('variables') as FormGroup;
      Object.keys(variablesGroup.controls).forEach((key) => {
        variablesGroup.removeControl(key);
      });
      variables?.forEach((variable) => {
        variablesGroup.addControl(variable.name, new FormControl(null, variable?.required ? Validators.required : []));
      });
      variablesGroup.updateValueAndValidity();
      this.form().updateValueAndValidity();
    });
  }
}
