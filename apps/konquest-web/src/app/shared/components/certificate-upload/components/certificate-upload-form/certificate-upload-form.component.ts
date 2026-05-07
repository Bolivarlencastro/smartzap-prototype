import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-certificate-upload-form',
  templateUrl: './certificate-upload-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatTooltip, TranslocoPipe],
})
export class CertificateUploadFormComponent {
  @ViewChild('uploadInput') uploadInput: ElementRef<HTMLInputElement>;

  private _selectedFile!: File;

  get selectedFile() {
    return this._selectedFile;
  }

  fileInputChange() {
    this._selectedFile = this.uploadInput.nativeElement.files?.item(0);
  }
}
