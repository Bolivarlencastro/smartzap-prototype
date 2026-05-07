import { ChangeDetectionStrategy, Component, ElementRef, HostListener, model, signal, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContactsForm } from '../../models/creation';

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
  ],
  template: `
    <form [formGroup]="form()" class="mt-1">
      <div class="input-container" (click)="onUploadClick()">
        <div class="input-icon">
          <mat-icon class="s-10">upload</mat-icon>
        </div>
        <span class="text-lg font-bold mb-1">{{ inputTitle() | transloco }}</span>
        <span class="text-xs">{{ 'PUSH_MANAGER.CREATION.CONTACTS.INPUT_DESCRIPTION' | transloco }}</span>
      </div>

      <input hidden type="file" accept=".csv, .xlsx, .xls, text/csv" #fileInput (change)="onFileInputChange()" />

      <div class="w-full pt-2 flex justify-end gap-1">
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsStepComponent {
  form = model<FormGroup<ContactsForm>>();
  inputTitle = signal<string>('PUSH_MANAGER.CREATION.CONTACTS.INPUT_TITLE');
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  @HostListener('drop', ['$event'])
  fileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.item(0);

    if (!file) {
      return;
    }

    this.inputTitle.set(file.name);
    this.form()?.get('contacts')?.setValue(file);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onUploadClick() {
    this.fileInput().nativeElement.click();
  }

  onFileInputChange() {
    const file = this.fileInput().nativeElement.files?.item(0);

    if (!file) {
      return;
    }

    this.inputTitle.set(file.name);
    this.form()?.get('contacts')?.setValue(file);
  }
}
