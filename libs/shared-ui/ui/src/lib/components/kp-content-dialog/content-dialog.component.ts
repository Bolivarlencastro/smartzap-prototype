import { CdkPortalOutlet, Portal, TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  ElementRef,
  Inject,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter, map, tap } from 'rxjs/operators';

import { NgClass } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpImageCropperComponent } from '../kp-image-cropper';
import { FileUploadComponent, KpContentDialogButtonsComponent } from './components';
import { FileOutput, KpFileComponent } from './components/kp-file/kp-file.component';
import { ContentButtonService } from './content-button.service';
import { ContentDialogService } from './content-dialog.service';
import { CONTENT_DIALOG_APP, CONTENT_DIALOG_MODULE, ContentButton, LearnContentType } from './models';

export type ContentDialogData = {
  app: CONTENT_DIALOG_APP;
  moduleName?: CONTENT_DIALOG_MODULE;
  messagesContentEmbed?: boolean;
};

@Component({
  selector: 'kp-content-form-dialog',
  templateUrl: './content-dialog.component.html',
  providers: [ContentButtonService, ContentDialogService],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    KpContentDialogButtonsComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    NgClass,
    MatLabel,
    MatIcon,
    MatSuffix,
    MatInput,
    MatError,
    MatIconButton,
    MatButton,
    FileUploadComponent,
    CdkPortalOutlet,
    MatDialogActions,
    TranslocoPipe,
    KpFileComponent,
  ],
})
export class KpContentFormDialogComponent {
  acceptType!: string[];
  contentForm: UntypedFormGroup | undefined;
  buttons: ContentButton[];
  selectedType: LearnContentType | undefined;
  selectedFileName!: string;
  moduleName: CONTENT_DIALOG_MODULE;
  showImageHint = true;
  coverImage = '';
  subButtonSelected: ContentButton | undefined;
  selectedPortal!: Portal<unknown>;
  iframe: SafeHtml | undefined;
  isLinkActive = false;
  isZipActive = false;
  messagesContentEmbed: boolean;

