import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe, DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { Enrollment, EnrollmentFilter } from '@core/model/enrollment.model';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AuthService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { KpContentBoxDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-box-dialog';
import {
  ExecuteAction,
  KpEnrollmentListMobileComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-enrollment-list-mobile';
import { KpEnrollmentTagTypePipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-tag-type';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { Store } from '@ngrx/store';
import { EnrollmentsFilterComponent } from 'app/shared/components/enrollments-filter/enrollments-filter.component';
import { NgxMaskDirective } from 'ngx-mask';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { filter, map, Observable } from 'rxjs';
import { LinkCycleActions } from '../link-cycle-dialog/store';
import { LearningTrailDoneActionType } from './consts';
import * as fromActions from './store/learning-trail-enrollments.actions';
import * as fromSelectors from './store/learning-trail-enrollments.selectors';

@Component({
  selector: 'app-learning-trail-enrollments',
  templateUrl: './learning-trail-enrollments.component.html',
  styleUrls: ['./learning-trail-enrollments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    KpEnrollmentListMobileComponent,
    EnrollmentsFilterComponent,
    NgxSkeletonLoaderModule,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIcon,
    MatSortHeader,
    MatTooltip,
    NgClass,
    KpCardTagComponent,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatDivider,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    ReactiveFormsModule,
    NgxMaskDirective,
    AsyncPipe,
    UpperCasePipe,
    DatePipe,
    TranslocoPipe,
    KpEnrollmentTagTypePipe,
    KpPerformancePipe,
    KpPluralizeTranslatePipe,
    KpTableLayoutComponent,
  ],
})
export class LearningTrailEnrollmentsComponent implements OnDestroy, OnInit {
  displayedColumns: string[] = [
    'icon',
    'name',
    'user',
    'startDate',
    'endDate',
    'goal',
    'performance',
    'overdue',
    'required',
    'status',
    'menu',
  ];

  performanceForm: FormGroup;
  goalDate!: Date | undefined;
  minDate = new Date();

  externalProvider!: string;

  enrollments$!: Observable<Enrollment[]>;
  count$!: Observable<number>;
  history$!: Observable<string>;
  isLoading$!: Observable<boolean>;
  currentPage$!: Observable<number>;
  perPage$!: Observable<number | undefined>;
  isMobile$: Observable<boolean>;
  statuses$: Observable<KpFilterSelectOption[]>;

  filteringAllUsers = false;

  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  private dialogRef!: MatDialogRef<KpContentBoxDialogComponent>;

  @ViewChild('confirmationTemplate', { static: true })
  private confirmationTemplate!: ElementRef;
  @ViewChild('goalDateTemplate', { static: true })
  private goalDateTemplate!: ElementRef;
  @ViewChild('performanceTemplate', { static: true })
  private performanceTemplate!: ElementRef;

  constructor(
    private readonly store: Store,
    private readonly _dialog: MatDialog,
    private readonly _route: ActivatedRoute,
    private readonly _translateService: TranslocoService,
    private readonly _authService: AuthService,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly fb: FormBuilder,
    private readonly _userProfileService: UserProfileService,
  ) {
    this.store.dispatch(fromActions.fetchStatusOptions({ enrollmentType: 'LEARNING_TRAIL' }));
    this.statuses$ = this.store.select(fromSelectors.selectStatuses);

    this.performanceForm = this.fb.group({
      performance: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
    });
  }

  ngOnInit(): void {
    this.enrollments$ = this.store.select(fromSelectors.selectEnrollments);
    this.count$ = this.store.select(fromSelectors.selectCount);
    this.perPage$ = this.store.select(fromSelectors.selectPerPage);
    this.currentPage$ = this.store.select(fromSelectors.selectCurrentPage);
    this.history$ = this.store.select(fromSelectors.selectHistory);
    this.isLoading$ = this.store.select(fromSelectors.selectIsLoading);

    this._route.data.subscribe(({ filteringAllUsers }) => {
      this.filteringAllUsers = filteringAllUsers;
      const isContentCreator = this._userProfileService.hasRoles(['content']);

      this.store.dispatch(
        fromActions.initializeRouteData({
          filteringAllUsers,
          field: 'start_date',
          direction: 'desc',
          isContentCreator,
        }),
      );
    });

    this.isMobile$ = this._breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromActions.resetEnrollments());
  }

  onGenerateCertificate(id: string, isMobile = false): void {
    this.store.dispatch(fromActions.generateCertificate({ enrollmentId: id, isMobile }));
  }

  executeAction(action: LearningTrailDoneActionType | 'externalProvider', enrollment: Enrollment): void {
    this.store.dispatch(fromActions.setEnrollment({ enrollment }));

    const runAction: { [s: string]: () => void } = {
      [LearningTrailDoneActionType.VIEW_ACTIVITIES]: () =>
        this.store.dispatch(fromActions.loadTracking({ enrollment })),
      [LearningTrailDoneActionType.RE_ENROLL]: () =>
        this.openGoalDateDialog(enrollment, action as LearningTrailDoneActionType),
      [LearningTrailDoneActionType.RESTART]: () =>
        this.openGoalDateDialog(enrollment, action as LearningTrailDoneActionType),
      [LearningTrailDoneActionType.APPROVE_ENROLLMENT]: () =>
        this.openPerformanceDialog(enrollment, action as LearningTrailDoneActionType),
      [LearningTrailDoneActionType.LINK_CYCLE]: () =>
        this.store.dispatch(LinkCycleActions.openDialog({ enrollmentId: enrollment.id })),
      [LearningTrailDoneActionType.VIEW_TRAIL]: () =>
        this.store.dispatch(fromActions.viewLearningTrail({ enrollment })),
      [LearningTrailDoneActionType.EXTEND_DEADLINE]: () =>
        this.store.dispatch(fromActions.openExtendDeadlineDialog({ enrollment })),
      [LearningTrailDoneActionType.GIVE_UP]: () =>
        this.store.dispatch(fromActions.giveUp({ enrollmentId: enrollment.id })),
    };

    if (runAction[action]) {
      runAction[action]();
    } else {
      this.openConfirmationDialog(action as LearningTrailDoneActionType, enrollment);
    }
  }

  onFilterChange(filter: EnrollmentFilter) {
    this.store.dispatch(fromActions.saveFilter({ filter }));
  }

  onSearchChange(search: string) {
    this.store.dispatch(fromActions.searchChange({ search }));
  }

  onChangePage({ pageIndex, pageSize }: PageEvent): void {
    this.store.dispatch(fromActions.paginationChange({ page: pageIndex + 1, per_page: pageSize }));
  }

  handleSort({ active: field, direction }: Sort) {
    this.store.dispatch(fromActions.sortChange({ field, direction }));
  }

  disableSaveButton(disabled: boolean): void {
    if (this.dialogRef.componentInstance) {
      this.dialogRef.componentInstance.isSaveDisabled = disabled;
    }
  }

  fetchMoreItems(): void {
    this.store.dispatch(fromActions.fetchMoreItems());
  }

  executeActionMobile({ item, action }: ExecuteAction): void {
    if (action === 'generateCertificate') {
      this.onGenerateCertificate(item.id, true);
      return;
    }

    this.executeAction(action as LearningTrailDoneActionType, item as Enrollment);
  }

  get learningTrailDoneActionType(): typeof LearningTrailDoneActionType {
    return LearningTrailDoneActionType;
  }

  private openConfirmationDialog(action: LearningTrailDoneActionType, enrollment: Enrollment): void {
    this.dialogRef = this.openContentBoxDialog(
      'ENROLLMENTS.TITLE.' + action,
      action,
      this._translateService.translate(this.getDialogMessage(action), { payload: enrollment }),
      this.confirmationTemplate,
    );

    this.dialogRef
      .afterClosed()
      .pipe(
        filter((id) => !!id),
        map(() => ({ action, payload: enrollment })),
      )
      .subscribe((actionPayload) => this.store.dispatch(fromActions.executeAction(actionPayload)));
  }

  private openPerformanceDialog(enrollment: Enrollment, action: LearningTrailDoneActionType): void {
    this.dialogRef = this.openContentBoxDialog(
      'ENROLLMENTS.TITLE.' + action,
      action,
      this._translateService.translate(this.getDialogMessage(action)),
      this.performanceTemplate,
    );

    this.dialogRef
      .afterClosed()
      .pipe(
        filter((id) => !!id),
        map(() => ({
          action,
          payload: {
            id: enrollment.id,
            performance: this.performanceForm.get('performance')?.value / 100,
            status: enrollment.status,
          },
        })),
      )
      .subscribe((actionPayload) => {
        this.store.dispatch(fromActions.executeAction(actionPayload));
        this.performanceForm.reset({ performance: 0 });
      });
  }

  private openGoalDateDialog(enrollment: Enrollment, action: LearningTrailDoneActionType): void {
    this.goalDate = undefined;
    const payload =
      enrollment.enrolled_count > 1 ? enrollment.enrolled_count : this._translateService.translate('GENERAL.OTHERS');

    this.dialogRef = this.openContentBoxDialog(
      'ENROLLMENTS.TITLE.' + action,
      action,
      this._translateService.translate(this.getDialogMessage(action), { payload }),
      this.goalDateTemplate,
    );

    this.disableSaveButton(true);

    this.dialogRef
      .afterClosed()
      .pipe(
        filter((id) => !!(id && this.goalDate)),
        map(() => ({
          action,
          payload: {
            id: action === LearningTrailDoneActionType.RE_ENROLL ? enrollment.learning_trail?.id : enrollment.id,
            goalDate: this.goalDate,
            userId: this.filteringAllUsers ? enrollment.user.id : this._authService.userId,
          },
        })),
      )
      .subscribe((actionPayload) => this.store.dispatch(fromActions.executeAction(actionPayload)));
  }

  private openContentBoxDialog(
    title: string,
    id: string,
    message: string,
    customTemplate: ElementRef,
  ): MatDialogRef<KpContentBoxDialogComponent> {
    return this._dialog.open(KpContentBoxDialogComponent, {
      maxWidth: 600,
      data: {
        confirmTitle: title,
        customTemplate,
        actionButtons: [
          {
            id,
            label: this._translateService.translate('ENROLLMENTS.BUTTONS.' + id),
          },
        ],
        context: { $implicit: message },
      },
    });
  }

  private getDialogMessage(action: LearningTrailDoneActionType): string {
    return `ENROLLMENTS.MESSAGE.${this.filteringAllUsers ? 'ADMIN.' : ''}${action}`;
  }
}
