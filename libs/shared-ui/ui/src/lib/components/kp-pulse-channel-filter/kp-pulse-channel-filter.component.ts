import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { KpFilterComponent, MenuFilterItem, QuickFilterType } from '../kp-filter';
import { KpMobileToggleComponent } from '../kp-mobile-toggle';
import { KpSelectMenuTriggerComponent, KpSelectTriggerContentDirective } from '../kp-select-menu';
import { PulseChannelFilter, PulseChannelForm } from './models';
import { KpLanguageColorTagComponent } from '../kp-language-color-tag/kp-language-color-tag.component';
import { KpCategoryLabelPipe, KpContentIconColorPipe } from '../../pipes';

@Component({
  selector: 'kp-pulse-channel-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslocoModule,
    KpFilterComponent,
    KpMobileToggleComponent,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    MatButtonToggleModule,
    MatIconModule,
    MatSelectModule,
    KpLanguageColorTagComponent,
    KpCategoryLabelPipe,
    KpContentIconColorPipe,
  ],
  templateUrl: './kp-pulse-channel-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpPulseChannelFilterComponent implements OnInit, OnDestroy {
  @Input() quickFilter: QuickFilterType;
  @Input() currentSearchTerm: string;

  @Input() set categories(value: MenuFilterItem[]) {
    if (!value) {
      return;
    }
    this.setFormControlValue('categories', this.getCheckedValues(value));
    this.categoryOptions = value;
  }

  @Input() set contentTypes(value: MenuFilterItem[]) {
    if (!value) {
      return;
    }
    this.setFormControlValue('contentTypes', this.getCheckedValues(value));
    this.contentTypeOptions = value;
  }

  @Input() set languages(value: MenuFilterItem[]) {
    if (!value) {
      return;
    }
    this.setFormControlValue('languages', this.getCheckedValues(value));
    this.languageOptions = value;
  }

  @Input() set favorites(value: boolean) {
    this.setFormControlValue('favorites', value);
  }

  @Input() set subscribedChannels(value: boolean) {
    this.setFormControlValue('subscribedChannels', value);
  }

  @Output() quickFilterChanged = new EventEmitter<QuickFilterType>();
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() saveFilter = new EventEmitter<PulseChannelFilter>();

  categoryOptions: MenuFilterItem[];
  contentTypeOptions: MenuFilterItem[];
  languageOptions: MenuFilterItem[];

  get favoritesValue(): boolean {
    return this.filterForm?.get('favorites').value;
  }

  get subscribedChannelsValue(): boolean {
    return this.filterForm?.get('subscribedChannels').value;
  }

  readonly filterForm: FormGroup<PulseChannelForm>;
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

  changeQuickFilter(mineType?: boolean): void {
    if (mineType) {
      this.quickFilter = this.quickFilter === QuickFilterType.MINE ? QuickFilterType.HOME : QuickFilterType.MINE;
    }
    this.quickFilterChanged.emit(this.quickFilter);
  }

  searchTerm(term: string): void {
    this.searchTermChanged.emit(term);
  }

  filter(): void {
    const value = this.filterForm.getRawValue();
    this.saveFilter.emit(value);
  }

  changeToggleButton(controlName: 'favorites' | 'subscribedChannels'): void {
    const value = !this.filterForm.get(controlName).value;
    this.filterForm.get(controlName).setValue(value);
  }

  private buildForm(fb: FormBuilder): FormGroup {
    return fb.group({
      categories: [null],
      languages: [null],
      contentTypes: [null],
      favorites: [null],
      subscribedChannels: [null],
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
