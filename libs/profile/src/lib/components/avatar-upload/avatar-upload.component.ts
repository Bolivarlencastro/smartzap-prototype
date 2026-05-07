import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatButton, TranslocoPipe],
})
export class AvatarUploadComponent {
  @Input() imageSrc!: string;
  @Output() uploadImage: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uploadButton') uploadButton!: ElementRef<HTMLInputElement>;

  protected imageToUpload: File;

  private readonly reader = new FileReader();

  constructor(
    private _cdr: ChangeDetectorRef,
    private _renderer: Renderer2,
  ) {
    this.registerReaderLoadListener();
  }

  get backgroundImage(): string {
    if (!this.imageSrc) {
      return '';
    }
    return `url(${this.imageSrc})`;
  }

  onClickAvatar(): void {
    this.avatarInput.nativeElement.click();
  }

  onFileInputChange() {
    const files = this.avatarInput.nativeElement.files;
    this.processFile(files?.item(0));
    this.avatarInput.nativeElement.value = '';
  }

  private processFile(file: File | undefined): void {
    if (!file) {
      return;
    }

    this.imageToUpload = file;
    this.reader.readAsDataURL(file);
  }

  private registerReaderLoadListener(): void {
    this.reader.addEventListener('load', (event) => this.onFileLoad(event));
  }

  private onFileLoad(event: ProgressEvent<FileReader>): void {
    this.imageSrc = event.target.result as string;
    this._cdr.markForCheck();
  }

  onClickSave(): void {
    this.uploadImage.emit(this.imageToUpload);
  }

  toggleShowUploadButton(action: 'addClass' | 'removeClass'): void {
    if (!(this.imageSrc || this.imageToUpload)) {
      return;
    }

    this._renderer[action](this.uploadButton.nativeElement, 'opacity-0');
  }
}
