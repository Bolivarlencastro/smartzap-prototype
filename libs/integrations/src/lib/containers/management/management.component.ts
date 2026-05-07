import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ManagementFilterComponent } from '../../components/management-filter/management-filter.component';
import { ManagementHeaderComponent } from '../../components/management-header/management-header.component';
import { ManagementListComponent } from '../../components/management-list/management-list.component';
import { CoursesListPagination, ManagementFilter, MirroredCoursesViewModel } from '../../models';
import { coursesListFeature } from '../../store';
import { AluraCourseMirrorActions, CoursesListActions, TokensDialogActions } from '../../store/actions';
import { UpdateActiveStatusBatchDto } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'kp-alura-management',
  imports: [
    CommonModule,
    MatDividerModule,
    ManagementHeaderComponent,
    ManagementFilterComponent,
    ManagementListComponent,
  ],
  template: `
    <kp-alura-management-header
      (configureToken)="onOpenTokensConfigDialog()"
      (courseMirrorDialog)="onOpenCourseMirrorDialog()"
    ></kp-alura-management-header>
    <mat-divider></mat-divider>
    @if (vm$ | async; as vm) {
      <kp-alura-management-filter
        [categories]="vm.categories!"
        (searchChange)="onSearch($event)"
        (saveFilter)="onFilter($event)"
      ></kp-alura-management-filter>
      <kp-alura-management-list
        class="grow"
        [vm]="vm"
        (pageChanged)="onPageChange($event)"
        (sort)="onSort($event)"
        (openCourseMirrorDialog)="onOpenCourseMirrorDialog()"
        (delete)="onDelete($event)"
        (toggleActive)="onToggleActive($event)"
        (openDetailDialog)="onOpenDetailDialog($event)"
      ></kp-alura-management-list>
    }
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementComponent implements OnDestroy {
  vm$: Observable<MirroredCoursesViewModel>;

  constructor(private store: Store) {
    store.dispatch(CoursesListActions.init());
    this.vm$ = store.select(coursesListFeature.selectViewModel);
  }

  ngOnDestroy(): void {
    this.store.dispatch(CoursesListActions.resetState());
  }

  onOpenTokensConfigDialog(): void {
    this.store.dispatch(TokensDialogActions.openDialog());
  }

  onPageChange(pagination: Partial<CoursesListPagination>): void {
    this.store.dispatch(CoursesListActions.setPagination({ pagination }));
  }

  onSort(sort: string): void {
    this.store.dispatch(CoursesListActions.sort({ sort }));
  }

  onOpenCourseMirrorDialog(): void {
    this.store.dispatch(AluraCourseMirrorActions.openDialog());
  }

  onDelete(courseIds: string[]): void {
    this.store.dispatch(CoursesListActions.deleteCourse({ courseIds }));
  }

  onToggleActive(data: UpdateActiveStatusBatchDto): void {
    this.store.dispatch(CoursesListActions.toggleActiveCourse({ data }));
  }

  onOpenDetailDialog(courseId: string): void {
    this.store.dispatch(CoursesListActions.openDetailDialog({ courseId }));
  }

  onSearch(search: string): void {
    this.store.dispatch(CoursesListActions.search({ search }));
  }

  onFilter(filter: ManagementFilter): void {
    this.store.dispatch(CoursesListActions.filter({ filter }));
  }
}
