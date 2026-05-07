import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-content-management-paginator',
  imports: [MatPaginator],
  template: ` <mat-paginator
    [length]="totalItems()"
    [pageSize]="pageSize()"
    [pageIndex]="currentPageIndex()"
    [pageSizeOptions]="PAGE_SIZE_OPTIONS"
    [showFirstLastButtons]="true"
    (page)="onPageChange($event)"
    class="w-full"
  >
  </mat-paginator>`,
  styles: `
    :host {
      display: block;
      border-top: 1px solid var(--mat-sys-outline-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentManagementPaginatorComponent {
  protected readonly PAGE_SIZE_OPTIONS = constants.defaultPageSizeOptions;
  protected readonly pageChange = output<PageEvent>();
  readonly totalItems = input<number>(0);
  readonly pageSize = input<number>(0);
  readonly currentPageIndex = input<number>(0);

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
}
