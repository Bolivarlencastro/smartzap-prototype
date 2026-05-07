import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import { Course, Enrollment } from 'app/main/courses/model';
import { RenewAccess, Tracking } from 'app/main/courses/model/tracking';
import { EnrollmentsActions, TrackingActions } from 'app/main/courses/store/actions';
import { CourseSelectors, EnrollmentsSelectors, TrackingSelectors } from 'app/main/courses/store/selectors';
import { EnrollmentFilter } from 'app/shared/services/enrollments.service';
import { environment } from 'environments/environment';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { catchError, filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { CourseCreateEnrollmentDialogComponent, CourseImportEnrollmentDialogComponent } from '../components';
import { TrackingDialogComponent } from '../components/tracking-dialog/tracking-dialog.component';
import { EnrollmentsService } from '../services';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpSnackLoadingComponent } from '@keeps-platform-frontend-workspace/ui/kp-snack-loading';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { AsyncPipe } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { EnrollmentListComponent } from '../components/list/enrollment-list.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpTableLayoutComponent } from 'libs/shared-ui/ui/src/lib/components/kp-table-layout';
import { EnrollmentsFilterComponent as SettingsEnrollmentsFilterComponent } from 'app/main/settings/components/enrollments-filter/enrollments-filter.component';
import { Page } from 'app/shared/model';
import {
  buildCourseEnrollmentStats,
  CourseEnrollmentsSideMenuComponent,
  CourseEnrollmentStats,
} from '../components/enrollments-side-menu/course-enrollments-side-menu.component';

