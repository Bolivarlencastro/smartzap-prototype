import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-users-import-form',
  templateUrl: './users-import-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [MatTooltip, TranslocoPipe],
})
export class UsersImportFormComponent {
  @ViewChild('fileInput') uploadInput: ElementRef<HTMLInputElement>;
  protected _selectedFile: File | undefined;

  get currentFileName() {
    return this._selectedFile?.name;
  }

  get valid() {
    return !!this._selectedFile;
  }

  get value() {
    return this._selectedFile;
  }

  fileInputChange() {
    this._selectedFile = this.uploadInput.nativeElement.files?.item(0);
  }
}
