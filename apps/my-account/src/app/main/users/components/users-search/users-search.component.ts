import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSearchFilter, UserSearchFilterForm, UserSearchFilterOption } from '@app/shared/model';
import {
  KpTableColumnsComponent,
  loadFormValuesFromLocalStorage,
  saveFormValuesToLocalStorage,
  TableColumn,
  TableColumnForm,
} from '@keeps-platform-frontend-workspace/ui/kp-table-columns';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { map } from 'rxjs';
import { UserFilterLists } from '../../users.types';
import {
  KpSelectMenuTriggerComponent,
  KpSelectTriggerContentDirective,
} from '@keeps-platform-frontend-workspace/ui/kp-select-menu';
import { MatOptgroup, MatOption, MatSelect } from '@angular/material/select';

import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    KpSelectMenuTriggerComponent,
    MatSelect,
    KpSelectTriggerContentDirective,
    MatOption,
    MatOptgroup,
    KpTableColumnsComponent,
    MatSlideToggle,
    TranslocoPipe,
    MatSelectSearchComponent,
  ],
})
export class UsersSearchComponent implements AfterViewInit {
  private readonly KEY_USER_TABLE_COLUMN = 'KEY_USER_TABLE_COLUMN';
  private readonly destroyRef = inject(DestroyRef);
  private readonly fixedColumns = ['select', 'name', 'status'];

  filterLists = input<UserFilterLists>();
  filterChanged = output<UserSearchFilter>();
  displayedColumnsChanged = output<string[]>();

  filterForm: FormGroup<UserSearchFilterForm>;

  columnForm: FormGroup<TableColumnForm>;
  columnDefinitions = [
    { def: 'select', label: marker('GENERAL.SELECTION') },
    { def: 'name', label: marker('GENERAL.NAME') },
    { def: 'email', label: marker('GENERAL.EMAIL') },
    { def: 'phone', label: marker('GENERAL.PHONE') },
    { def: 'jobPosition', label: marker('GENERAL.JOB') },
    { def: 'activityArea', label: marker('GENERAL.AREA') },
    { def: 'directorate', label: marker('GENERAL.DIRECTORATE') },
    { def: 'subdirectorate', label: marker('GENERAL.SUBDIRECTORATE') },
    { def: 'leader', label: marker('GENERAL.LEADER') },
    { def: 'permissions', label: marker('GENERAL.PERMISSIONS') },
    { def: 'status', label: marker('GENERAL.STATUS') },
  ];

  protected readonly isJobPositionFilterDisabled = computed(() => !this.filterLists()?.jobPositions?.length);
  protected readonly isAreaFilterDisabled = computed(() => !this.filterLists()?.activityAreas?.length);
  protected readonly isDirectorFilterDisabled = computed(() => !this.filterLists()?.directors?.length);
  protected readonly isManagerFilterDisabled = computed(() => !this.filterLists()?.managers?.length);

  protected readonly jobPositionSearchCtrl = new FormControl('');
  protected readonly activityAreaSearchCtrl = new FormControl('');
  protected readonly directorSearchCtrl = new FormControl('');
  protected readonly managerSearchCtrl = new FormControl('');
  protected readonly leaderSearchCtrl = new FormControl('');

  private readonly jobPositionSearch = toSignal(this.jobPositionSearchCtrl.valueChanges, { initialValue: '' });
  private readonly activityAreaSearch = toSignal(this.activityAreaSearchCtrl.valueChanges, { initialValue: '' });
  private readonly directorSearch = toSignal(this.directorSearchCtrl.valueChanges, { initialValue: '' });
  private readonly managerSearch = toSignal(this.managerSearchCtrl.valueChanges, { initialValue: '' });
  private readonly leaderSearch = toSignal(this.leaderSearchCtrl.valueChanges, { initialValue: '' });

  protected readonly filteredJobPositions = computed(() =>
    this.filterOptions(this.filterLists()?.jobPositions ?? [], this.jobPositionSearch() ?? ''),
  );

  protected readonly filteredActivityAreas = computed(() =>
    this.filterStrings(this.filterLists()?.activityAreas ?? [], this.activityAreaSearch() ?? ''),
  );

  protected readonly filteredDirectors = computed(() =>
    this.filterStrings(this.filterLists()?.directors ?? [], this.directorSearch() ?? ''),
  );

  protected readonly filteredManagers = computed(() =>
    this.filterStrings(this.filterLists()?.managers ?? [], this.managerSearch() ?? ''),
  );

  protected readonly filteredLeaders = computed(() =>
    this.filterOptions(this.filterLists()?.leaders ?? [], this.leaderSearch() ?? ''),
  );

  constructor(private fb: FormBuilder) {
    this.filterForm = this.buildFilterForm(fb);
    this.columnForm = this.buildColumnForm(fb);
    this.listenToChanges();
  }

  ngAfterViewInit(): void {
    this.initializeDisplayedColumnsObservable();
  }

  private buildFilterForm(fb: FormBuilder): FormGroup<UserSearchFilterForm> {
    return fb.group<UserSearchFilterForm>({
      roleId: new FormControl(null),
      status: new FormControl(null),
      jobPositions: new FormControl(null),
      activityAreas: new FormControl(null),
      directors: new FormControl(null),
      managers: new FormControl(null),
      leaders: new FormControl(null),
    });
  }

  private listenToChanges(): void {
    this.filterForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.filterChanged.emit(this.filterForm.getRawValue());
    });
  }

  private buildColumnForm(fb: FormBuilder): FormGroup<TableColumnForm> {
    const formGroup: Record<string, FormControl> = {};

    this.columnDefinitions.forEach((column) => {
      formGroup[column.def] = new FormControl({
        value: true,
        disabled: this.fixedColumns.includes(column.def),
      });
    });

    const form = fb.group(formGroup);
    loadFormValuesFromLocalStorage(form, this.KEY_USER_TABLE_COLUMN);

    return form;
  }

  private initializeDisplayedColumnsObservable(): void {
    this.columnForm.valueChanges
      .pipe(
        map(() => {
          const values = this.columnForm.getRawValue();
          saveFormValuesToLocalStorage(values, this.KEY_USER_TABLE_COLUMN);
          return this.parsedValues(values);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => this.displayedColumnsChanged.emit(result));

    this.columnForm.updateValueAndValidity({ emitEvent: true });
  }

  private parsedValues(values: TableColumn) {
    return this.columnDefinitions.filter((column) => values[column.def]).map((column) => column.def);
  }

  private filterStrings(list: string[], term: string): string[] {
    if (!term) {
      return list;
    }
    const lower = term.toLowerCase();
    return list.filter((item) => item.toLowerCase().includes(lower));
  }

  private filterOptions(list: UserSearchFilterOption[], term: string): UserSearchFilterOption[] {
    if (!term) {
      return list;
    }
    const lower = term.toLowerCase();
    return list.filter((item) => item.label.toLowerCase().includes(lower));
  }
}
