import { ChangeDetectionStrategy, Component, ElementRef, output, signal, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

const ACCEPTED_FILE_TYPES = [
  'video/mp4',
  'video/webm',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'audio/mpeg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

@Component({
  selector: 'app-support-material-form',
  imports: [MatButton, MatIcon, TranslocoPipe],
  template: `
    <div class="flex flex-col items-center p-4">
      <mat-icon class="text-5xl mb-2" [inline]="true">upload_file</mat-icon>
      <p class="text-lg font-medium">{{ 'MISSION.CREATE.SUPPORT_MATERIAL.ADD_FILES' | transloco }}</p>
      <span>{{ 'MISSION.CREATE.SUPPORT_MATERIAL.OR' | transloco }}</span>
      <button matButton type="button" (click)="uploadClick()">
        {{ 'MISSION.CREATE.SUPPORT_MATERIAL.SELECT_FILES' | transloco }}
      </button>
    </div>

    <input
      hidden
      type="file"
      [attr.accept]="acceptedFileTypes"
      data-test="material-support-upload-input"
      #fileInput
      (change)="onFileInputChange()"
    />
  `,
  styles: `
    :host {
      @apply relative grid place-content-center overflow-hidden rounded-lg;
      @apply border-2 border-default border-dashed;

      background-color: var(--mat-sys-surface-container-lowest);

      &.dragging-over {
        @apply border-solid;

        background-color: var(--mat-sys-surface-container-low);
      }
    }
  `,
  host: {
    '[class.dragging-over]': 'isDraggingOver()',
    '(dragenter)': `dragEnter($event)`,
    '(dragleave)': `dragLeave($event)`,
    '(dragover)': `dragOver($event)`,
    '(drop)': 'onDrop($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportMaterialFormComponent {
  isDraggingOver = signal(false);
  acceptedFileTypes = ACCEPTED_FILE_TYPES.join(',');
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  filesSelected = output<File[]>();

  private dragCounter = 0;

  dragEnter(event: DragEvent) {
    event.preventDefault();
    this.dragCounter++;
    this.isDraggingOver.set(true);
  }

  dragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragCounter--;

    if (this.dragCounter === 0) {
      this.isDraggingOver.set(false);
    }
  }

  dragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileInputChange() {
    const files = this.fileInput().nativeElement.files;
    if (!files.length) {
      return;
    }
    this.filesSelected.emit(Array.from(files));
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragCounter = 0;
    this.isDraggingOver.set(false);

    const files = event.dataTransfer?.files;
    this.filesSelected.emit(Array.from(files || []));
  }

  uploadClick() {
    this.fileInput().nativeElement.click();
  }
}
