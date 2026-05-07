import { Component, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { MatIcon } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { Sort } from '@angular/material/sort';
import { Enrollment } from 'app/main/courses/model';
import { EnrollmentsActions } from '../../store/actions';
import { EnrollmentsStatistics } from '../../store/reducers/enrollments.reducer';
import * as fromSelectors from '../../store/selectors';
import { EnrollmentFilter } from 'app/shared/services/enrollments.service';
import { EnrollmentsFilterComponent } from '../../components/enrollments-filter/enrollments-filter.component';
import { EnrollmentsListComponent } from '../../components/enrollments-list/enrollments-list.component';
import { EnrollmentsSideMenuComponent } from '../../components/enrollments-side-menu/enrollments-side-menu.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpTableLayoutComponent } from 'libs/shared-ui/ui/src/lib/components/kp-table-layout';

@Component({
  selector: 'app-settings-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.scss'],
  imports: [
    MatDrawerContainer,
    MatDrawer,
    EnrollmentsSideMenuComponent,
    MatIconButton,
    MatIcon,
    KpTableLayoutComponent,
    EnrollmentsFilterComponent,
    EnrollmentsListComponent,
    TranslocoPipe,
  ],
})
export class SettingsEnrollmentsComponent implements OnDestroy {
  enrollments = toSignal<Enrollment[] | null>(this.store.select(fromSelectors.selectAll), { initialValue: null });
  pagination = toSignal(this.store.select(fromSelectors.selectPagination));
  isLoading = toSignal(this.store.select(fromSelectors.selectIsLoading), { initialValue: false });
  statistics = toSignal<EnrollmentsStatistics | null>(this.store.select(fromSelectors.selectStatistics), {
    initialValue: null,
  });
  filters = toSignal(this.store.select(fromSelectors.selectFilter), { initialValue: {} as EnrollmentFilter });

  constructor(private store: Store) {
    this.store.dispatch(EnrollmentsActions.loadEnrollmentsAndStatistics());
  }

  ngOnDestroy() {
    this.store.dispatch(EnrollmentsActions.resetState());
  }

  onPageChanged(event: PageEvent): void {
    const { pageSize: perPage, pageIndex } = event;
    const page = pageIndex + 1;
    this.store.dispatch(EnrollmentsActions.setPagination({ payload: { page, perPage } }));
  }

  onSortChanged(event: Sort): void {
    const { active: field, direction } = event;
    this.store.dispatch(EnrollmentsActions.setSort({ payload: { field, direction } }));
  }

  onDeleteEnrollment({ id }: Enrollment): void {
    if (id) {
      this.store.dispatch(EnrollmentsActions.deleteEnrollment({ payload: { id } }));
    }
  }

  onCancelEnrollment({ id }: Enrollment): void {
    if (id) {
      this.store.dispatch(EnrollmentsActions.cancelEnrollment({ payload: { id } }));
    }
  }

  onReenroll(enrollment: Enrollment): void {
    this.store.dispatch(
      EnrollmentsActions.reenroll({ payload: { courseId: enrollment.course_id, userId: enrollment.user_id } }),
    );
  }

  onOpenActivities(enrollment: Enrollment): void {
    this.store.dispatch(EnrollmentsActions.openEnrollmentActivities({ payload: enrollment }));
  }

  onFilter(filter: EnrollmentFilter): void {
    const currentFilters = this.filters() as EnrollmentFilter;
    this.store.dispatch(
      EnrollmentsActions.setFilter({
        payload: {
          ...filter,
          ...(currentFilters.search ? { search: currentFilters.search } : {}),
        },
      }),
    );
  }

  onSearch(search: string): void {
    const currentFilter: EnrollmentFilter = { ...(this.filters() as EnrollmentFilter) };
    const normalizedSearch = search.trim();

    if (normalizedSearch.length >= 3) {
      currentFilter.search = normalizedSearch;
    } else {
      delete currentFilter.search;
    }

    this.store.dispatch(EnrollmentsActions.setFilter({ payload: currentFilter }));
  }
}
