import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'kp-image-file-upload',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, TranslocoModule, ReactiveFormsModule],
  templateUrl: './kp-image-file-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpImageFileUploadComponent implements OnChanges {
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() control: FormControl;
  @Output() srcEvent = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  fileName = '';
  private readonly reader = new FileReader();

  constructor(private readonly cdr: ChangeDetectorRef) {
    this.registerReaderLoadListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['control'] && this.control?.value) {
      this.processFile(this.control.value);
    }
  }

  uploadInputClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileInputChange(): void {
    const file = this.fileInput.nativeElement.files?.item(0);
    if (file) {
      this.processFile(file);
    }
  }

  cleanInput(): void {
    this.fileName = '';
    this.control.setValue(null);
    this.srcEvent.emit(null);
    this.fileInput.nativeElement.value = '';
    this.cdr.detectChanges();
  }

  private processFile(file: File): void {
    this.fileName = file.name;
    this.control.setValue(file);
    this.reader.readAsDataURL(file);
  }

  private registerReaderLoadListener(): void {
    this.reader.addEventListener('load', (event) => this.onFileLoad(event));
  }

  private onFileLoad(event: ProgressEvent<FileReader>): void {
    this.srcEvent.emit(event.target.result as string);
  }
}