@Component({
  selector: 'app-course-enrollments',
  templateUrl: './course-enrollments.component.html',
  host: {
    class: 'block h-full',
  },
  imports: [
    MatDrawer,
    MatDrawerContainer,
    MatIconButton,
    RouterLink,
    MatIcon,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatDivider,
    EnrollmentListComponent,
    AsyncPipe,
    TranslocoPipe,
    KpTableLayoutComponent,
    SettingsEnrollmentsFilterComponent,
    CourseEnrollmentsSideMenuComponent,
  ],
})
export class CourseEnrollmentsComponent implements OnInit, OnDestroy {
  course$!: Observable<Course>;
  enrollments$!: Observable<Enrollment[]>;
  page$!: Observable<Page>;
  filters$!: Observable<EnrollmentFilter>;
  tracking$!: Observable<Tracking[]>;
  enrollmentsLoading$!: Observable<boolean>;
  trackingLoading$!: Observable<boolean>;
  urlXlsUpload = environment.link.xls;
  enrollmentStats!: Signal<CourseEnrollmentStats>;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private store: Store,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _enrollmentsService: EnrollmentsService,
    private readonly _messageService: KpMessageService,
  ) {
    this.enrollmentStats = toSignal(
      combineLatest([
        this.store.select(EnrollmentsSelectors.selectAll),
        this.store.select(EnrollmentsSelectors.selectGetPage),
      ]).pipe(map(([enrollments, page]) => buildCourseEnrollmentStats(enrollments, page?.count ?? 0))),
      { initialValue: buildCourseEnrollmentStats([], 0) },
    );
  }

  ngOnInit(): void {
    this.enrollmentsLoading$ = this.store.select(EnrollmentsSelectors.selectIsLoading);
    this.course$ = this.store.select(CourseSelectors.selectCourse);
    this.enrollments$ = this.store.select(EnrollmentsSelectors.selectAll);
    this.page$ = this.store.select(EnrollmentsSelectors.selectGetPage);
    this.filters$ = this.store.select(EnrollmentsSelectors.selectGetFilter);
    this.tracking$ = this.store.select(TrackingSelectors.selectAll);
    this.trackingLoading$ = this.store.select(TrackingSelectors.selectIsLoading);

    this.store.dispatch(EnrollmentsActions.loadEnrollments());
  }

  ngOnDestroy(): void {
    this.store.dispatch(EnrollmentsActions.clear());
    this._unsubscribeAll.complete();
  }

  onSortEnrollments({ direction, active: field }: Sort): void {
    this.store.dispatch(EnrollmentsActions.sortEnrollments({ direction, field }));
  }

  onPageChanged(event: PageEvent): void {
    const { pageSize: per_page, pageIndex } = event;
    const page = pageIndex + 1;
    this.store.dispatch(
      EnrollmentsActions.setPage({
        page: {
          page,
          per_page,
          count: 0,
          total_pages: 0,
        },
      }),
    );
  }

  onGetDetailUser(enrolment: Enrollment): void {
    const { id } = enrolment;
    if (id) {
      this.store.dispatch(TrackingActions.loadTrackingEnrolment({ id }));
    }
  }

  onImportEnrollments(course_id: string | undefined): void {
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
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  createEnrollment(course_id: string | undefined): void {
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
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  onRemove(id: string): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent);
    dialogRef.componentInstance.confirmTitle = 'SETTINGS.ENROLLMENTS.CONFIRM_DELETE_TITLE';
    dialogRef.componentInstance.confirmMessage = 'SETTINGS.ENROLLMENTS.CONFIRM_DELETE_MESSAGE';

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() => this.store.dispatch(EnrollmentsActions.removeEnrollment({ id }))),
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  onReenroll(enrollment: Enrollment): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent);
    dialogRef.componentInstance.confirmTitle = 'SETTINGS.ENROLLMENTS.CONFIRM_REENROLL_TITLE';
    dialogRef.componentInstance.confirmMessage = 'SETTINGS.ENROLLMENTS.CONFIRM_REENROLL_MESSAGE';
    dialogRef
      .afterClosed()
      .pipe(filter((value) => value === true))
      .subscribe(() =>
        this.store.dispatch(
          EnrollmentsActions.reenroll({
            courseId: enrollment.course_id,
            userId: enrollment.user_id,
          }),
        ),
      );
  }

  onCancel(enrollment: Enrollment): void {
    if (enrollment.id) {
      this.store.dispatch(EnrollmentsActions.cancelEnrollment({ enrollmentId: enrollment.id }));
    }
  }

  onClearDialogTracking(): void {
    this.store.dispatch(TrackingActions.clear());
  }

  sendRenewAccess(renewAccess: RenewAccess): Subscription {
    this._snackBar.openFromComponent(KpSnackLoadingComponent);
    return this._enrollmentsService
      .sendRenewAccess(renewAccess.enrollment_id, renewAccess.content_id)
      .pipe(
        tap(() => {
          this._snackBar.dismiss();
          this._messageService.success(marker('TRACKING.LINK_SEND_SUCCESS'));
        }),
        catchError((error) => {
          this._snackBar.dismiss();
          this._messageService.success(marker('TRACKING.LINK_SEND_ERROR'));
          return error;
        }),
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  onOpenDetailUser(enrollment: Enrollment): void {
    this.onGetDetailUser(enrollment);
    const dialogRef = this._dialog.open(TrackingDialogComponent, {
      width: '100%',
      maxWidth: '80vw',
    });
    dialogRef.componentInstance.isVisibilitySendLink = enrollment.status !== 'COMPLETED';
    dialogRef.componentInstance.destroyEvent
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => this.onClearDialogTracking());
    dialogRef.componentInstance.datasource$ = this.tracking$;
    dialogRef.componentInstance.isLoading$ = this.trackingLoading$;
    dialogRef.componentInstance.enrollment = enrollment;
    dialogRef.componentInstance.renewAccessSelected
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((renewAccess) => this.sendRenewAccess(renewAccess));
  }

  onFilter(filter: EnrollmentFilter): void {
    this.filters$.pipe(take(1)).subscribe((currentFilter) => {
      this.store.dispatch(
        EnrollmentsActions.setFilter({
          filter: {
            ...filter,
            ...(currentFilter?.search ? { search: currentFilter.search } : {}),
          },
        }),
      );
    });
  }

  onSearch(search: string, currentFilter: EnrollmentFilter): void {
    const normalizedSearch = search.trim();
    const nextFilter: EnrollmentFilter = { ...currentFilter };

    if (normalizedSearch.length >= 3) {
      nextFilter.search = normalizedSearch;
    } else {
      delete nextFilter.search;
    }

    this.store.dispatch(EnrollmentsActions.setFilter({ filter: nextFilter }));
  }
}
