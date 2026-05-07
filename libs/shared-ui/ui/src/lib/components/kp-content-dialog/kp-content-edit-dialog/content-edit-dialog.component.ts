import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';

import {
  CONTENT_DIALOG_APP,
  CONTENT_DIALOG_MODULE,
  GENIALLY_REGEX,
  GOOGLE_DRIVE_REGEX,
  H5P_REGEX,
  LearnContentType,
  SOUNDCLOUD_REGEX,
  VIMEO_REGEX,
  YOUTUBE_REGEX,
} from '../models';
import { FileUploadComponent } from '../components';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { ContentButtonService } from '../content-button.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { KpMessageService } from '../../../services/kp-message.service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MatIcon } from '@angular/material/icon';

export type ContentEditDialogData = {
  app: CONTENT_DIALOG_APP;
  moduleName: CONTENT_DIALOG_MODULE;
  editContentType: string;
  learnContentUrl: string;
};

const KEEPS_CONTENT_REGEX = /^https?:\/\/(contents-stage\.keepsdev\.com|contents\.keepsdev\.com)\//s;

@Component({
  selector: 'kp-content-edit-dialog',
  imports: [
    FileUploadComponent,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    TranslocoPipe,
    MatInput,
    MatLabel,
    MatError,
    MatFormField,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatIcon,
    MatSuffix,
  ],
  providers: [ContentButtonService],
  template: `
    <h1 mat-dialog-title class="text-xl">{{ 'PULSE.EDIT_CONTENT' | transloco }}</h1>
    <div mat-dialog-content>
      @if (contentType === 'FILE') {
        <kp-file-upload
          class="w-full"
          [showImageHint]="showImageHint"
          [moduleName]="data.moduleName"
          [selectedFileName]="selectedFileName"
          [form]="contentForm"
          [uploadFileInput]="uploadInput"
          [hideCoverUpload]="true"
        ></kp-file-upload>
        @if (showTimeInput) {
          <div [formGroup]="contentForm">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>
                <mat-icon matSuffix class="secondary-text"> schedule</mat-icon>
                {{ 'UI.KP_CONTENT_FORM_DIALOG.FIELD_PLACEHOLDER_TIME' | transloco }}
              </mat-label>
              <input data-test="input-genially-time" matInput type="number" formControlName="time" />

              @if (contentForm.hasError('required', 'time')) {
                <mat-error>
                  {{ 'UI.GENERAL.REQUIRED_FIELD' | transloco }}
                </mat-error>
              }
              @if (contentForm.hasError('pattern', 'time')) {
                <mat-error>
                  {{ 'UI.KP_CONTENT_FORM_DIALOG.FIELD_LABEL_TIME' | transloco }}
                </mat-error>
              }
            </mat-form-field>
          </div>
        }
      } @else {
        <form [formGroup]="contentForm" class="flex flex-col gap-1">
          <mat-form-field appearance="outline" class="pt-6">
            <mat-label>
              {{ 'UI.KP_CONTENT_FORM_DIALOG.FIELD_PLACEHOLDER_CONTENT' | transloco }}
            </mat-label>
            <input matInput formControlName="name" data-test="inputTextNewFileContent" />
            @if (contentForm.hasError('required', 'name')) {
              <mat-error>{{ 'UI.GENERAL.REQUIRED_FIELD' | transloco }}</mat-error>
            }
            @if (contentForm.hasError('maxlength', 'name')) {
              <mat-error>{{ 'UI.GENERAL.REQUIRED_CHARACTERISTICS' | transloco }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field #matFormFieldValue class="mat-form-field-value" appearance="outline">
            <mat-label>
              {{ 'UI.KP_CONTENT_FORM_DIALOG.FIELD_PLACEHOLDER_EXTERNAL_LINK' | transloco }}
            </mat-label>
            <input matInput formControlName="value" data-test="input-external-link" />
            @if (contentForm.hasError('required', 'value')) {
              <mat-error>{{ 'UI.GENERAL.REQUIRED_FIELD' | transloco }}</mat-error>
            }
            @if (contentForm.hasError('pattern', 'value')) {
              <mat-error>
                {{ 'UI.KP_CONTENT_FORM_DIALOG.FIELD_LABEL_LINK' | transloco }} {{ externalLinkServiceName }}
              </mat-error>
            }
          </mat-form-field>
          @if (showTimeInput) {
            <mat-form-field appearance="outline">
              <mat-label>
                <mat-icon matSuffix class="secondary-text"> schedule</mat-icon>
                {{ 'UI.KP_CONTENT_FORM_DIALOG.FIELD_PLACEHOLDER_TIME' | transloco }}
              </mat-label>
              <input data-test="input-genially-time" matInput type="number" formControlName="time" />

              @if (contentForm.hasError('required', 'time')) {
                <mat-error>
                  {{ 'UI.GENERAL.REQUIRED_FIELD' | transloco }}
                </mat-error>
              }
              @if (contentForm.hasError('pattern', 'time')) {
                <mat-error>
                  {{ 'UI.KP_CONTENT_FORM_DIALOG.FIELD_LABEL_TIME' | transloco }}
                </mat-error>
              }
            </mat-form-field>
          }
        </form>
      }
      <input
        #uploadInput
        class="hidden"
        type="file"
        (change)="onSelectFile()"
        (cancel)="onFileSelectionCancel()"
        data-cy="file-upload"
      />
    </div>

    <div mat-dialog-actions align="end">
      <button mat-stroked-button type="button" mat-dialog-close [attr.aria-label]="'UI.GENERAL.CANCEL' | transloco">
        {{ 'UI.GENERAL.CANCEL' | transloco }}
      </button>

      <button
        mat-flat-button
        color="primary"
        type="button"
        data-test="button-save"
        [attr.aria-label]="'UI.GENERAL.SAVE' | transloco"
        [disabled]="contentForm?.invalid"
        (click)="save()"
      >
        {{ 'UI.GENERAL.SAVE' | transloco }}
      </button>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentEditDialogComponent implements OnInit {
  @ViewChild('uploadInput', { static: true }) uploadInput!: ElementRef;

  protected selectedFileName: string | null = null;
  protected readonly contentType: LearnContentType;
  protected readonly contentForm: UntypedFormGroup | undefined;
  protected readonly showImageHint = true;
  protected readonly externalLinkServiceName: string;
  private acceptTypes: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ContentEditDialogData,
    private readonly dialogRef: MatDialogRef<ContentEditDialogComponent>,
    private readonly buttonService: ContentButtonService,
    private readonly messageService: KpMessageService,
  ) {
    const { editContentType, learnContentUrl } = this.data;
    this.contentType = this.getContentTypeFromPulse(learnContentUrl);
    this.externalLinkServiceName = this.resolveServiceNameFromUrl(learnContentUrl);
    this.contentForm = this.buildForm(this.contentType, editContentType);
  }

  get showTimeInput() {
    return this.data.editContentType === 'HTML';
  }

  ngOnInit() {
    this.openFileSelectionWindow();
  }

  onSelectFile() {
    const file = this.uploadInput.nativeElement.files?.item(0);
    if (file) {
      this.handleSelectedFile(file);
    }
  }

  save() {
    const formValue = this.contentForm.value;
    this.dialogRef.close(formValue);
  }

  onFileSelectionCancel() {
    this.dialogRef.close();
  }

  private handleSelectedFile(file: File) {
    if (!this.acceptTypes?.includes(file.type)) {
      this.displayUnsupportedContentTypeMessage();
      this.dialogRef.close();
      return;
    }

    this.selectedFileName = file.name;
    this.contentForm.patchValue({
      value: file,
      name: file.name,
    });
  }

  private openFileSelectionWindow() {
    if (this.contentType !== 'FILE') {
      return;
    }

    this.acceptTypes = this.resolveAcceptType(this.data.editContentType);
    this.uploadInput.nativeElement.accept = this.acceptTypes;
    this.uploadInput.nativeElement.value = '';
    this.uploadInput.nativeElement.click();
  }

  private displayUnsupportedContentTypeMessage() {
    this.messageService.error(marker('UI.KP_CONTENT_DIALOG.SELECT_SAME_TYPE_ERROR'));
  }

  private getContentTypeFromPulse(learnContentUrl: string): LearnContentType {
    const isKeepsContentUrl = KEEPS_CONTENT_REGEX.test(learnContentUrl);

    if (isKeepsContentUrl) {
      return 'FILE';
    }

    // For files hosted in external links, we define the content type by its URL
    return this.getLinkContentType(learnContentUrl);
  }

  private getLinkContentType(learnContentUrl: string): LearnContentType {
    if (YOUTUBE_REGEX.test(learnContentUrl)) {
      return 'YOUTUBE';
    }

    if (VIMEO_REGEX.test(learnContentUrl)) {
      return 'VIMEO';
    }

    if (SOUNDCLOUD_REGEX.test(learnContentUrl)) {
      return 'SOUNDCLOUD';
    }

    if (GOOGLE_DRIVE_REGEX.test(learnContentUrl)) {
      return 'GOOGLE_DRIVE';
    }

    if (GENIALLY_REGEX.test(learnContentUrl)) {
      return 'GENIALLY';
    }

    if (H5P_REGEX.test(learnContentUrl)) {
      return 'H5P';
    }

    return 'LINK';
  }

  private resolveAcceptType(editContentType: string) {
    // We check directly for some content types because the ACCEPT_TYPES map doesn't have an exact match for them
    if (editContentType === 'SPREADSHEET') {
      return ContentButtonService.ACCEPT_FILE_EXCEL;
    }

    if (editContentType === 'PRESENTATION') {
      return ContentButtonService.ACCEPT_FILE_POWERPOINT;
    }

    if (editContentType === 'TEXT') {
      return ContentButtonService.ACCEPT_FILE_WORD;
    }

    if (editContentType === 'HTML') {
      return ContentButtonService.ACCEPT_FILE_TYPES_ZIP;
    }

    return ContentButtonService.ACCEPT_TYPES.get(editContentType);
  }

  private buildForm(contentType: LearnContentType, editContentType: string) {
    if (contentType === 'GOOGLE_DRIVE') {
      // We override the validators for the url regex based on the original content type (Spreadsheet, presentation or document)
      const form = this.buttonService.createContentForm(contentType);
      const driveContentRegex = this.getGoogleDriveRegexByContentType(editContentType);
      form.get('value')?.setValidators([Validators.required, Validators.pattern(driveContentRegex)]);
      return form;
    }

    if (contentType === 'FILE' && editContentType === 'HTML') {
      // When the content type is a file and the content being edited is an HTML, we can assume the user will upload
      // a new Genially file
      const form = this.buttonService.createContentForm('GENIALLY');
      form.get('value').clearValidators();
      return form;
    }

    return this.buttonService.createContentForm(contentType);
  }

  private getGoogleDriveRegexByContentType(contentType: string) {
    const drivePrefixMap = new Map<string, string>([
      ['SPREADSHEET', 'spreadsheets'],
      ['PRESENTATION', 'presentation'],
      ['TEXT', 'document'],
    ]);

    const drivePrefix = drivePrefixMap.get(contentType);
    return new RegExp(`((https:)?\\/\\/(docs.google.com)\\/${drivePrefix}\\/d\\/[a-zA-Z0-9_-]+\\/(.*))`);
  }

  private resolveServiceNameFromUrl(learnContentUrl: string) {
    if (YOUTUBE_REGEX.test(learnContentUrl)) {
      return 'YouTube';
    }

    if (VIMEO_REGEX.test(learnContentUrl)) {
      return 'Vimeo';
    }

    if (SOUNDCLOUD_REGEX.test(learnContentUrl)) {
      return 'SoundCloud';
    }

    if (GOOGLE_DRIVE_REGEX.test(learnContentUrl)) {
      return 'Google Drive';
    }

    if (GENIALLY_REGEX.test(learnContentUrl)) {
      return 'Genially';
    }

    if (H5P_REGEX.test(learnContentUrl)) {
      return 'H5P';
    }

    return '';
  }
}
