import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { Course } from 'app/main/courses/model';
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
import { MatButton, MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { ImageUrlPipe } from './pipes/image-url.pipe';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { Report, ReportType } from 'app/shared/model';

export type CourseListAction =
  | 'edit'
  | 'manage'
  | 'publish'
  | 'transfer'
  | 'delete'
  | 'report'
  | 'enroll'
  | 'enrollBatch';

export interface CourseListActionEvent {
  action: CourseListAction;
  course: Course;
  reportType?: ReportType;
}

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatSortHeader,
    MatButton,
    MatIconButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatDivider,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    RouterLink,
    TranslocoPipe,
    KpDurationPipe,
    ImageUrlPipe,
    KpCardTagComponent,
    DatePipe,
  ],
})
export class CourseListComponent {
  @ViewChild('table') table!: ElementRef;

  @Input() courses!: Course[];
  @Input() isLoading!: boolean;
  @Input() reportButtons: Report[] = [];
  @Input() isAdmin = false;
  @Input() currentUserId?: string;
  @Output() actionSelected = new EventEmitter<CourseListActionEvent>();
  @Output() sort = new EventEmitter<Sort>();

  displayedColumns: string[] = [
    'image',
    'name',
    'user_creator__name',
    'category__name',
    'created',
    'duration',
    'subscribers',
    'completed',
    'status',
    'menu',
  ];

  protected readonly skeletonRows = new Array(8);
  protected readonly displayedData = () => (this.isLoading ? this.skeletonRows : (this.courses ?? []));

  handleSort(sort: Sort) {
    this.changeScrollTop();
    this.sort.emit(sort);
  }

  canEdit(course: Course): boolean {
    return this.isAdmin || course?.user_creator?.id === this.currentUserId;
  }

  canUseEdit(course: Course): boolean {
    return this.canEdit(course) && !this.isProcessing(course);
  }

  canTransfer(course: Course): boolean {
    return this.canEdit(course) && !this.isProcessing(course) && course.status !== 'CREATING';
  }

  canPublish(course: Course): boolean {
    return this.canEdit(course) && course.status === 'REVIEWING';
  }

  canManage(course: Course): boolean {
    return course.status === 'FINISHED';
  }

  emitAction(action: CourseListAction, course: Course, reportType?: ReportType): void {
    this.actionSelected.emit({ action, course, reportType });
  }

  courseStatusColor(status: string): string {
    const colors: Record<string, string> = {
      FINISHED: '#00b400',
      CREATING: '#008fec',
      PROCESSING: '#ffd540',
      REVIEWING: '#ff9b40',
    };
    return colors[status] || '#b5b5b5';
  }

  private isProcessing(course: Course): boolean {
    return course.status === 'PROCESSING';
  }

  private changeScrollTop(): void {
    this.table.nativeElement.scrollTop = 0;
  }
}
