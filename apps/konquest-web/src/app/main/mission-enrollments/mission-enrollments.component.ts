import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe, DatePipe, NgClass, TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBadge } from '@angular/material/badge';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
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
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentsFilterComponent } from '@app/shared/components/enrollments-filter/enrollments-filter.component';
import { Enrollment, EnrollmentFilter, ExtendDeadlineDialogData } from '@core/model/enrollment.model';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  AuthService,
  BatchAction,
  BatchActionsViewModel,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpBatchActionSelectionComponent } from '@keeps-platform-frontend-workspace/ui/kp-batch-action-selection';
import { KpBatchActionSelectionCounterComponent } from '@keeps-platform-frontend-workspace/ui/kp-batch-action-selection-counter';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { KpContentBoxDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-box-dialog';
import { KpDisableContinueMissionDirective } from '@keeps-platform-frontend-workspace/ui/kp-disable-continue-mission';
import {
  ExecuteAction,
  KpEnrollmentListMobileComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-enrollment-list-mobile';
import { KpEnrollmentTagTypePipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-tag-type';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { Store } from '@ngrx/store';
import { ExtendDeadlineDialogComponent } from 'app/main/mission-enrollments/components/extend-deadline-dialog/extend-deadline-dialog.component';
import { NgxMaskDirective } from 'ngx-mask';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { filter, map, Observable, tap } from 'rxjs';
import { LinkCycleActions } from '../link-cycle-dialog/store';
import { MissionDoneActionType } from './consts';
import * as BatchActionsActions from './store/batch-actions/batch-actions.actions';
import { batchActionsFeature } from './store/batch-actions/batch-actions.feature';
import * as fromActions from './store/mission-enrollments.actions';
import * as fromSelectors from './store/mission-enrollments.selectors';

@Component({
  selector: 'app-mission-enrollments',
  templateUrl: './mission-enrollments.component.html',
  styleUrls: ['./mission-enrollments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    KpEnrollmentListMobileComponent,
    KpBatchActionSelectionComponent,
    KpBatchActionSelectionCounterComponent,
    KpTableLayoutComponent,
    NgxSkeletonLoaderModule,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    NgClass,
    MatCheckbox,
    MatCellDef,
    MatCell,
    MatIcon,
    MatBadge,
    MatSortHeader,
    MatTooltip,
    KpCardTagComponent,
    MatIconButton,
    KpDisableContinueMissionDirective,
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
    NgxMaskDirective,
    ReactiveFormsModule,
    AsyncPipe,
    UpperCasePipe,
    TitleCasePipe,
    DatePipe,
    TranslocoPipe,
    KpEnrollmentTagTypePipe,
    KpPerformancePipe,
    KpPluralizeTranslatePipe,
    EnrollmentsFilterComponent,
  ],
})
export class MissionEnrollmentsComponent implements OnDestroy, OnInit {
  displayedColumns: string[] = [
    'select',
    'icon',
    'missionName',
    'user',
    'startDate',
    'endDate',
    'goal',
    'performance',
    'overdue',
    'required',
    'status',
    'actions',
  ];

  selection = new SelectionModel<Enrollment>(true, []);

  performance = 0;
  inputMessage!: string;
  goalDate!: Date | undefined;
  minDate = new Date();
  performanceControl: FormControl;

  externalProvider!: string;

  enrollments$!: Observable<Enrollment[]>;
  count$!: Observable<number>;
  history$!: Observable<string>;
  isLoading$!: Observable<boolean>;
  currentPage$!: Observable<number>;
  perPage$!: Observable<number | undefined>;
  isMobile$: Observable<boolean>;
  statuses$: Observable<KpFilterSelectOption[]>;
  batchActionsViewModel$: Observable<BatchActionsViewModel>;
  isSuperAdmin$: Observable<boolean>;
  hasAppliedFilter$: Observable<boolean>;
  filteringAllUsers = false;

  readonly isCourse = signal<boolean>(true);
  readonly enrollmentTypeFilter = computed(() => (this.isCourse() ? 'MISSION' : 'EVENT'));
  private dialogRef!: MatDialogRef<KpContentBoxDialogComponent>;

  @ViewChild('term', { static: true }) inputSearch!: ElementRef;
  @ViewChild('confirmationTemplate', { static: true })
  private confirmationTemplate!: ElementRef;
  @ViewChild('inputTemplate', { static: true })
  private inputTemplate!: ElementRef;
  @ViewChild('goalDateTemplate', { static: true })
  private goalDateTemplate!: ElementRef;
  @ViewChild('performanceTemplate', { static: true })
  private performanceTemplate!: ElementRef;
  @ViewChild('externalProviderTemplate', { static: true })
  private externalProviderTemplate!: ElementRef;
  @ViewChild('historyTemplate', { static: true })
  private historyTemplate!: ElementRef;

  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  constructor(
    private readonly store: Store,
    private readonly _dialog: MatDialog,
    private readonly _route: ActivatedRoute,
    private readonly _translateService: TranslocoService,
    private readonly _authService: AuthService,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _userProfileService: UserProfileService,
    private readonly _router: Router,
  ) {
    store.dispatch(fromActions.fetchStatusOptions({ enrollmentType: 'MISSION' }));
    this.statuses$ = store.select(fromSelectors.selectStatuses);
    this.count$ = store.select(fromSelectors.selectCount);
    this.perPage$ = store.select(fromSelectors.selectPerPage);
    this.currentPage$ = store.select(fromSelectors.selectCurrentPage);
    this.history$ = store.select(fromSelectors.selectHistory);
    this.isLoading$ = store.select(fromSelectors.selectIsLoading);
    this.batchActionsViewModel$ = store.select(batchActionsFeature.selectViewModel);
    this.enrollments$ = store.select(fromSelectors.selectEnrollments).pipe(tap(() => this.clearSelection()));
    this.isSuperAdmin$ = _userProfileService.isSuperAdmin$();
    this.hasAppliedFilter$ = store.select(fromSelectors.selectHasAppliedFilter);

    this.performanceControl = new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100)]);
  }

  ngOnInit(): void {
    this.initialConfig();

    this.isMobile$ = this._breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromActions.resetEnrollments());
  }

  openLearningTrailLinkedDialog({ mission }: Enrollment): void {
    this.store.dispatch(fromActions.loadLinkedLearningTrails({ missionId: mission?.id || '' }));
  }

  onGenerateCertificate(row: Enrollment, isMobile = false): void {
    if (row.certificate_provider_url) {
      window.open(row.certificate_provider_url);
    } else {
      this.store.dispatch(fromActions.generateCertificate({ id: row.id, isMobile }));
    }
  }

  onShareCertificate(enrollment: Enrollment) {
    window.open(
      `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${enrollment.mission?.name}&CcertId=${enrollment.mission.id}`,
    );
  }

  executeAction(actionString: MissionDoneActionType | string, enrollment: Enrollment): void {
    this.store.dispatch(fromActions.setEnrollment({ enrollment }));

    const action = actionString as MissionDoneActionType;

    const runAction: Partial<Record<MissionDoneActionType, () => void>> = {
      [MissionDoneActionType.GIVE_UP]: () => this.openInputDialog(enrollment, action),
      [MissionDoneActionType.REJECT_CERTIFICATE]: () => this.openInputDialog(enrollment, action),
      [MissionDoneActionType.VIEW_ACTIVITIES]: () => this.store.dispatch(fromActions.loadTracking({ enrollment })),
      [MissionDoneActionType.RE_ENROLL]: () => this.openGoalDateDialog(enrollment, action),
      [MissionDoneActionType.RESTART]: () => this.openGoalDateDialog(enrollment, action),
      [MissionDoneActionType.RETAKE]: () => this.openGoalDateDialog(enrollment, action),
      [MissionDoneActionType.EXTEND_DEADLINE_ADMIN]: () => this.openExtendGoalDateDialog(enrollment),
      [MissionDoneActionType.HISTORY]: () => this.openHistoryDialog(enrollment),
      [MissionDoneActionType.APPROVE_CERTIFICATE]: () => this.openPerformanceDialog(enrollment, action),
      [MissionDoneActionType.APPROVE_ENROLLMENT]: () => this.openPerformanceDialog(enrollment, action),
      [MissionDoneActionType.EXTERNAL_PROVIDER]: () => this.openExternalProviderDialog(enrollment),
      [MissionDoneActionType.PREVIOUS_ENROLLMENTS]: () =>
        this.store.dispatch(
          fromActions.loadEnrollmentsByUser({
            missionId: enrollment.mission?.id || '',
            userId: this.filteringAllUsers ? enrollment.user.id || '' : this._authService.userId || '',
          }),
        ),
      [MissionDoneActionType.CONTINUE]: () =>
        this.store.dispatch(fromActions.executeAction({ action, payload: enrollment })),
      [MissionDoneActionType.ATTACH_CERTIFICATE]: () =>
        this.store.dispatch(fromActions.executeAction({ action, payload: enrollment })),
      [MissionDoneActionType.VIEW_MISSION]: () => this.openMissionDetailDialog(enrollment, action),
      [MissionDoneActionType.LINK_CYCLE]: () =>
        this.store.dispatch(LinkCycleActions.openDialog({ enrollmentId: enrollment.id })),
      [MissionDoneActionType.OPEN_MISSION]: () =>
        this.store.dispatch(fromActions.executeAction({ action, payload: enrollment })),
    };

    if (runAction[action]) {
      (runAction[action] as () => void)();
    } else {
      this.openConfirmationDialog(action, enrollment);
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
      this.onGenerateCertificate(item as Enrollment, true);
      return;
    }
    this.executeAction(action, item as Enrollment);
  }

  isAllSelected(items: Enrollment[]): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = items.length;
    return numSelected === numRows;
  }

  toggleAllRows(items: Enrollment[], isTotalSelected: boolean): void {
    if (isTotalSelected) {
      this.dispatchChangedTotalSelection(false);
    }

    if (this.isAllSelected(items)) {
      this.selection.clear();
      return;
    }

    this.selection.select(...items);
  }

  toggleOneRow(event: MatCheckboxChange, item: Enrollment, isTotalSelected: boolean): void {
    if (event) {
      this.selection.toggle(item);
    }

    if (isTotalSelected) {
      this.dispatchChangedTotalSelection(false);
    }
  }

  toggleTotalSelection(items?: Enrollment[]): void {
    if (items) {
      this.selection.select(...items);
    } else {
      this.selection.clear();
    }

    this.dispatchChangedTotalSelection(!!items);
  }

  clearSelection(): void {
    this.selection.clear();
    this.dispatchChangedTotalSelection(false);
  }

  dispatchChangedTotalSelection(isTotalSelected: boolean): void {
    this.store.dispatch(BatchActionsActions.toggleTotalSelection({ isTotalSelected }));
  }

  dispatchAction(action: BatchAction, total: number): void {
    const enrollmentIds = this.selection.selected.map((item) => item.id);
    this.store.dispatch(BatchActionsActions.dispatchAction({ action, enrollmentIds, total }));
  }

  get missionDoneActionType(): typeof MissionDoneActionType {
    return MissionDoneActionType;
  }

  private openConfirmationDialog(action: MissionDoneActionType, enrollment: Enrollment): void {
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

  private openHistoryDialog(enrollment: Enrollment): void {
    this.store.dispatch(fromActions.loadEnrollmentHistory({ id: enrollment.id }));

    this.dialogRef = this.openContentBoxDialog(
      'ENROLLMENTS.TITLE.' + MissionDoneActionType.HISTORY,
      MissionDoneActionType.HISTORY,
      this._translateService.translate(this.getDialogMessage(MissionDoneActionType.HISTORY), { payload: enrollment }),
      this.historyTemplate,
      800,
    );

    this.dialogRef.afterClosed().subscribe(() => this.store.dispatch(fromActions.resetEnrollmentHistory()));
  }

  private openPerformanceDialog(enrollment: Enrollment, action: MissionDoneActionType): void {
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
            performance: this.performanceControl.value / 100,
            status: enrollment.status,
          },
        })),
      )
      .subscribe((actionPayload) => {
        this.store.dispatch(fromActions.executeAction(actionPayload));
        this.performanceControl.reset({ performance: 0 });
      });
  }

  private openInputDialog(enrollment: Enrollment, action: MissionDoneActionType): void {
    this.inputMessage = '';

    this.dialogRef = this.openContentBoxDialog(
      'ENROLLMENTS.TITLE.' + action,
      action,
      this._translateService.translate(this.getDialogMessage(action)),
      this.inputTemplate,
    );

    this.disableSaveButton(true);

    this.dialogRef
      .afterClosed()
      .pipe(
        filter((id) => !!id),
        map(() => ({
          action,
          payload: {
            id: enrollment.id,
            message: this.inputMessage,
          },
        })),
      )
      .subscribe((actionPayload) => this.store.dispatch(fromActions.executeAction(actionPayload)));
  }

  private openExternalProviderDialog(enrollment: Enrollment): void {
    this.externalProvider = enrollment?.provider_icon;

    this._dialog.open(KpContentBoxDialogComponent, {
      maxWidth: 600,
      data: {
        confirmTitle: 'ENROLLMENTS.TITLE.' + MissionDoneActionType.EXTERNAL_PROVIDER,
        customTemplate: this.externalProviderTemplate,
      },
    });
  }

  private openGoalDateDialog(enrollment: Enrollment, action: MissionDoneActionType): void {
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
            id: action === MissionDoneActionType.RE_ENROLL ? enrollment.mission?.id : enrollment.id,
            goalDate: this.goalDate,
            userId: this.filteringAllUsers ? enrollment.user.id : this._authService.userId,
          },
        })),
      )
      .subscribe((actionPayload) => this.store.dispatch(fromActions.executeAction(actionPayload)));
  }

  private openExtendGoalDateDialog(enrollment: Enrollment) {
    const data: ExtendDeadlineDialogData = {
      user: enrollment.user.name,
      startDate: enrollment.start_date,
      currentGoalDate: enrollment.goal_date,
      learningObjectName: enrollment.mission.name,
      learnContentType: 'mission',
    };

    this._dialog
      .open<ExtendDeadlineDialogComponent, ExtendDeadlineDialogData, string>(ExtendDeadlineDialogComponent, {
        autoFocus: false,
        width: '500px',
        disableClose: true,
        data,
      })
      .afterClosed()
      .pipe(filter((goalDate) => !!goalDate))
      .subscribe((goalDate) => {
        const actionPayload = {
          action: MissionDoneActionType.EXTEND_DEADLINE_ADMIN,
          payload: {
            id: enrollment.id,
            goalDate,
            userId: enrollment.user.id,
          },
        };
        this.store.dispatch(fromActions.executeAction(actionPayload));
      });
  }

  private openContentBoxDialog(
    title: string,
    id: string,
    message: string,
    customTemplate: ElementRef,
    maxWidth = 600,
  ): MatDialogRef<KpContentBoxDialogComponent> {
    return this._dialog.open(KpContentBoxDialogComponent, {
      maxWidth,
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

  private getDialogMessage(action: MissionDoneActionType): string {
    return `ENROLLMENTS.MESSAGE.${this.filteringAllUsers ? 'ADMIN.' : ''}${action}`;
  }

  private openMissionDetailDialog(enrollment: Enrollment, action: MissionDoneActionType) {
    this.store.dispatch(fromActions.executeAction({ action, payload: enrollment }));
  }

  private initialConfig() {
    this._route.data.subscribe(({ filteringAllUsers }) => {
      this.filteringAllUsers = filteringAllUsers;

      const isContentCreator = this._userProfileService.hasRoles(['content']);
      const isCourse = this._router.url.includes('/missions');
      this.isCourse.set(isCourse);

      this.store.dispatch(
        fromActions.getRouteDataAndLoadEnrollments({
          filteringAllUsers,
          isCourse,
          isContentCreator,
        }),
      );
    });
  }
}
