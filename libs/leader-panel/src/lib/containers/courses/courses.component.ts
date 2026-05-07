import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { CoursesListComponent } from '../../components/courses/courses-list/courses-list.component';
import { Course } from '../../models/course';
import { ListViewModel } from '../../models/list';
import { CourseDialogActions, CourseListActions, courseListFeature } from '../../store/course';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

@Component({
  selector: 'lp-courses',
  imports: [CoursesListComponent, KpTableLayoutComponent, TranslocoPipe, MatButton],
  template: `
    @let vm = this.vm();
    @let filter = this.vm().filter;

    <kp-table-layout
      class="grow"
      [totalItems]="vm.count"
      [pageIndex]="filter.page - 1"
      [pageSize]="filter.per_page"
      [searchPlaceholder]="'LEADER_PANEL.COURSES.FILTER.SEARCH'"
      (searchChange)="onFilterChange($event)"
      (pageChange)="onPageChange($event)"
    >
      <button kpTableFilterAfter matButton="outlined" (click)="coursesList.exportTable()">
        {{ 'LEADER_PANEL.GENERAL.EXPORT_DATA' | transloco }}
      </button>
      <lp-courses-list
        #coursesList
        kpTable
        [isLoading]="vm.loading"
        [courses]="vm.data"
        (sort)="onSort($event)"
        (rowClick)="openDialog($event)"
      ></lp-courses-list>
    </kp-table-layout>
  `,
  styles: `
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesComponent {
  protected readonly vm: Signal<ListViewModel<Course>>;

  constructor(private readonly store: Store) {
    store.dispatch(CourseListActions.init());
    this.vm = toSignal(store.select(courseListFeature.selectViewModel));
  }

  onFilterChange(search: string) {
    this.store.dispatch(CourseListActions.search({ search }));
  }

  onSort(sort: Sort) {
    this.store.dispatch(CourseListActions.sort({ sort }));
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.store.dispatch(CourseListActions.setPagination({ page: pageIndex + 1, per_page: pageSize }));
  }

  openDialog(selectedCourse: Course) {
    this.store.dispatch(CourseDialogActions.openDialog({ selectedCourse }));
  }
}
