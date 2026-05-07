import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Category } from '@core/model/category.model';
import { MatDialog } from '@angular/material/dialog';
import { CategoryMissionComponent, CategoryMissionItem } from '../category-mission/category-mission.component';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
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
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-category-collection',
  templateUrl: './category-collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgxSkeletonLoaderModule,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIcon,
    MatTooltip,
    MatButton,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslocoPipe,
  ],
})
export class CategoryCollectionComponent {
  readonly category = input<Category[]>();
  readonly isLoading = input<boolean | null>();
  readonly deleteEvent = output<string>();
  readonly editEvent = output<Category>();

  protected readonly hiddenTable = computed(() => this.isLoading() || !this.category()?.length);
  protected readonly emptyState = computed(() => !this.isLoading() && !this.category()?.length);
  protected readonly showSkeleton = computed(() => !this.category()?.length && !!this.isLoading());

  protected readonly displayedColumns: string[] = ['image', 'name', 'missions', 'channels', 'actions'];
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  private readonly dialog = inject(MatDialog);

  onOpenDialog(items: CategoryMissionItem[], title: string): void {
    const dialogRef = this.dialog.open(CategoryMissionComponent, {
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.componentInstance.items = items;
    dialogRef.componentInstance.dialogTitle = title;
  }
}
