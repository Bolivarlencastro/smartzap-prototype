import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Observable } from 'rxjs';
import { ManagementFilterComponent } from '../../components/management-filter/management-filter.component';
import { ManagementFilter, MirrorCourseDialogViewModel } from '../../models';
import { aluraCourseMirrorFeature } from '../../store';
import { AluraStatusColorPipe } from '../../utils/pipes/alura-status-color.pipe';
import { AluraCourseMirrorActions } from '../../store/actions';
import { AluraCourse, KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpInfiniteScrollContainerComponent } from '@keeps-platform-frontend-workspace/ui/kp-infinite-scroll-container';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

@Component({
  selector: 'kp-alura-mirror-course',
  imports: [
    CommonModule,
    TranslocoModule,
    ManagementFilterComponent,
    AluraStatusColorPipe,
    MatDividerModule,
    MatTableModule,
    NgxSkeletonLoaderModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    KpInfiniteScrollContainerComponent,
    KpPluralizeTranslatePipe,
  ],
  templateUrl: './alura-mirror-course.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AluraMirrorCourseComponent {
  vm$: Observable<MirrorCourseDialogViewModel>;
  selection = new SelectionModel<AluraCourse>(true, []);

  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '81px' };
  protected readonly displayedColumns: string[] = [
    'select',
    'name',
    'category',
    'creation_date',
    'alura_status',
    'menu',
  ];

  constructor(
    private dialogRef: MatDialogRef<AluraMirrorCourseComponent>,
    private store: Store,
  ) {
    this.vm$ = store.select(aluraCourseMirrorFeature.selectViewModel);
  }

  isAllSelected(items: AluraCourse[]): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = items.length;
    return numSelected === numRows;
  }

  toggleAllRows(items: AluraCourse[]) {
    if (this.isAllSelected(items)) {
      this.selection.clear();
      return;
    }

    this.selection.select(...items);
  }

  onOpenCourse(url: string): void {
    KeepsUtils.openUrlInNewTab(url);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onMirror(): void {
    const ids = this.selection.selected.map((item) => item.id);
    this.dialogRef.close(ids);
  }

  onFilter(filter: ManagementFilter) {
    this.selection.clear();
    this.store.dispatch(AluraCourseMirrorActions.filter({ filter }));
  }

  onSearch(search: string) {
    this.selection.clear();
    this.store.dispatch(AluraCourseMirrorActions.search({ search }));
  }

  onScroll() {
    this.store.dispatch(AluraCourseMirrorActions.loadMoreCourses());
  }
}
