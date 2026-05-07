import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import {
  FilterGroupAutoCompleteSelectComponent,
  FilterGroupConfig,
  FilterGroupSelectOption,
  FilterGroupType,
  FilterGroupValue,
  FilterValue,
  KpReportFilterDialogComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-report-filter-dialog';
import { Observable, Subject, Subscription, switchMap } from 'rxjs';
import { debounceTime, filter, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { userDetailFilterConfiguration, usersOverviewConfiguration } from './user-filter-configuration';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import {
  AnalyticsApiUsersFilter,
  MyAccountV2Client,
  MyAccountV2Pagination,
  User,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KonquestApiClient } from '@core/api';
import { format, isDate } from 'date-fns';

export type UserFilterType = 'overview' | 'details';

interface FilterSubject {
  filterValue: string;
  fetchMethod: FilterFetchMethod;
  autocompleteComponent: FilterGroupAutoCompleteSelectComponent;
}

type FilterFetchMethod = 'leader' | 'course_category';
type RequestFilterType = Record<string, string | Record<string, unknown> | string[]>;

@Injectable()
export class UserFilterService implements OnDestroy {
  private readonly simpleFilterSubject = new Subject<FilterSubject>();
  private readonly simpleFilter$ = this.simpleFilterSubject.asObservable();
  private filterSubscription = new Subscription();
  private dialogSubscription = new Subscription();

  constructor(
    private _dialog: MatDialog,
    private _translateService: TranslocoService,
    private _fuseLoadingService: FuseLoadingService,
    private _myAccountApi: MyAccountV2Client,
    private _konquestApi: KonquestApiClient,
  ) {
    this.filterSubscription.add(this.subscribeToSimpleFilterCallback());
  }

  private _currentRawFilter: FilterValue | undefined;
  private _currentNormalizedFilter: AnalyticsApiUsersFilter;

  openFilters(type: UserFilterType): Observable<FilterValue> {
    const filterDialog: MatDialogRef<KpReportFilterDialogComponent, FilterValue | undefined> = this._dialog.open(
      KpReportFilterDialogComponent,
      {
        width: '720px',
        data: {
          title: this._translateService.translate('GENERAL.FILTER'),
          positiveButtonLabel: this._translateService.translate('GENERAL.SEARCH'),
          selectors: this.updateFilterOptions(this.getFilterConfiguration(type)),
          currentFilter: this._currentRawFilter,
        },
      },
    );

    return filterDialog.afterClosed().pipe(
      filter((result) => !!result),
      tap((result) => {
        this.storeCurrentFilter(result);
        this.normalizeFilterToRequest(result);
      }),
    );
  }

  getCurrentFilter() {
    return this._currentNormalizedFilter;
  }

  private updateFilterOptions(filterOptions: FilterGroupConfig[]): FilterGroupConfig[] {
    return filterOptions
      .filter((config) => !config.disabled)
      .map((config: FilterGroupConfig) => ({
        ...config,
        label: this._translateService.translate(config.label),
        options: config.options?.map((option) => ({
          ...option,
          label: this._translateService.translate(option.label),
        })),
        autocompleteCallback: this.getConfigCallback(config),
      }));
  }

  private getFilterConfiguration(filterType: UserFilterType) {
    return filterType === 'details' ? userDetailFilterConfiguration : usersOverviewConfiguration;
  }

  private getConfigCallback(config: FilterGroupConfig): (() => void) | undefined {
    if (config.type !== FilterGroupType.AUTOCOMPLETE_SELECT) {
      return undefined;
    }

    const callbackMap: Record<FilterFetchMethod, any> = {
      leader: this.usersLeaderCallBack,
      course_category: this.categoriesCallBack,
    };

    return callbackMap[config.value as FilterFetchMethod];
  }

  private subscribeToSimpleFilterCallback(): Subscription {
    return this.simpleFilter$
      .pipe(
        debounceTime(300),
        tap(() => this._fuseLoadingService.show()),
        switchMap(({ filterValue, fetchMethod, autocompleteComponent }) =>
          this.fetchOptions(filterValue, fetchMethod).pipe(
            map((results: FilterGroupSelectOption[]) => ({ autocompleteComponent, results })),
            tap(() => this._fuseLoadingService.hide()),
          ),
        ),
      )
      .subscribe(
        ({
          autocompleteComponent,
          results,
        }: {
          autocompleteComponent: FilterGroupAutoCompleteSelectComponent;
          results: FilterGroupSelectOption[];
        }) => autocompleteComponent.setValues(results),
      );
  }

  private fetchOptions(search: string, fetchMethod: FilterFetchMethod): Observable<FilterGroupSelectOption[]> {
    const queryMap: Record<FilterFetchMethod, Observable<FilterGroupSelectOption[]>> = {
      leader: this.searchUserLeaders(search),
      course_category: this.searchCategories(search),
    };

    return queryMap[fetchMethod];
  }

  private searchUserLeaders = (search: string): Observable<FilterGroupSelectOption[]> => {
    const params = { search, limit: 10, 'filter.roles.role.id': '$in:6a2b41b4-54c2-40d1-a587-cf25ab284aa0' };
    return this._myAccountApi.get<MyAccountV2Pagination<User>>(`/users`, params).pipe(
      mergeMap((response) => response.data || []),
      map(({ name, id }) => ({ label: name, value: id })),
      toArray(),
    );
  };

  private usersLeaderCallBack = (
    filterValue: string,
    autocompleteComponent: FilterGroupAutoCompleteSelectComponent,
  ): void => {
    this.simpleFilterSubject.next({ filterValue, autocompleteComponent, fetchMethod: 'leader' });
  };

  private categoriesCallBack = (
    filterValue: string,
    autocompleteComponent: FilterGroupAutoCompleteSelectComponent,
  ): void => {
    this.simpleFilterSubject.next({ filterValue, autocompleteComponent, fetchMethod: 'course_category' });
  };

  private searchCategories = (query: string): Observable<FilterGroupSelectOption[]> => {
    return this._konquestApi.getCategories(query).pipe(
      mergeMap(({ results }: { results: { name: string; id: string }[] }) => results),
      map(({ name, id }) => ({ label: name, value: id })),
      toArray(),
    );
  };

  private storeCurrentFilter(filterValue: FilterValue): void {
    this._currentRawFilter = filterValue;
  }

  private normalizeFilterToRequest(filterValue: FilterValue): void {
    const result: RequestFilterType = {};
    const autoCompleteSelectors = ['leader', 'course_category'];
    const dateRangeSelectors = ['start_date', 'end_date'];
    const rangeSelectors = ['completion_rate', 'performance'];

    if (!filterValue) {
      return undefined;
    }

    filterValue.forEach((filter) => {
      if (filter.value === undefined || filter.value === null) {
        return;
      }

      if (autoCompleteSelectors.includes(filter.selector)) {
        result[filter.selector] = this.mapAutoCompleteOptions(filter.value);
        return;
      }

      if (rangeSelectors.includes(filter.selector)) {
        this.setRangeValues(filter, result);
        return;
      }

      if (dateRangeSelectors.includes(filter.selector)) {
        this.setDateRangeValues(filter, result);
        return;
      }

      result[filter.selector] = filter.value;
    });

    this._currentNormalizedFilter = result;
  }

  private mapAutoCompleteOptions(selectedOptions: FilterGroupSelectOption[] | FilterGroupSelectOption): string[] {
    if (Array.isArray(selectedOptions)) {
      return selectedOptions?.map((option) => option.value);
    }
    return [selectedOptions.value];
  }

  private setDateRangeValues(
    filterValue: FilterGroupValue,
    result: Record<string, string | Record<string, unknown> | string[]>,
  ): void {
    const { start, end } = filterValue.value;
    const formattedStart = this.formatDate(start);
    const formattedEnd = this.formatDate(end);

    if (formattedStart) {
      result[`${filterValue.selector}_min`] = formattedStart;
    }
    if (formattedEnd) {
      result[`${filterValue.selector}_max`] = formattedEnd;
    }
  }

  private formatDate(date: string): string | null {
    const parsed = new Date(date);
    if (!isDate(parsed)) {
      return null;
    }

    return format(parsed, 'yyyy-MM-dd');
  }

  private setRangeValues(
    filterValue: FilterGroupValue,
    result: Record<string, string | Record<string, unknown> | string[]>,
  ): void {
    const { from, to } = filterValue.value;
    result[`${filterValue.selector}_min`] = from;
    result[`${filterValue.selector}_max`] = to;
  }

  ngOnDestroy() {
    this.filterSubscription?.unsubscribe();
    this.dialogSubscription?.unsubscribe();
  }
}
