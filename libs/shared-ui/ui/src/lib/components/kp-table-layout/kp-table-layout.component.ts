import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TranslocoPipe } from '@jsverse/transloco';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { constants } from '../../constants';

@Component({
  selector: 'kp-table-layout',
  templateUrl: './kp-table-layout.component.html',
  styleUrl: './kp-table-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatInput, MatIcon, MatPaginator, TranslocoPipe],
})
export class KpTableLayoutComponent {
  readonly totalItems = input<number>(0);
  readonly pageSize = input<number>(10);
  readonly pageIndex = input<number>(0);
  readonly pageSizeOptions = input<number[]>(constants.defaultPageSizeOptions);
  readonly showFirstLastButtons = input<boolean>(true);
  readonly searchPlaceholder = input<string>('GENERAL.SEARCH');
  readonly hideSearch = input<boolean>(false);
  readonly hidePaginator = input<boolean>(false);

  readonly pageChange = output<PageEvent>();
  readonly searchChange = output<string>();

  protected readonly searchControl = new FormControl<string>('');

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.searchChange.emit(value ?? ''));
  }

  protected onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
