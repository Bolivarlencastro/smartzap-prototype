import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import {
  ContentStep,
  CreateLearnContentEvent,
  LearningTrail,
  TrailLearnContent,
} from 'app/main/learning-trail/model/learning-trail';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatListItemIcon } from '@angular/material/list';

@Component({
  selector: 'learning-trail-step-content',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    TranslocoModule,
    MatAccordion,
    MatButtonModule,
    MatInputModule,
    MatExpansionPanel,
    CdkDropList,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    CdkDrag,
    CdkDragHandle,
    MatProgressSpinner,
    MatListItemIcon,
  ],
  templateUrl: './learning-trail-step-content.component.html',
})
export class LearningTrailStepContentComponent implements OnInit, OnChanges {
  @Input() isLoadingContents = false;
  @Input() contentOptions!: TrailLearnContent[];
  @Input() learningTrail!: LearningTrail;

  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() loadContents = new EventEmitter<string>();
  @Output() createContent = new EventEmitter<CreateLearnContentEvent>();
  @Output() removeContent = new EventEmitter<string>();
  @Output() dropContentEvent = new EventEmitter<{
    contents: ContentStep[];
    id: string;
    order: number;
  }>();

  @ViewChild('f', { static: true }) form!: NgForm;

  formGroup!: UntypedFormGroup;

  contents: ContentStep[] = [];
  stepSelected!: number;
  defaultUserAvatar: string;

  constructor(
    private _dialog: MatDialog,
    private _formBuilder: UntypedFormBuilder,
  ) {
    this.formGroup = this._formBuilder.group({
      name: '',
    });
    this.defaultUserAvatar = environment.defaultUserAvatar;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['learningTrail'] && this.learningTrail?.steps) {
      this.contents = this.learningTrail.steps
        .map((step) => {
          return {
            learningTrailContentId: step.id,
            ...(!!step.mission && step.mission),
            ...(!!step.pulse && step.pulse),
            order: step.order,
          };
        })
        .sort((a, b) => a.order - b.order);
    }
  }

  ngOnInit(): void {
    this.formGroup
      .get('name')
      ?.valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        map((text) => (typeof text === 'string' ? text.toLowerCase() : '')),
      )
      .subscribe((search: string) => {
        this.loadContents.emit(search);
      });
  }

  displayFn(content: any): string {
    return content?.name ? content.name : '';
  }

  onCreateContent(): void {
    const order = this.contents.length + 1;
    const inputValue = this.formGroup.get('name')?.value;

    if (inputValue && typeof inputValue !== 'string') {
      const data = { ...inputValue, order };
      this.createContent.emit(data);
      this.formGroup.get('name')?.reset();
      this.stepSelected = this.contents.length;
    }
  }

  onRemoveContent({ learningTrailContentId }: ContentStep): void {
    const dialogRefConfirm = this._dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRefConfirm.componentInstance.confirmMessage = marker('LEARNING_TRAIL.STEP.DELETE_CONTENT_MESSAGE');
    dialogRefConfirm.componentInstance.confirmTitle = marker('LEARNING_TRAIL.STEP.DELETE_CONTENT_TITLE');
    dialogRefConfirm.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    dialogRefConfirm
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() => this.removeContent.emit(learningTrailContentId)),
      )
      .subscribe();
  }

  drop(event: CdkDragDrop<any[]>): void {
    const { previousIndex, currentIndex } = event;

    moveItemInArray(this.contents, previousIndex, currentIndex);

    this.dropContentEvent.emit({
      contents: this.contents,
      id: this.contents[previousIndex].learningTrailContentId,
      order: currentIndex,
    });
  }

  onPrevious(): void {
    this.previous.emit();
  }

  onNext(): void {
    this.next.emit();
  }

  setStep(index: number): void {
    this.stepSelected = index;
  }
}
