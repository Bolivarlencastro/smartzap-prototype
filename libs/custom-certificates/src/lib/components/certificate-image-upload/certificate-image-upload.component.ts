import { ChangeDetectionStrategy, Component, ElementRef, input, model, output, signal, ViewChild } from '@angular/core';

import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { CUSTOM_CERTIFICATE_DEFAULT_IMAGES } from '../../certificate-constants';

@Component({
  selector: 'kp-certificate-image-upload',
  imports: [MatFormField, MatLabel, MatHint, MatInput, TranslocoPipe, MatSuffix, MatIcon, MatTooltip, MatIconButton],
  template: `
    <mat-form-field appearance="outline" class="w-full cursor-pointer" (click)="openFileSelection()">
      <mat-label>{{ label() }}</mat-label>
      <input
        matInput
        readonly
        [placeholder]="'CUSTOM_CERTIFICATES.CREATE_FORM.SELECT_IMAGE' | transloco"
        [value]="fileName()"
        class="cursor-pointer"
      />
      @if (displayImageRemoveIcon) {
        <button
          class="mr-2"
          mat-icon-button
          matSuffix
          [matTooltip]="'CUSTOM_CERTIFICATES.CREATE_FORM.REMOVE_IMAGE' | transloco"
          (click)="removeImage($event)"
        >
          <mat-icon>delete</mat-icon>
        </button>
      }

      <mat-hint>{{ hint() }}</mat-hint>
    </mat-form-field>
    <input #fileInput hidden inert type="file" accept="image/jpeg, image/png" (change)="onFileInputChange(fileInput)" />
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateImageUploadComponent {
  label = input<string>();
  hint = input<string>();
  fileName = signal('');
  imageSelected = output<File>();
  imageRemoved = output();
  imageSrc = model<string | undefined>('');
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  get displayImageRemoveIcon(): boolean {
    return (
      this.imageSrc() &&
      this.imageSrc() !== CUSTOM_CERTIFICATE_DEFAULT_IMAGES.landscape &&
      this.imageSrc() !== CUSTOM_CERTIFICATE_DEFAULT_IMAGES.portrait
    );
  }

  private readonly reader = new FileReader();

  onFileInputChange(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.fileName.set(file.name);
    this.imageSelected.emit(file);
    this.readFile(file);
  }

  removeImage(event: MouseEvent) {
    event?.stopPropagation();
    this.fileInput.nativeElement.value = null;
    this.imageSrc.set('');
    this.fileName.set('');
    this.imageRemoved.emit();
  }

  openFileSelection() {
    this.fileInput.nativeElement.click();
  }

  private readFile(file: File) {
    this.reader.addEventListener('load', (event) => {
      this.imageSrc.set(event.target.result as string);
    });
    this.reader.readAsDataURL(file);
  }
}
