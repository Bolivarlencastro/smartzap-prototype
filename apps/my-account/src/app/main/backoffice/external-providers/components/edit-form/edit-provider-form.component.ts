import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KpImageFileUploadComponent } from '@keeps-platform-frontend-workspace/ui/kp-image-file-upload';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ProviderDto } from '../../model/external-providers.dto';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ExternalProviderListActions } from '../../store/actions';

@Component({
  selector: 'app-edit-provider-form',
  imports: [
    CommonModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    KpImageFileUploadComponent,
  ],
  templateUrl: './edit-provider-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProviderFormComponent {
  backgroundImageSrc!: string;
  formCreateProvider!: FormGroup;
  @Output() sendUpdatedProvider = new EventEmitter<ProviderDto>();

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ProviderDto,
    private store: Store,
    private dialogRef: MatDialogRef<EditProviderFormComponent>,
  ) {
    this.updateImageSrc(data.icon);
    this.formCreateProvider = this.fb.group({
      name: [data.name, [Validators.maxLength(50)]],
      icon: [null],
    });
  }

  updateImageSrc(src: string) {
    if (src) {
      this.backgroundImageSrc = src;
      return;
    }
    this.backgroundImageSrc = this.data.icon;
  }

  updateProvider() {
    const formData = new FormData();
    const form = this.formCreateProvider.value;
    formData.append('name', form.name);
    if (form.icon) {
      formData.append('icon', form.icon);
    }
    this.store.dispatch(ExternalProviderListActions.editProvider({ providerId: this.data.id, formData }));
    this.dialogRef.close();
  }
}