  @ViewChild('uploadInput', { static: true }) uploadInput!: ElementRef;
  @ViewChild('templatePortalContent') templatePortalContent!: TemplateRef<unknown>;
  @ViewChildren('matFormFieldValue') matFormFieldValue!: QueryList<MatFormField>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ContentDialogData,
    private _buttonService: ContentButtonService,
    private _viewContainerRef: ViewContainerRef,
    private _sanitizer: DomSanitizer,
    private _contentDialogService: ContentDialogService,
    private _dialog: MatDialog,
    public dialogRef: MatDialogRef<KpContentFormDialogComponent>,
  ) {
    // Set Defaults
    this.moduleName = data.app === CONTENT_DIALOG_APP.KONQUEST ? data.moduleName : null;
    this.messagesContentEmbed = data.messagesContentEmbed ?? false;
    this.buttons = _buttonService.getButtons(data.app, this.messagesContentEmbed);
  }

  get value(): any {
    return this.contentForm?.get('value');
  }

  get name(): any {
    return this.contentForm.get('name');
  }

  get time(): any {
    return this.contentForm?.get('time');
  }

  // Returns true if the user chooses a content of type FILE. It's for rendering the file upload dialog.
  get isInsideFile(): boolean {
    return !!(this.selectedType === 'FILE' && this.subButtonSelected && this.selectedFileName);
  }

  // Render logic for the external link input.
  get isExternalLinkInput(): boolean {
    return (
      ((this.selectedType === 'LINK' && this.subButtonSelected) ||
        this.subButtonSelected?.type === 'GENIALLY' ||
        this.subButtonSelected?.type === 'H5P') &&
      !this.selectedFileName
    );
  }

  // Render logic for the name input.
  get isNameInput(): boolean {
    return !!(
      this.subButtonSelected?.type === 'GENIALLY' ||
      this.subButtonSelected?.type === 'H5P' ||
      this.subButtonSelected?.type === 'SCORM' ||
      this.selectedType === 'QUIZ' ||
      (this.selectedType === 'LINK' && this.subButtonSelected)
    );
  }

  // Returns the correct placeholder for the name input.
  get contentNamePlaceholder(): string {
    let placeHolder = 'FIELD_PLACEHOLDER_CONTENT';

    if (this.selectedType === 'QUIZ') {
      placeHolder = 'FIELD_PLACEHOLDER_EXAM';
    }

    return `UI.KP_CONTENT_FORM_DIALOG.${placeHolder}`;
  }

  // Checks if the name input will be readonly.
  get isNameInputReadonly(): boolean {
    return !this.subButtonSelected && this.selectedType !== 'QUIZ';
  }

  // Render logic for the zip file and time input.
  get isHTMLTypeInput(): boolean {
    return (
      this.subButtonSelected?.type === 'GENIALLY' ||
      this.subButtonSelected?.type === 'H5P' ||
      this.subButtonSelected?.type === 'SCORM'
    );
  }

  // Returns the zip file input value.
  get zipFileInputValue(): string {
    return this.value?.value.name || '';
  }

  // Mounts the gif's "src" property value.
  get gifSrcValue(): string {
    return 'https://assets.keepsdev.com/gifs/gif-' + this.subButtonSelected?.type + '.gif';
  }

  get showCoverImageUpload(): boolean {
    return (
      this.moduleName === CONTENT_DIALOG_MODULE.PULSE &&
      (this.subButtonSelected?.type === 'YOUTUBE' ||
        this.subButtonSelected?.type === 'VIMEO' ||
        this.subButtonSelected?.type === 'SOUNDCLOUD' ||
        this.subButtonSelected?.type === 'GOOGLE_DRIVE' ||
        this.subButtonSelected?.type === 'H5P' ||
        this.subButtonSelected?.type === 'GENIALLY')
    );
  }

  get isEvaluativeOrSurveyQuiz(): boolean {
    return this.subButtonSelected?.type === 'EVALUATIVE_QUIZ' || this.subButtonSelected?.type === 'SURVEY_QUIZ';
  }

  get showDescription(): boolean {
    return this.data.app === CONTENT_DIALOG_APP.SMARTZAP;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  onSelectContent(contentButton: ContentButton): void {
    contentButton.selected = true;
    let contentType = contentButton.type;
    this.clearUploadInput();

    this.acceptType = ContentButtonService.ACCEPT_TYPES.get(contentType);

    switch (contentType) {
      case 'VIDEO':
      case 'IMAGE':
      case 'PODCAST':
      case 'PDF':
      case 'WORD':
      case 'POWERPOINT':
      case 'EXCEL':
        this.uploadInput.nativeElement.accept = this.acceptType;
        this.uploadInput.nativeElement.click();
        contentType = 'FILE';
        this.contentForm = this._buttonService.createContentForm(contentType);
        break;
      case 'YOUTUBE':
      case 'VIMEO':
      case 'SOUNDCLOUD':
      case 'GOOGLE_DRIVE':
        contentType = 'LINK';
        this.contentForm = this._buttonService.createContentForm(contentButton.type);
        break;
      case 'GENIALLY':
      case 'H5P':
      case 'SCORM':
        contentType = 'HTML';
        this.contentForm = this._buttonService.createContentForm(contentButton.type);
        break;
      case 'FILE':
        this.buttons = this._buttonService.getUploadFileButtons(this.data.app);
        this.contentForm = this._buttonService.createContentForm(contentType);
        break;
      case 'LINK':
        this.buttons = this._buttonService.getLinkButtons(this.data.app, this.data.moduleName);
        this.contentForm = this._buttonService.createContentForm(contentType);
        break;
      case 'HTML':
        this.buttons = this._buttonService.getHTMLButtons(this.moduleName);
        this.contentForm = this._buttonService.createContentForm(contentType);
        break;
      case 'QUIZ':
        if (this.data.app === CONTENT_DIALOG_APP.KONQUEST) {
          this.hanleKonquestQuizSubmit();
          break;
        }
        if (this.data.app === CONTENT_DIALOG_APP.SMARTZAP) {
          this.buttons = this._buttonService.getSmartZapQuizButtons();
          break;
        }
        this.contentForm = this._buttonService.createContentForm(contentType);
        break;
      case 'EVALUATIVE_QUIZ':
      case 'SURVEY_QUIZ':
        contentType = 'QUIZ';
        this.contentForm = this._buttonService.createContentForm(contentButton.type);
        break;
      case 'EXTERNAL_LINK':
        contentType = 'LINK';
        this.contentForm = this._buttonService.createContentForm(contentType);
        break;
    }

    this.selectedType = contentType;

    if (this.selectedType !== contentButton.type) {
      this.runSubSelectedType(contentButton);
    }
  }

  searchFile(contentButton: ContentButton | undefined) {
    if (contentButton) {
      this.uploadInput.nativeElement.accept = ContentButtonService.ACCEPT_TYPES.get[contentButton?.type];
    }
    this.uploadInput.nativeElement.click();
  }

  onSubmit(): void {
    const formData = this.contentForm?.getRawValue();
    if (this.data.app === CONTENT_DIALOG_APP.KONQUEST) {
      formData.coverImage = this.coverImage;
      formData.name = formData.name?.trim();
    }
    this.dialogRef.close(formData);
  }

  back(): void {
    this.coverImage = '';
    this.selectedFileName = '';
    this.buttons = this._buttonService.getButtons(this.data.app, this.messagesContentEmbed);
    try {
      this.selectedPortal?.detach();
    } catch (error) {
      console.warn(error);
    }
    this.selectedType = undefined;
    this.iframe = undefined;
    this.subButtonSelected = undefined;
    this.contentForm = undefined;
  }

  onSelectFile(event: Event): void {
    if ((event.target as HTMLInputElement)?.files) {
      const files: FileList | null = (event.target as HTMLInputElement).files;

      if (!files?.length) {
        return;
      }

      const file = files.item(0);

      if (file) {
        this.handleFileSelected(file);
      }
    }
  }

  private handleFileSelected(file: File): void {
    const includesFileType = this.acceptType.includes(file?.type);

    if (!includesFileType) {
      this.back();
      this._contentDialogService.displayMessageTypeNotAccepted();
      return;
    }

    if (this.messagesContentEmbed) {
      const fileSizeExceeded = this.rejectIfFileSizeExceeded(file);

      if (fileSizeExceeded) {
        return;
      }
    }

    this.applySelectedFile(file);
  }

  private rejectIfFileSizeExceeded(file: File): boolean {
    const isImage = this.subButtonSelected?.type === 'IMAGE';
    const maxSizeMB = isImage ? 5 : 16;
    const fileSizeMB = file.size / 1024 / 1024;

    if (fileSizeMB > maxSizeMB) {
      this._contentDialogService.displayMessageFileSizeExceeded(maxSizeMB);
      this.uploadInput.nativeElement.value = '';
      return true;
    }

    return false;
  }

  private applySelectedFile(file: File): void {
    const name = file?.name;

    this.selectedFileName = name;
    this.contentForm?.patchValue({ name, value: file });

    if (this.selectedType === 'FILE' && this.subButtonSelected) {
      this.buttons = [this.subButtonSelected];
    }

    if (this.subButtonSelected?.type === 'GENIALLY') {
      this.value?.disable();
    }
  }

  clearUploadInput(contentButton?: ContentButton): void {
    this.selectedFileName = '';
    this.uploadInput.nativeElement.value = '';

    if (contentButton) {
      this.contentForm = this._buttonService.createContentForm('HTML');
    }
  }

  coverImageChange(event: any): void {
    this.coverImage = event;
  }

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
            this.coverImageChange(this.coverImage);
          }),
        ),
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  private runSubSelectedType(contentButton: ContentButton) {
    this.iframe = undefined;
    this.buttons.forEach((button) => (button.selected = false));

    this.subButtonSelected = contentButton;
    this.subButtonSelected.selected = !contentButton.selected;

    if (['LINK', 'HTML'].includes(this.selectedType) && contentButton.type !== 'EXTERNAL_LINK') {
      this.loadImage();
    }

    this.value?.valueChanges.subscribe((data: string) => {
      this.handleSubSelectedType(data);
    });
  }

  private loadImage() {
    const image = new Image();
    image.addEventListener(
      'load',
      () => {
        this.selectedPortal = new TemplatePortal(this.templatePortalContent, this._viewContainerRef);
      },
      false,
    );
    image.src = 'https://assets.keepsdev.com/gifs/gif-' + this.subButtonSelected.type + '.gif';
  }

  private handleSubSelectedType(data: string) {
    if (!this.value.valid) return;

    switch (this.subButtonSelected?.type) {
      case 'YOUTUBE':
        this.handleYouTube(data);
        break;
      case 'SOUNDCLOUD':
        this.handleSoundCloud(data);
        break;
      case 'VIMEO':
        this.handleVimeo(data);
        break;
      case 'GENIALLY':
        this.handleGenially();
        break;
    }
  }

  private handleYouTube(data: string) {
    const rawId = data.split('v=')[1] ?? data.split('.be/')[1] ?? data.split('/live/')[1];
    const id = rawId?.split('?')[0].split('&')[0];
    this.iframe = this._sanitizer.bypassSecurityTrustHtml(
      `<iframe src="https://www.youtube.com/embed/${id}" width="426" height="240" allowfullscreen=""></iframe>`,
    );
  }

  private handleSoundCloud(data: string) {
    this._contentDialogService
      .loadSoundcloud(data)
      .pipe(
        map((response) => (response as { html: string }).html),
        tap((html: string) => {
          this.iframe = this._sanitizer.bypassSecurityTrustHtml(html);
        }),
      )
      .subscribe();
  }

  private handleVimeo(data: string) {
    this._contentDialogService
      .loadVimeo(data)
      .pipe(
        map((response) => (response as { html: string }).html),
        tap((html: string) => {
          this.iframe = this._sanitizer.bypassSecurityTrustHtml(html);
        }),
      )
      .subscribe();
  }

  private handleGenially() {
    this.isLinkActive = !!this.matFormFieldValue.first._control.value;
    this.isZipActive = !!this.matFormFieldValue.last._control.value;
  }

  private hanleKonquestQuizSubmit() {
    this.dialogRef.close({ type: 'QUIZ' });
  }
}
