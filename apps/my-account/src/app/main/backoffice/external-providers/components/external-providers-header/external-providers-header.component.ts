import { ChangeDetectionStrategy, Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProviderDto } from '../../model/external-providers.dto';
import { TranslocoModule } from '@jsverse/transloco';
import { KpImageFileUploadComponent } from '@keeps-platform-frontend-workspace/ui/kp-image-file-upload';

@Component({
  selector: 'kp-external-providers-header',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    KpImageFileUploadComponent,
    TranslocoModule,
  ],
  templateUrl: './external-providers-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalProvidersHeaderComponent {
  @Output() sendNewProvider = new EventEmitter<ProviderDto>();

  backgroundImageSrc!: string;
  formCreateProvider!: FormGroup;
  @ViewChild(KpImageFileUploadComponent) kpImageFileUploadComponent!: KpImageFileUploadComponent;

  constructor(private fb: FormBuilder) {
    this.formCreateProvider = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      icon: [null, [Validators.required]],
    });
  }

  updateImageSrc(src: string) {
    this.backgroundImageSrc = src;
  }

  createNewProvider() {
    const newProvider: ProviderDto = this.formCreateProvider.value;

    this.sendNewProvider.emit(newProvider);
    this.kpImageFileUploadComponent.cleanInput();
    this.formCreateProvider.reset();
    this.formCreateProvider.markAsPristine();
  }
}
