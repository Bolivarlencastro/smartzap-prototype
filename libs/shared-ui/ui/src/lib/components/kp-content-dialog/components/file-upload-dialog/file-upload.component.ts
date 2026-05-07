import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { filter, tap } from 'rxjs';
import { KpImageCropperComponent } from '../../../kp-image-cropper';
import { ContentDialogService } from '../../content-dialog.service';
import { CONTENT_DIALOG_MODULE } from '../../models';
import { FileOutput, KpFileComponent } from '../kp-file/kp-file.component';

@Component({
  selector: 'kp-file-upload',
  templateUrl: './file-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatHint,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatCheckbox,
    TranslocoPipe,
    KpFileComponent,
  ],
})
export class FileUploadComponent {
  @Input() moduleName!: string;
  @Input() hideCoverUpload = false;
  @Input() form = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    description: new UntypedFormControl('', Validators.required),
  });
  @Input() itemIcon!: string;
  @Input() uploadFileInput!: HTMLInputElement;
  @Input() selectedFileName!: string;
  @Input() showDescription = false;
  @Input() showImageHint = true;
  @Input() coverImage = '';
  @Output() coverImageChange = new EventEmitter<string>();
  @Output() fileAsCoverChange = new EventEmitter<boolean>();

  constructor(
    private _contentDialogService: ContentDialogService,
    private _dialog: MatDialog,
  ) {}

  get isPulse(): boolean {
    return this.moduleName === CONTENT_DIALOG_MODULE.PULSE;
  }

  get name(): any {
    return this.form.get('name');
  }

  get showCheckbox(): boolean {
    return this.selectedFileName && this.itemIcon === 'image' && this.isPulse;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  onSelectCoverImage(data: FileOutput): void {
    this._dialog
      .open(KpImageCropperComponent, {
        autoFocus: false,
        disableClose: true,
        data: { fileEvent: data.event, aspectRatio: 1, resizeToWidth: 230, resizeToHeight: 230 },
      })
      .afterClosed()
      .pipe(
        tap(() => {
          if (data.element) {
            data.element.nativeElement.value = null;
          }
        }),
        filter((file) => !!file),
        tap((file) =>
          this._contentDialogService.imageUploader(file).subscribe(({ url }) => {
            this.coverImage = url;
            this.coverImageChange.emit(this.coverImage);
          }),
        ),
      )
      .subscribe();
  }

  useFileAsCover(checked: boolean): void {
    this.fileAsCoverChange.emit(checked);

    if (this.uploadFileInput) {
      if (checked) {
        this.onSelectCoverImage({
          event: { target: this.uploadFileInput as unknown } as Event,
          element: null,
        });
      } else {
        this.coverImage = '';
      }
    }
  }
}
