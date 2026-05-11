import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { Sort } from '@angular/material/sort';
import { Router, RouterLink } from '@angular/router';
import { CoursesFilter } from '@app/main/courses/store/reducers/courses.reducer';
import { globalSettingsFeature } from '@app/shared/store/features';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Category, Course } from 'app/main/courses/model';
import { CourseActions, CoursesActions, EnrollmentsActions, TransferActions } from 'app/main/courses/store/actions';
import { CoursesSelectors, TransferSelectors } from 'app/main/courses/store/selectors';
import { CourseSummary } from 'app/main/courses/store/selectors/courses.selectors';
import { KpCourseFilterComponent } from 'app/shared/kp-components/kp-filter';
import { Page, ReportType, CourseReports } from 'app/shared/model';
import { CourseSideMenuComponent } from '../components/course-side-menu/course-side-menu.component';
import { CourseListActionEvent, CourseListComponent } from '../components/list/course-list.component';
import { KpTableLayoutComponent } from 'libs/shared-ui/ui/src/lib/components/kp-table-layout';
import { AuthService, UserProfileService, UserRole } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpWarnDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-warn-dialog';
import { ReportActions } from 'app/shared/store/actions';
import { DialogTransferComponent } from '../../detail/components/dialog-transfer/dialog-transfer.component';
import {
  CourseCreateEnrollmentDialogComponent,
  CourseImportEnrollmentDialogComponent,
} from '../../enrollments/components';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDrawerContainer,
    MatDrawer,
    CourseSideMenuComponent,
    MatButton,
    RouterLink,
    MatIconButton,
    MatIcon,
    KpCourseFilterComponent,
    KpTableLayoutComponent,
    CourseListComponent,
    TranslocoPipe,
  ],
})
export class CoursesComponent implements OnInit, OnDestroy {
  isLoading: Signal<boolean>;
  courses: Signal<Course[]>;
  categories: Signal<Category[]>;
  page: Signal<Page>;
  summary: Signal<CourseSummary>;
  filters: Signal<CoursesFilter>;
  readonly reportButtons = CourseReports;

  private store = inject(Store);
  private _router = inject(Router);
  private _dialog = inject(MatDialog);
  private _authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);

  constructor() {
    this.categories = toSignal(this.store.select(globalSettingsFeature.selectCategories));
    this.isLoading = toSignal(this.store.select(CoursesSelectors.selectLoading));
    this.page = toSignal(this.store.select(CoursesSelectors.selectPage));
    this.summary = toSignal(this.store.select(CoursesSelectors.selectCourseSummary));
    this.courses = toSignal(this.store.select(CoursesSelectors.selectCourses));
    this.filters = toSignal(this.store.select(CoursesSelectors.selectFilters));
  }

  ngOnInit(): void {
    this.store.dispatch(CoursesActions.initializeCourses());
  }

  ngOnDestroy(): void {
    this.store.dispatch(CoursesActions.reset());
  }

  get currentUserId(): string | undefined {
    return this._authService.userId;
  }

  get isAdmin(): boolean {
    return this.userProfileService.isAdmin();
  }

  onCourseAction({ action, course, reportType }: CourseListActionEvent): void {
    switch (action) {
      case 'edit':
        this.onEdit(course);
        break;
      case 'manage':
        this._router.navigate(['/courses', course.id, 'enrollments']);
        break;
      case 'publish':
        this.onPublish(course.id);
        break;
      case 'transfer':
        this.onTransfer(course.id);
        break;
      case 'duplicate':
        this.onDuplicate(course.id);
        break;
      case 'delete':
        this.onRemove(course.id);
        break;
      case 'report':
        if (reportType) {
          this.onGenerateReport(course.id, reportType);
        }
        break;
      case 'enroll':
        this.onEnroll(course.id);
        break;
      case 'enrollBatch':
        this.onEnrollBatch(course.id);
        break;
    }
  }

  onSearch(term: string): void {
    this.store.dispatch(CoursesActions.searchCourses({ term }));
  }

  onFilter(filters: CoursesFilter): void {
    this.store.dispatch(CoursesActions.setFilter({ filters }));
  }

  onPageChange({ pageIndex, pageSize }: PageEvent): void {
    this.store.dispatch(CoursesActions.setPagination({ currentPage: pageIndex + 1, per_page: pageSize }));
  }

  onSort({ active, direction }: Sort): void {
    this.store.dispatch(CoursesActions.setSort({ sort: { field: active, direction } }));
  }

  private onEdit(course: Course): void {
    if (course?.id) {
      this._router.navigate(['/courses', course.id, 'form']);
    }
  }

  private onRemove(id: string | undefined): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent);

    dialogRef.componentInstance.confirmTitle = 'COURSE.DETAIL.CONFIRM_DELETE_TITLE';
    dialogRef.componentInstance.confirmMessage = 'COURSE.DETAIL.CONFIRM_DELETE_MESSAGE';

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() => {
          if (id) {
            this.store.dispatch(CourseActions.deleteCourse({ id }));
          }
        }),
      )
      .subscribe();
  }

  private onDuplicate(id: string | undefined): void {
    if (id) {
      this.store.dispatch(CourseActions.duplicateCourse({ id }));
    }
  }

  private onTransfer(courseId: string | undefined): void {
    const roleId = '3d010792-7119-4e14-bea3-5258a31f1ddc';
    this.store.dispatch(TransferActions.loadUsersByRoleId({ roleId }));

    const dialogRef = this._dialog.open(DialogTransferComponent, {
      width: '100%',
      maxWidth: '400px',
    });
    dialogRef.componentInstance.idCourse = courseId || '';
    dialogRef.componentInstance.usersWithRoles$ = this.store.select(TransferSelectors.selectAll);
    dialogRef.componentInstance.transfersIsLoading$ = this.store.select(TransferSelectors.selectIsLoading);

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((data: { user: UserRole }) => {
          const userId = data.user.id;
          if (courseId && userId) {
            this.store.dispatch(TransferActions.transferOwnership({ courseId, userId }));
          }
        }),
      )
      .subscribe();
  }

  private onPublish(id: string | undefined): void {
    if (id) {
      this.store.dispatch(CourseActions.publish({ id }));
    }
  }

  private onEnroll(course_id: string | undefined): void {
    const dialogRef = this._dialog.open(CourseCreateEnrollmentDialogComponent, {
      width: '100%',
      maxWidth: '550px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap(({ data }) => {
          if (course_id) {
            this.store.dispatch(EnrollmentsActions.createEnrolment({ course_id, data }));
          }
        }),
      )
      .subscribe();
  }

  private onEnrollBatch(course_id: string | undefined): void {
    const dialogRef = this._dialog.open(CourseImportEnrollmentDialogComponent, {
      width: '100%',
      maxWidth: '400px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap(({ data }) => {
          if (course_id) {
            this.store.dispatch(EnrollmentsActions.importEnrolments({ course_id, data }));
          }
        }),
      )
      .subscribe();
  }

  private onGenerateReport(courseId: string | undefined, reportType: ReportType): void {
    const dialogRef = this._dialog.open(KpWarnDialogComponent);

    dialogRef.componentInstance.dialogTitle = 'REPORTS.DIALOG_TITLE';
    dialogRef.componentInstance.dialogDescription = 'REPORTS.WARN';
    dialogRef.componentInstance.icon = 'notifications_none';

    this.store.dispatch(ReportActions.generateReport({ id: courseId, reportType }));
  }
}
