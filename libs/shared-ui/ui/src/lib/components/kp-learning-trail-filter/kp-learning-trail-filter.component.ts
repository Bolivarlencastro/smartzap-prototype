import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { KpFilterComponent, MenuFilterItem, QuickFilterType } from '../kp-filter';
import { KpMobileToggleComponent } from '../kp-mobile-toggle';
import { KpSelectMenuTriggerComponent, KpSelectTriggerContentDirective } from '../kp-select-menu';
import { LearningTrailFilter, LearningTrailForm } from './models';
import { KpLanguageColorTagComponent } from '../kp-language-color-tag';

@Component({
  selector: 'kp-learning-trail-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslocoModule,
    KpFilterComponent,
    KpMobileToggleComponent,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    MatIconModule,
    MatSelectModule,
    KpLanguageColorTagComponent,
  ],
  templateUrl: './kp-learning-trail-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpLearningTrailFilterComponent implements OnInit, OnDestroy {
  @Input() quickFilter: QuickFilterType;
  @Input() isContentCreator: boolean;

  @Input() set languages(value: MenuFilterItem[]) {
    if (!value) {
      return;
    }
    this.setFormControlValue('languages', this.getCheckedValues(value));
    this.languageOptions = value;
  }

  @Output() quickFilterChanged = new EventEmitter<QuickFilterType>();
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() saveFilter = new EventEmitter<LearningTrailFilter>();

  languageOptions: MenuFilterItem[];

  readonly filterForm: FormGroup<LearningTrailForm>;
  readonly quickFilterType = QuickFilterType;
  private unsubscribe$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
    this.filterForm = this.buildForm(formBuilder);
  }

  ngOnInit(): void {
    this.listenToChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeQuickFilter(): void {
    this.quickFilter =
      this.quickFilter === QuickFilterType.MINE ? QuickFilterType.LEARNING_TRAILS : QuickFilterType.MINE;
    this.quickFilterChanged.emit(this.quickFilter);
  }

  searchTerm(term: string): void {
    this.searchTermChanged.emit(term);
  }

  filter(): void {
    const value = this.filterForm.getRawValue();
    this.saveFilter.emit(value);
  }

  private buildForm(fb: FormBuilder): FormGroup {
    return fb.group({
      languages: [null],
    });
  }

  private getCheckedValues(value: MenuFilterItem[]): string[] {
    return value.filter((v) => v.checked)?.map((v) => v.id || v.name);
  }

  private listenToChanges(): void {
    this.filterForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.filter());
  }

  private setFormControlValue(controlName: string, value: any): void {
    this.filterForm.get(controlName).setValue(value, { emitEvent: false });
  }
}
