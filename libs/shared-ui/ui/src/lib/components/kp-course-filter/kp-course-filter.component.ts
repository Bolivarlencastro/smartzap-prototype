import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { KpFilterComponent, MenuFilterItem, QuickFilterType } from '../kp-filter';
import { KpMobileToggleComponent } from '../kp-mobile-toggle';
import { KpSelectMenuTriggerComponent, KpSelectTriggerContentDirective } from '../kp-select-menu';
import { CourseFilter, CourseForm } from './models';
import { KpLanguageColorTagComponent } from '../kp-language-color-tag/kp-language-color-tag.component';
import { KpCategoryLabelPipe } from '../../pipes/kp-category-label/kp-category-label.pipe';

@Component({
  selector: 'kp-course-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    KpFilterComponent,
    KpMobileToggleComponent,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    MatIconModule,
    MatSelectModule,
    KpLanguageColorTagComponent,
    KpCategoryLabelPipe,
  ],
  templateUrl: './kp-course-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpCourseFilterComponent implements OnInit, OnDestroy {
  @Input() quickFilter: QuickFilterType;
  @Input() isContentCreator: boolean;

  @Input() set languages(value: MenuFilterItem[]) {
    if (!value) {
      return;
    }
    this.setFormControlValue('languages', this.getCheckedValues(value));
    this.languageOptions = value;
  }

  @Input() set categories(value: MenuFilterItem[]) {
    if (!value) {
      return;
    }
    this.setFormControlValue('categories', this.getCheckedValues(value));
    this.categoryOptions = value;
  }

  @Input() set providers(value: MenuFilterItem[]) {
    if (!value) {
      return;
    }
    this.setFormControlValue('providers', this.getCheckedValues(value));
    this.providerOptions = value;
  }

  @Output() quickFilterChanged = new EventEmitter<QuickFilterType>();
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() saveFilter = new EventEmitter<CourseFilter>();

  languageOptions: MenuFilterItem[];
  categoryOptions: MenuFilterItem[];
  providerOptions: MenuFilterItem[];

  readonly filterForm: FormGroup<CourseForm>;
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

  changeQuickFilter(quickFilter: QuickFilterType): void {
    this.quickFilter = this.quickFilter === quickFilter ? QuickFilterType.HOME : quickFilter;
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
      categories: [null],
      providers: [null],
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
