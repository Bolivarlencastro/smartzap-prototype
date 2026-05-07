import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpImageFileUploadComponent } from '@keeps-platform-frontend-workspace/ui/kp-image-file-upload';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { BannersApiResponse, CustomSettingsForm, LearningResource, SourceContent } from '../../models/banner-settings';

@Component({
  selector: 'app-banner-settings-form',
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    TranslocoModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    CdkDropList,
    CdkDrag,
    MatMenu,
    MatMenuTrigger,
    KpImageFileUploadComponent,
    MatTooltipModule,
    MatSlideToggleModule,
  ],
  styles: [
    `
      .drag-item {
        background-color: var(--mat-dialog-container-color);
      }

      .drag-list {
        background-color: var(--mat-sys-surface-dim);
      }
    `,
  ],
  templateUrl: './banner-settings-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerSettingsFormComponent implements OnChanges {
  form = input<FormGroup<CustomSettingsForm>>();
  customSettings = input<BannersApiResponse>();
  internalContents = input<LearningResource[]>();
  filter = output<string>();
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  @ViewChild(KpImageFileUploadComponent) kpImageFileUploadComponent!: KpImageFileUploadComponent;

  sourceContent = signal<SourceContent>('INTERNAL');
  learningResources = signal<LearningResource[]>([]);
  hasReachedContentLimit = signal<boolean>(false);
  hasSchedule = signal<boolean>(false);

  contentControl = new FormControl<any>(null);

  urlControl = new FormControl<string>(null, [Validators.required, Validators.pattern(constants.defaultLinkRegex)]);
  urlTitleControl = new FormControl<string>(null);
  urlImageControl = new FormControl<string>(null);

  private readonly destroyRef = inject(DestroyRef);

  get addContentDisabled(): boolean {
    return !this.contentControl?.value?.resource_id;
  }

  get addExternalContentDisabled(): boolean {
    return !this.urlTitleControl.value || !this.urlImageControl.value;
  }

  constructor() {
    this.initAutocompleteContent();
    this.configureScheduleToggle();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['customSettings']) {
      this.patchForm();
    }
  }

  displayFn(content: LearningResource): string {
    return content?.title;
  }

  addContent() {
    const control = this.form().get('learning_resources');
    const previousValue = control.value;

    if (previousValue) {
      control.setValue([...previousValue, this.contentControl.value]);
    } else {
      control.setValue([this.contentControl.value]);
    }

    this.learningResources().push(this.contentControl.value);
    this.contentControl.reset();

    this.verifyContentLimit();
    this.form().markAsDirty();
  }

  deleteContent(index: number) {
    this.learningResources.update((resources) => resources.filter((_, i) => i !== index));
    this.form().get('learning_resources').setValue(this.learningResources());

    this.verifyContentLimit();
    this.form().markAsDirty();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.learningResources(), event.previousIndex, event.currentIndex);
    this.form().get('learning_resources').setValue(this.learningResources());
    this.form().markAsDirty();
  }

  addExternalContent() {
    const learning_resource: LearningResource = {
      resource_type: 'EXTERNAL_CONTENT',
      external_resource_title: this.urlTitleControl.value,
      external_resource_url: this.urlControl.value,
      external_resource_image: this.urlImageControl.value,
      icon: 'link',
    };

    const control = this.form().get('learning_resources');
    const previousValue = control.value;

    if (previousValue) {
      control.setValue([...previousValue, learning_resource]);
    } else {
      control.setValue([learning_resource]);
    }

    this.learningResources().push(learning_resource);

    this.urlControl.reset();
    this.urlTitleControl.reset();
    this.urlImageControl.reset();

    this.kpImageFileUploadComponent?.cleanInput();
    this.menuTrigger?.closeMenu();

    this.verifyContentLimit();
    this.form().markAsDirty();
  }

  setScheduleStatus(event: MatSlideToggleChange) {
    const value = event.checked;
    this.form().markAsDirty();
    this.hasSchedule.set(value);
  }

  private initAutocompleteContent() {
    this.contentControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filter.emit(value));
  }

  private verifyContentLimit() {
    if (this.learningResources().length === 3) {
      this.hasReachedContentLimit.set(true);
      this.contentControl.disable();
      this.urlControl.disable();
      return;
    }

    this.hasReachedContentLimit.set(false);
    this.contentControl.enable();
    this.urlControl.enable();
  }

  private patchForm() {
    if (this.customSettings()) {
      if (this.customSettings().start_date || this.customSettings().end_date) {
        this.hasSchedule.set(true);
      }

      this.form().patchValue(this.customSettings());
      this.learningResources().push(...this.form().get('learning_resources').value);
      this.verifyContentLimit();
      return;
    }

    this.form().reset();
    this.learningResources.set([]);
  }

  private configureScheduleToggle() {
    effect(() => {
      if (this.hasSchedule()) {
        this.form().get('start_date').enable();
        this.form().get('end_date').enable();
        return;
      }

      this.form().get('start_date').disable();
      this.form().get('end_date').disable();
      this.form().get('start_date').setValue(null);
      this.form().get('end_date').setValue(null);
    });
  }
}
