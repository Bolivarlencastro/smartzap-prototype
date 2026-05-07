import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DevelopmentStatus,
  KeepsUtils,
  MirroredCourse,
  UpdateActiveStatusBatchDto,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { filter, tap } from 'rxjs';
import { AluraStatus, CoursesListPagination, MirroredCoursesViewModel } from '../../models';
import { getTranslocoScope } from '../../utils';
import { AllCoursesActivatedPipe } from '../../utils/pipes/all-courses-activated.pipe';
import { AluraStatusColorPipe } from '../../utils/pipes/alura-status-color.pipe';
import { DisallowMirroredCourseDeletionPipe } from '../../utils/pipes/disallow-mirrored-course-deletion.pipe';
import { AluraCourseStatusPipe } from '../../utils/pipes/alura-course-status.pipe';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

marker('INTEGRATIONS.MANAGEMENT_LIST.SELECTED_ITEM_MESSAGE.PLURAL');
marker('INTEGRATIONS.MANAGEMENT_LIST.SELECTED_ITEM_MESSAGE.SINGULAR');

@Component({
  selector: 'kp-alura-management-list',
  imports: [
    CommonModule,
    TranslocoModule,
    AluraStatusColorPipe,
    NgxSkeletonLoaderModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatSortModule,
    MatCheckboxModule,
    DisallowMirroredCourseDeletionPipe,
    AllCoursesActivatedPipe,
    KpPluralizeTranslatePipe,
    AluraCourseStatusPipe,
  ],
  templateUrl: './management-list.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
        overflow-y: scroll;
        height: 0;
      }
    `,
  ],
  providers: [getTranslocoScope()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementListComponent implements OnChanges {
  @Input() vm: MirroredCoursesViewModel;
  @Output() pageChanged = new EventEmitter<Partial<CoursesListPagination>>();
  @Output() sort = new EventEmitter<string>();
  @Output() openCourseMirrorDialog = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string[]>();
  @Output() toggleActive = new EventEmitter<UpdateActiveStatusBatchDto>();
  @Output() openDetailDialog = new EventEmitter<string>();

  protected readonly PAGE_SIZE_OPTIONS = constants.defaultPageSizeOptions;
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '81px' };
  protected readonly displayedColumns: string[] = [
    'select',
    'name',
    'created_at',
    'category',
    'alura_status',
    'menu',
    'activation',
  ];

  AluraStatus = AluraStatus;
  DevelopmentStatus = DevelopmentStatus;
  dataSource: MatTableDataSource<MirroredCourse>;
  selection = new SelectionModel<MirroredCourse>(true, []);

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['vm']) {
      this.dataSource = new MatTableDataSource<MirroredCourse>(this.vm.items);
      this.selection.clear();
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  onPageChange(event: PageEvent): void {
    // We increment the page index by 1 because mat-paginator is 0 index based, while the api is not
    const currentPage = event.pageIndex + 1;
    this.pageChanged.emit({ currentPage, perPage: event.pageSize });
  }

  onOpenCourse(course: MirroredCourse): void {
    KeepsUtils.openUrlInNewTab(course.link);
  }

  onOpenCourseMirrorDialog(): void {
    this.openCourseMirrorDialog.emit();
  }

  onSort({ active: field, direction }: Sort): void {
    const order = direction ? KeepsUtils.buildSort({ field, direction }) : null;
    this.sort.emit(order);
  }

  onDelete(course?: MirroredCourse): void {
    const ids = course ? [course.id] : this.selection.selected.map((item) => item.id);
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRef.componentInstance.confirmTitle = marker('INTEGRATIONS.MANAGEMENT_LIST.DELETE_COURSE_DIALOG.TITLE');
    dialogRef.componentInstance.confirmMessage = marker('INTEGRATIONS.MANAGEMENT_LIST.DELETE_COURSE_DIALOG.MESSAGE');
    dialogRef.componentInstance.positiveButtonLabel = marker(
      'INTEGRATIONS.MANAGEMENT_LIST.DELETE_COURSE_DIALOG.CONFIRM_BUTTON',
    );

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() => this.delete.emit(ids)),
      )
      .subscribe();
  }

  onToggleActive({ checked }: MatSlideToggleChange, courseId?: string): void {
    const courseIds = courseId ? [courseId] : this.selection.selected.map((item) => item.id);
    this.toggleActive.emit({ isActive: checked, courseIds: courseIds });
  }

  onOpenDetailDialog(course: MirroredCourse): void {
    this.openDetailDialog.emit(course.missionId);
  }
}
