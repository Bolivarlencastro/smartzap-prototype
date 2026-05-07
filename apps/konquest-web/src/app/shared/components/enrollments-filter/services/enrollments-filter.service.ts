import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MissionCategory, MissionInstructor } from '@app/main/mission/mission.model';
import { KonquestAPI } from '@core/api';
import { Paginated, Pagination } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpFilterOption, KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { map } from 'rxjs';
import { enrollmentsFilterOptions } from '../containers/enrollments-filter-modal/enrollments-filter-modal-options';
import { EnrollmentsFilterModalComponent } from '../containers/enrollments-filter-modal/enrollments-filter-modal.component';
import {
  EnrollmentFilter,
  EnrollmentFilterResult,
  EnrollmentFiltersSearch,
  EnrollmentType,
} from '../model/enrollment-filter';

@Injectable({ providedIn: 'root' })
export class EnrollmentsFilterService {
  constructor(
    private readonly dialog: MatDialog,
    private readonly konquestApi: KonquestAPI,
  ) {}

  public static parseFilter(filter: EnrollmentFilter): EnrollmentFilter {
    return {
      ...filter,
      performance__gte: EnrollmentsFilterService.convertToPercent(filter.performance__gte),
      performance__lte: EnrollmentsFilterService.convertToPercent(filter.performance__lte),
      mission_category: EnrollmentsFilterService.normalizeAutoCompleteOptions(
        filter.mission_category as KpFilterSelectOption[],
      ),
      instructor: EnrollmentsFilterService.normalizeAutoCompleteOptions(filter.instructor as KpFilterSelectOption[]),
    };
  }

  private static normalizeAutoCompleteOptions(options: KpFilterSelectOption[]) {
    return options?.map((option: KpFilterSelectOption) => option.value as string);
  }

  private static convertToPercent(value: string): string | null {
    const parsedValue = parseInt(value ?? '', 10);

    if (isNaN(parsedValue)) {
      return null;
    }

    return (parsedValue / 100).toString();
  }

  openFiltersDialog(type: EnrollmentType) {
    return this.dialog
      .open<EnrollmentsFilterModalComponent, any, EnrollmentFilterResult>(EnrollmentsFilterModalComponent, {
        minWidth: '400px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
        data: { filterOptions: this.getFilterOptions(type), type },
      })
      .afterClosed();
  }

  getFilterOptions(type: EnrollmentType): KpFilterOption[] {
    return enrollmentsFilterOptions(type, this.getStatusOptions(type));
  }

  getStatusOptions(type: EnrollmentType): KpFilterSelectOption[] {
    const options = [
      { value: 'COMPLETED', label: 'ENROLLMENT.STATUS.COMPLETED' },
      { value: 'ENROLLED', label: 'ENROLLMENT.STATUS.ENROLLED' },
      { value: 'GIVE_UP', label: 'ENROLLMENT.STATUS.GIVE_UP' },
      { value: 'REPROVED', label: 'ENROLLMENT.STATUS.REPROVED' },
      { value: 'STARTED', label: 'ENROLLMENT.STATUS.STARTED' },
    ];

    if (type !== 'LEARNING_TRAIL') {
      options.push(
        ...[
          { value: 'EXPIRED', label: 'ENROLLMENT.STATUS.EXPIRED' },
          { value: 'INACTIVATED', label: 'ENROLLMENT.STATUS.INACTIVATED' },
          { value: 'PENDING_VALIDATION', label: 'ENROLLMENT.STATUS.PENDING_VALIDATION' },
          { value: 'REFUSED', label: 'ENROLLMENT.STATUS.REFUSED' },
          { value: 'REQUEST_EXTENSION', label: 'ENROLLMENT.STATUS.REQUEST_EXTENSION' },
        ],
      );
    }
    return options;
  }

  getSelectOptions({ search, searchType }: EnrollmentFiltersSearch) {
    switch (searchType) {
      case 'categories':
        return this.fetchCategories(search);
      case 'instructors':
        return this.fetchInstructors(search);
    }
  }

  private fetchCategories(search: string) {
    return this.konquestApi
      .get<Pagination<MissionCategory>>('/missions/categories', { search })
      .pipe(map(this.mapCategoriesToOptions));
  }

  private fetchInstructors(search: string) {
    return this.konquestApi
      .get<Paginated<MissionInstructor>>('/accounts/users/instructors', { search })
      .pipe(map(this.mapInstructorsToOptions));
  }

  private mapCategoriesToOptions(response: Pagination<MissionCategory>): KpFilterSelectOption[] {
    const { results } = response;
    return results.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  }

  private mapInstructorsToOptions(response: Paginated<MissionInstructor>): KpFilterSelectOption[] {
    const { data } = response;
    return data.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  }
}
