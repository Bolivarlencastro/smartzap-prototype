import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Category } from '@core/model/category.model';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';
import { CategoryDialogComponent } from '../../components';
import { CategoryCollectionComponent } from '../../components/category-collection/category-collection.component';
import * as fromActions from '../../store/category.actions';
import * as fromSelectors from '../../store/category.selectors';

@Component({
  selector: 'app-categories',
  template: `
    <div class="w-full h-32 border-b border-default flex items-center justify-between px-6">
      <span class="text-2xl font-semibold">{{ 'NAVIGATION.CATEGORIES' | transloco }}</span>
      <button mat-flat-button color="primary" class="h-10 w-32" (click)="openDialog()">
        <mat-icon>add</mat-icon>
        <span class="ml-2.5">
          {{ 'GENERAL.CREATE' | transloco }}
        </span>
      </button>
    </div>
    <kp-table-layout class="grow" [hidePaginator]="true" (searchChange)="applyFilter($event)">
      <app-category-collection
        kpTable
        [category]="categories()"
        [isLoading]="isLoading()"
        (deleteEvent)="onDelete($event)"
        (editEvent)="onEdit($event)"
      ></app-category-collection>
    </kp-table-layout>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryCollectionComponent, TranslocoPipe, KpTableLayoutComponent, MatButtonModule, MatIcon],
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  protected readonly categories: Signal<Category[]>;
  protected readonly isLoading: Signal<boolean>;

  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  constructor() {
    this.categories = toSignal(this.store.select(fromSelectors.selectAll));
    this.isLoading = toSignal(this.store.select(fromSelectors.selectIsLoading));
  }

  ngOnInit(): void {
    this.store.dispatch(fromActions.loadCategories());
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromActions.clearCache());
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {});

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((data) => this.store.dispatch(fromActions.addCategory({ data }))),
      )
      .subscribe();
  }

  onDelete(id: string): void {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRef.componentInstance.confirmTitle = 'CATEGORY.DIALOG.REMOVE_CATEGORY_TITLE';
    dialogRef.componentInstance.confirmMessage = 'CATEGORY.DIALOG.REMOVE_CATEGORY_MESSAGE';
    dialogRef.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() => this.store.dispatch(fromActions.deleteCategory({ id }))),
      )
      .subscribe();
  }

  onEdit(data: Category): void {
    const { id } = data;
    const dialogRef = this.dialog.open(CategoryDialogComponent, { data });

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap(({ name, image }) => this.store.dispatch(fromActions.updateCategory({ id, data: { name, image } }))),
      )
      .subscribe();
  }

  applyFilter(search: string): void {
    this.store.dispatch(fromActions.updateFilter({ search }));
  }
}
