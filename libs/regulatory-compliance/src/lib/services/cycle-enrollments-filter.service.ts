import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ComplianceDto,
  EnrollmentsCyclesFilter,
  LearningObjectDto,
  RegulatoryComplianceApi,
  User,
  UsersV2Api,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { format, isDate } from 'date-fns';
import { map, Observable } from 'rxjs';
import { CycleEnrollmentsFilterComponent } from '../containers';
import { CycleEnrollmentsFilterACType, CycleEnrollmentsFilterResult, RawCycleEnrollmentsFilter } from '../models';

const DEFAULT_FILTER = { page: 1, perPage: 15 };

@Injectable()
export class CycleEnrollmentsFilterService {
  constructor(
    private dialog: MatDialog,
    private regulatoryComplianceApi: RegulatoryComplianceApi,
    private usersV2Api: UsersV2Api,
  ) {}

  openFiltersDialog() {
    return this.dialog
      .open<CycleEnrollmentsFilterComponent, any, CycleEnrollmentsFilterResult>(CycleEnrollmentsFilterComponent, {
        minWidth: '400px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
      })
      .afterClosed();
  }

  filterAutocomplete(filterType: CycleEnrollmentsFilterACType, search: string): Observable<KpFilterSelectOption[]> {
    const filterFunctions: Record<
      CycleEnrollmentsFilterACType,
      (search: string) => Observable<KpFilterSelectOption[]>
    > = {
      normatives: this.filterNormatives,
      leaders: this.filterUsers,
      users: this.filterUsers,
      learningObjects: this.filterLearningObjects,
    };

    return filterFunctions[filterType].call(this, search);
  }

  normalizeFilter(result: CycleEnrollmentsFilterResult): EnrollmentsCyclesFilter {
    const normalizedAutocompletes = this.normalizeAutocompletes(result.filter);
    const normalizedDates = this.normalizeDates(result.filter);

    return {
      ...normalizedAutocompletes,
      ...normalizedDates,
      ...(result.filter?.status?.length && { status: result.filter?.status }),
    };
  }

  private normalizeAutocompletes(filter: RawCycleEnrollmentsFilter) {
    const mappableEntities: (keyof RawCycleEnrollmentsFilter)[] = [
      'complianceId',
      'learningObjectId',
      'userId',
      'relatedUserLeaderId',
    ];
    const updatedFilter: Record<string, string> = {};

    mappableEntities.forEach((key) => {
      const value = filter[key];
      if (value && this.isKpSelectOption(value)) {
        updatedFilter[key] = value.value as string;
      }
    });

    return updatedFilter as Partial<EnrollmentsCyclesFilter>;
  }

  private normalizeDates(filter: RawCycleEnrollmentsFilter) {
    const mappableEntities: (keyof RawCycleEnrollmentsFilter)[] = ['deadline', 'deadlineGte', 'deadlineLte'];
    const updatedFilter: Record<string, string> = {};

    mappableEntities.forEach((key) => {
      const value = filter[key];
      if (value && isDate(value)) {
        updatedFilter[key] = format(value as Date, 'yyyy-MM-dd');
      }
    });

    return updatedFilter as Partial<EnrollmentsCyclesFilter>;
  }

  private isKpSelectOption(value: any): value is KpFilterSelectOption {
    return typeof value === 'object' && 'value' in value;
  }

  private filterNormatives(search: string): Observable<KpFilterSelectOption[]> {
    return this.regulatoryComplianceApi
      .getCompliances({ search, ...DEFAULT_FILTER })
      .pipe(map((response) => this.mapToKpFilterSelectOption(response.items)));
  }

  private filterUsers(search: string): Observable<KpFilterSelectOption[]> {
    const params = { search, 'filter.roles.role.application.id': '$in:0abf08ea-d252-4d7c-ab45-ab3f9135c288' };
    return this.usersV2Api.fetchByQuery(params).pipe(map(({ data }) => this.mapToKpFilterSelectOption(data)));
  }

  private filterLearningObjects(search: string): Observable<KpFilterSelectOption[]> {
    return this.regulatoryComplianceApi
      .getLearningObjects({ search, ...DEFAULT_FILTER })
      .pipe(map((response) => this.mapLearningObjectToKpFilterSelectOption(response.items)));
  }

  private mapToKpFilterSelectOption(items: ComplianceDto[] | User[]): KpFilterSelectOption[] {
    return items.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }

  private mapLearningObjectToKpFilterSelectOption(items: LearningObjectDto[]): KpFilterSelectOption[] {
    return items.map((item) => ({
      label: item.name,
      value: item.id,
      meta: item.learningObjectTypeId,
    }));
  }
}
