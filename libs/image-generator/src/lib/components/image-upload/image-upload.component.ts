import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { DIMENSIONS_MAP } from '../../models/image-proportion';
import { ImageUploadType } from '../../models/image-upload-type';

@Component({
  selector: 'ig-image-upload',
  imports: [MatIconModule, MatButtonModule, TranslocoModule, MatDialogModule],
  template: `
    <div class="h-16 w-full border-b border-default flex items-center justify-between p-4">
      <span>{{ 'IMAGE_WIZARD.SOURCES.FILE_UPLOAD_HEADER' | transloco }}</span>
      <button matIconButton mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <div class="grow flex flex-col gap-3 items-center justify-center w-full">
      <div class="drop-container">
        <mat-icon class="icon-size">upload</mat-icon>
        <span class="text-sm font-bold">{{ 'IMAGE_WIZARD.IMAGE_UPLOAD.DROP_MESSAGE' | transloco }}</span>
        <span class="text-sm mb-1">{{ 'IMAGE_WIZARD.IMAGE_UPLOAD.OR' | transloco }}</span>
        <button matButton="tonal" (click)="onUploadClick()">
          {{ 'IMAGE_WIZARD.IMAGE_UPLOAD.BUTTON' | transloco }}
        </button>
      </div>
      <div class="text-xs">{{ 'IMAGE_WIZARD.IMAGE_UPLOAD.RESOLUTION' | transloco: { value: proportionStr() } }}</div>
    </div>

    <input hidden type="file" accept="image/jpeg, image/png, image/webp" #fileInput (change)="onFileInputChange()" />
  `,
  styles: `
    :host {
      @apply flex flex-col h-full w-full;
    }

    .drop-container {
      @apply flex flex-col gap-1 items-center justify-center rounded-lg;

      background-color: var(--mat-sys-surface-container-lowest);
      border: 2px dashed var(--mat-sys-outline-variant);

      width: 448px;
      height: 230px;
      max-width: 90%;
      max-height: 75%;
    }

    .icon-size {
      @apply mb-1 opacity-70;

      font-size: 52px;
      width: 52px;
      height: 52px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  uploadType = input<ImageUploadType>();
  goToCrop = output<File>();
  proportionStr = computed(() => {
    const [width, height] = DIMENSIONS_MAP[this.uploadType()];
    return `${width}x${height}`;
  });

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  @HostListener('drop', ['$event'])
  fileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.item(0);

    if (!file) {
      return;
    }

    this.goToCrop.emit(file);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onUploadClick() {
    this.fileInput.nativeElement.click();
  }

  onFileInputChange() {
    const file = this.fileInput.nativeElement.files?.item(0);

    if (!file) {
      return;
    }

    this.goToCrop.emit(file);
  }
}
