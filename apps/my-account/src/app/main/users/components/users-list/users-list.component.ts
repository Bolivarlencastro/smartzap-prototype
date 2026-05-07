import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  OnDestroy,
  output,
  ViewChild,
} from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { environment } from 'environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { BatchActionsViewModel, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
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
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TitleCasePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPhonePipe } from '@keeps-platform-frontend-workspace/ui/kp-phone';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .mat-ripple {
        overflow: visible !important;
      }

      .permission-item {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
      }

      .tag-shadow {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
      }
    `,
  ],
  imports: [
    MatTable,
    MatSort,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    RouterLink,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCheckbox,
    MatCellDef,
    MatCell,
    MatSortHeader,
    MatTooltip,
    MatSlideToggle,
    TitleCasePipe,
    TranslocoPipe,
    KpPhonePipe,
    NgxSkeletonLoaderModule,
  ],
})
export class UsersListComponent implements AfterViewInit, OnDestroy {
  readonly defaultUserAvatar = environment.defaultUserAvatar;
  private _unsubscribeAll: Subject<any> = new Subject();

  users = input<UserProfile[]>();
  isLoading = input<boolean>();
  displayedColumns = input<string[]>();
  batchActionsVm = input<BatchActionsViewModel>();
  selection = model<SelectionModel<UserProfile>>();

  sortChanged = output<Sort>();
  statusChanged = output<UserProfile>();
  clearTotalSelection = output<void>();

  @ViewChild(MatSort) sort!: MatSort;

  readonly hiddenTable = computed(() => this.isLoading() || !this.users()?.length);
  readonly emptyState = computed(() => !this.isLoading() && !this.users()?.length);
  readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  ngAfterViewInit(): void {
    this.sort?.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe((sort) => this.sortChanged.emit(sort));
  }

  onChangeStatus(user: UserProfile): void {
    this.statusChanged.emit(user);
  }

  toggleAllRows(): void {
    const isTotalSelected = this.batchActionsVm().isTotalSelected;

    if (isTotalSelected) {
      this.onClearTotalSelection();
    }

    if (this.isAllSelected()) {
      this.selection().clear();
      return;
    }

    this.selection().select(...this.users());
  }

  toggleOneRow(event: MatCheckboxChange, item: UserProfile): void {
    const isTotalSelected = this.batchActionsVm().isTotalSelected;

    if (event) {
      this.selection().toggle(item);
    }

    if (isTotalSelected) {
      this.onClearTotalSelection();
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection().selected.length;
    const numRows = this.users().length;
    return numSelected === numRows;
  }

  onClearTotalSelection(): void {
    this.clearTotalSelection.emit();
  }
}
