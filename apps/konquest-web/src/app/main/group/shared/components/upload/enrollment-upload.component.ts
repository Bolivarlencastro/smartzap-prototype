import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-enrollment-upload',
  templateUrl: './enrollment-upload.component.html',
  styleUrls: ['./enrollment-upload.component.scss'],
  imports: [MatButton, MatIcon, TranslocoPipe],
})
export class EnrollmentUploadComponent {
  @Input() buttonTitle!: string;
  @Input() iconMode!: boolean;
  @Input() isLoading!: boolean;
  @Output() upload = new EventEmitter<any>();
  dislplayError!: boolean;

  processFile(input: any): void {
    this.dislplayError = false;
    const file: File = input.files[0];

    if (!file) {
      return;
    }

    this.verifyIfIsValid(file);
  }

  private verifyIfIsValid(file: File): void {
    const regex = /^(.*?)\.(xlsx)$/;
    const filesize: any = (file.size / 1024 / 1024).toFixed(4); // convert to MB
    const isInvalidFile = filesize > 10 || !regex.test(file.name);

    if (isInvalidFile) {
      alert('Arquivo inválido!');
      return;
    }

    this.read(file);
  }

  private read(file: File): void {
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      const { result } = event.target;
      this.upload.emit({ result, file });
    });

    reader.readAsDataURL(file);
  }
}
