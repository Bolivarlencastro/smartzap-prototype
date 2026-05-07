import { DatePipe, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { CourseActions, TransferActions } from 'app/main/courses/store/actions';
import { CourseSelectors, LessonsSelectors, TransferSelectors } from 'app/main/courses/store/selectors';
import { Course } from 'app/main/courses/model';
import { ReportActions } from 'app/shared/store/actions';
import { DialogTransferComponent } from '../components/dialog-transfer/dialog-transfer.component';
import { Report, ReportType } from 'app/shared/model';
import { UserProfileService, UserRole } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { RouteDetailDialogWrapper } from 'libs/shared-ui/ui/src/lib/directives/kp-route-detail-dialog-wrapper';
import { TranslocoPipe } from '@jsverse/transloco';
import { CourseDetailHeaderComponent } from '../components/detail-header/course-detail-header.component';
import { CourseDetailContentsComponent } from '../components/detail-contents/course-detail-contents.component';
import { CourseDetailStatusComponent } from '../components/detail-status/course-detail-status.component';
import { CourseDetailActionsComponent } from '../components/detail-actions/course-detail-actions.component';
import { CourseDetailDescriptionComponent } from '../components/detail-description/course-detail-description.component';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
  imports: [
    MatDialogContent,
    MatIcon,
    CourseDetailHeaderComponent,
    CourseDetailContentsComponent,
    CourseDetailStatusComponent,
    CourseDetailActionsComponent,
    CourseDetailDescriptionComponent,
    AsyncPipe,
    KeyValuePipe,
    DatePipe,
    TranslocoPipe,
  ],
})
export class CourseDetailComponent
  extends RouteDetailDialogWrapper<CourseDetailComponent>
  implements OnInit, OnDestroy
{
  course$!: Observable<Course>;
  contents$!: Observable<Record<string, unknown>>;
  usersWithRoles$!: Observable<UserRole[]>;
  transfersIsLoading$!: Observable<boolean>;
  searchTerm$!: Observable<string>;
  reportButtons$!: Observable<Report[]>;
  canEdit$: Observable<boolean>;

  constructor(
    @Inject(DOCUMENT) protected override _document: Document,
    protected override _renderer2: Renderer2,
    protected override dialogRef: MatDialogRef<CourseDetailComponent>,
    private _router: Router,
    private _dialog: MatDialog,
    private store: Store,
    private userProfileService: UserProfileService,
  ) {
    super(_document, _renderer2, dialogRef);
    this.canEdit$ = combineLatest([
      this.store.select(CourseSelectors.selectIsOwner),
      this.userProfileService.isAdmin$(),
    ]).pipe(map(([isOwner, isAdmin]) => isOwner || isAdmin));
  }

  ngOnInit(): void {
    this.course$ = this.store.select(CourseSelectors.selectCourse);
    this.contents$ = this.store.select(LessonsSelectors.selectLessonsContentsToObject);
    this.usersWithRoles$ = this.store.select(TransferSelectors.selectAll);
    this.transfersIsLoading$ = this.store.select(TransferSelectors.selectIsLoading);
    this.reportButtons$ = this.store.select(CourseSelectors.selectGetReportButtons);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onRemove(id: string | undefined): void {
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

  onEdit(): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, {
      width: '300px',
    });

    dialogRef.componentInstance.confirmTitle = 'COURSE.DETAIL.CONFIRM_EDIT_TITLE';
    dialogRef.componentInstance.confirmMessage = 'COURSE.DETAIL.CONFIRM_EDIT_MESSAGE';

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() =>
          this.course$
            .pipe(
              take(1),
              tap((course) => {
                if (course?.id) {
                  this.dialogRef.close();
                  this._router.navigate(['/courses', course.id, 'form']);
                }
              }),
            )
            .subscribe(),
        ),
      )
      .subscribe();
  }

  onTransfer(courseId: string | undefined): void {
    const roleId = '3d010792-7119-4e14-bea3-5258a31f1ddc';
    this.store.dispatch(TransferActions.loadUsersByRoleId({ roleId }));

    const dialogRef = this._dialog.open(DialogTransferComponent, {
      width: '100%',
      maxWidth: '400px',
    });
    dialogRef.componentInstance.idCourse = courseId || '';
    dialogRef.componentInstance.usersWithRoles$ = this.usersWithRoles$;
    dialogRef.componentInstance.transfersIsLoading$ = this.transfersIsLoading$;

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((data) => {
          const userId: string = data.user.id;
          if (courseId) {
            this.store.dispatch(TransferActions.transferOwnership({ courseId, userId }));
          }
        }),
      )
      .subscribe();
  }

  onPublish(id: string | undefined): void {
    if (id) {
      this.store.dispatch(CourseActions.publish({ id }));
    }
  }

  onGenerateReport(courseId: string | undefined, reportType: ReportType): void {
    this.store.dispatch(ReportActions.generateReport({ id: courseId, reportType }));
  }

  updateDescription(summary: string): void {
    this.store.dispatch(CourseActions.updateCourseDescription({ summary }));
  }
}
