import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KpImageCropperComponent } from '../kp-image-cropper';
import { filter, tap } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export enum IMAGE_UPLOAD_ERROR {
  FILE_SIZE = 'FILE_SIZE',
  FILE_TYPE = 'FILE_TYPE',
}

@Component({
  selector: 'kp-image-upload-v2',
  templateUrl: './image-upload-v2.component.html',
  styleUrls: ['./image-upload-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, TranslocoPipe],
})
export class ImageUploadV2Component {
  @Input() imageSrc!: string;
  @Input() aspectRatio!: number;
  @Input() resizeToWidth!: number;
  @Input() resizeToHeight!: number;
  @Output() uploadImage = new EventEmitter<File>();
  @Output() imageError = new EventEmitter<IMAGE_UPLOAD_ERROR>();

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  private _isDraggingOVer = false;
  private readonly reader = new FileReader();
  private readonly defaultImage = 'https://assets.keepsdev.com/images/placeholders/default-card-bg.png';

  constructor(
    private _cdr: ChangeDetectorRef,
    private _dialog: MatDialog,
  ) {
    this.registerReaderLoadListener();
  }

  @HostBinding('class.dragging-over')
  get isDraggingOver(): boolean {
    return this._isDraggingOVer;
  }

  @HostBinding('style.background-image')
  get backgroundImage(): string {
    if (this.isDraggingOver) {
      return '';
    }
    return `url(${this.imageSrc || this.defaultImage})`;
  }

  @HostListener('drop', ['$event'])
  fileDrop(event: DragEvent): void {
    event.preventDefault();
    this._isDraggingOVer = false;

    this.processFile(event.dataTransfer?.files?.item(0));
  }

  @HostListener('dragover', ['$event'])
  dragOver(event: DragEvent): void {
    event.preventDefault();
  }

  @HostListener('dragenter')
  dragEnter(): void {
    this._isDraggingOVer = true;
  }

  @HostListener('dragleave')
  dragLeave(): void {
    this._isDraggingOVer = false;
  }

  uploadClick() {
    this.fileInput.nativeElement.click();
  }

  onFileInputChange(event: Event) {
    this._dialog
      .open(KpImageCropperComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          fileEvent: event,
          aspectRatio: this.aspectRatio,
          resizeToWidth: this.resizeToWidth,
          resizeToHeight: this.resizeToHeight,
        },
      })
      .afterClosed()
      .pipe(
        tap(() => (this.fileInput.nativeElement.value = '')),
        filter((file) => !!file),
        tap((file) => this.processFile(file)),
      )
      .subscribe();
  }

  private processFile(file: File | undefined): void {
    if (!file) {
      return;
    }

    const fileType = file.type;
    if (!ACCEPTED_IMAGE_TYPES.includes(fileType)) {
      this.imageError.emit(IMAGE_UPLOAD_ERROR.FILE_TYPE);
      return;
    }

    const MAX_FILE_SIZE = 10;
    const filesize = +(file.size / 1024 / 1024).toFixed(4); // convert to MB

    if (filesize > MAX_FILE_SIZE) {
      this.imageError.emit(IMAGE_UPLOAD_ERROR.FILE_SIZE);
      return;
    }

    this.uploadImage.emit(file);
    this.reader.readAsDataURL(file);
  }

  private registerReaderLoadListener(): void {
    this.reader.addEventListener('load', (event) => this.onFileLoad(event));
  }

  private onFileLoad(event: ProgressEvent<FileReader>): void {
    this.imageSrc = event.target.result as string;
    this._cdr.markForCheck();
  }
}
