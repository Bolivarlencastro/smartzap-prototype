import { ChangeDetectionStrategy, Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { MatHint } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { CONTENT_DIALOG_MODULE } from '../../models/enums';

export interface FileOutput {
  event: Event;
  element: ElementRef;
}

@Component({
  selector: 'kp-file',
  imports: [MatIcon, TranslocoPipe, MatHint],
  templateUrl: './kp-file.component.html',
  styles: [
    `
      .upload-icon {
        color: var(--mat-sys-on-primary);
      }

      .item-icon {
        color: var(--mat-sys-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpFileComponent {
  coverImage = input<string>('');
  itemIcon = input<string>();
  moduleName = input<string>();
  showImageHint = input<boolean>(true);
  selectCoverImage = output<FileOutput>();
  @ViewChild('uploadCoverImageInput') uploadCoverImageInput: ElementRef;

  get isPulse(): boolean {
    return this.moduleName() === CONTENT_DIALOG_MODULE.PULSE;
  }

  onSelectCoverImage(event: Event) {
    this.selectCoverImage.emit({ event, element: this.uploadCoverImageInput });
  }
}
