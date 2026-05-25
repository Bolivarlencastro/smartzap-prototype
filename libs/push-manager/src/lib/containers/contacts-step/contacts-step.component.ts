import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { PmInvalidRowsTableComponent } from '../../components/pm-invalid-rows-table/pm-invalid-rows-table.component';
import { ContactsForm } from '../../models/creation';
import { CreationActions, creationFeature } from '../../store';

@Component({
  selector: 'pm-contacts-step',
  imports: [
    TranslocoPipe,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    PmInvalidRowsTableComponent,
  ],
  host: {
    '(drop)': 'fileDrop($event)',
    '(dragover)': 'onDragOver($event)',
  },
  template: `
    <form [formGroup]="form()" class="mt-1">
      <div class="input-container" (click)="onUploadClick()">
        <div class="input-icon">
          <mat-icon class="s-10">upload</mat-icon>
        </div>
        <span class="text-lg font-bold mb-1">{{ inputTitle() | transloco }}</span>
        <span class="text-xs">{{ 'PUSH_MANAGER.CREATION.CONTACTS.INPUT_DESCRIPTION' | transloco }}</span>
      </div>

      <div class="xls-model">
        <a [href]="templateUrl" download>{{ 'PUSH_MANAGER.CREATION.CONTACTS.DOWNLOAD_TEMPLATE' | transloco }}</a>
      </div>

      @if (invalidRows().length > 0) {
        <pm-invalid-rows-table class="invalid-rows-wrapper" [rows]="invalidRows()" />
      }

      <input hidden type="file" accept=".csv, .xlsx, .xls, text/csv" #fileInput (change)="onFileInputChange()" />

      <div class="w-full pt-5 flex justify-end gap-1">
        <button matButton matStepperPrevious class="text-xs">{{ 'PUSH_MANAGER.CREATION.GO_BACK' | transloco }}</button>
        <button matButton="filled" matStepperNext [disabled]="form()?.invalid" class="text-xs">
          {{ 'PUSH_MANAGER.CREATION.NEXT' | transloco }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .input-container {
        @apply flex flex-col items-center justify-center h-52 rounded-xl border border-default w-full mx-auto cursor-pointer;
        max-width: 48rem;

        .input-icon {
          @apply flex items-center justify-center h-16 w-16 rounded-full mb-2;
          background-color: var(--mat-sys-primary-container);
          color: var(--mat-sys-primary);
        }
      }

      .xls-model {
        @apply underline text-sm mx-auto mt-4 text-end;
        color: var(--mat-sys-primary);
        max-width: 48rem;
      }

      .invalid-rows-wrapper {
        @apply block mx-auto mt-4;
        max-width: 48rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsStepComponent {
  readonly templateUrl = 'https://assets.keepsdev.com/push-campaign/push_modelo_contatos.csv';

  form = model<FormGroup<ContactsForm>>();
  templateId = input<string>();
  templateVariables = input<string>();
  inputTitle = signal<string>('PUSH_MANAGER.CREATION.CONTACTS.INPUT_TITLE');
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  private readonly store = inject(Store);
  private readonly vm = toSignal(this.store.select(creationFeature.selectViewModel));

  invalidRows = computed(() => this.vm()?.validationResult?.invalid_rows_preview ?? []);

  fileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.item(0);

    if (!file) {
      return;
    }

    this.inputTitle.set(file.name);
    this.form()?.get('contacts')?.setValue(file);
    this.dispatchValidation(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onUploadClick() {
    this.fileInput().nativeElement.value = '';
    this.fileInput().nativeElement.click();
  }

  onFileInputChange() {
    const file = this.fileInput().nativeElement.files?.item(0);

    if (!file) {
      return;
    }

    this.inputTitle.set(file.name);
    this.form()?.get('contacts')?.setValue(file);
    this.dispatchValidation(file);
  }

  private dispatchValidation(file: File) {
    const template_id = this.templateId();

    if (!template_id) {
      return;
    }

    const template_variables = this.templateVariables();
    this.store.dispatch(CreationActions.validateCampaign({ template_id, file, template_variables }));
  }
}
