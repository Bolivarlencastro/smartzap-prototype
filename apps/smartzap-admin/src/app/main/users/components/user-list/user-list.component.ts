import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { User } from '../../model';
import { environment } from 'environments/environment';
import { Page } from '@app/shared/model';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
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
import { MatCheckbox } from '@angular/material/checkbox';
import { TitleCasePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPhonePipe } from '@keeps-platform-frontend-workspace/ui/kp-phone';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { UserStatusColorPipe } from './pipes/user-status-color.pipe';
import { UserStatusLabelPipe } from './pipes/user-status-label.pipe';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatIcon,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCheckbox,
    MatCellDef,
    MatCell,
    MatSortHeader,
    MatTooltip,
    MatIconButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TitleCasePipe,
    TranslocoPipe,
    KpPhonePipe,
    KpCardTagComponent,
    UserStatusColorPipe,
    UserStatusLabelPipe,
  ],
})
export class UserListComponent {
  @Input() datasource: User[];
  @Input() isLoading!: boolean;
  @Input() page!: Page;
  @Input() selectedUsersCount!: number;
  @Output() sortEvent = new EventEmitter<string>();
  @Output() removeEvent = new EventEmitter<string>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() addUser = new EventEmitter<void>();
  @Output() userSelected = new EventEmitter<{
    id: string;
    selected: boolean;
  }>();
  @Output() deleteSelected = new EventEmitter<string[]>();
  @Output() selectAll = new EventEmitter<void>();

  displayedColumns = ['select', 'avatar', 'name', 'email', 'phone', 'tags', 'sync_check', 'actions'];

  protected readonly skeletonRows = new Array(8);
  protected readonly displayedData = () => (this.isLoading ? this.skeletonRows : (this.datasource ?? []));

  readonly defaultUserAvatar = environment.defaultUserAvatar;

  get hasUserSelected(): boolean {
    return (this.datasource ?? []).some(({ selected }) => selected);
  }

  get isAllSelected(): boolean {
    return (this.datasource ?? []).length > 0 && (this.datasource ?? []).every(({ selected }) => selected);
  }

  sortData(event: Sort): void {
    const { direction, active } = event;

    if (!direction) {
      this.sortEvent.emit('');
      return;
    }

    const sort = direction === 'desc' ? '-' : '';

    this.sortEvent.emit(sort + active);
  }

  toggleSelected(user: User): void {
    this.userSelected.emit({ id: user.id, selected: !user.selected });
  }

  handleDeleteSelected(): void {
    const selectedUserIds = (this.datasource ?? []).filter(({ selected }) => selected).map(({ id }) => id);
    this.deleteSelected.emit(selectedUserIds);
  }

  toggleSelectAll(): void {
    this.selectAll.emit();
  }
}
