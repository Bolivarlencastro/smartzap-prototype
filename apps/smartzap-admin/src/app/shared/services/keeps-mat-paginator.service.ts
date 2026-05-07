import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';

const translateKeys = [
  marker('MAT-PAGINATOR.ITEMS_PER_PAGE'),
  marker('MAT-PAGINATOR.FIRST_PAGE'),
  marker('MAT-PAGINATOR.LAST_PAGE'),
  marker('MAT-PAGINATOR.NEXT_PAGE'),
  marker('MAT-PAGINATOR.PREV_PAGE'),
  marker('MAT-PAGINATOR.PAGE_OF'),
];

@Injectable()
export class KeepsMatPaginator extends MatPaginatorIntl {
  pageOf!: string;

  constructor(translateService: TranslocoService) {
    super();
    translateService.selectTranslate(translateKeys).subscribe((keys) => {
      this.itemsPerPageLabel = keys[0];
      this.firstPageLabel = keys[1];
      this.lastPageLabel = keys[2];
      this.nextPageLabel = keys[3];
      this.previousPageLabel = keys[4];
      this.pageOf = keys[5];
      this.changes.next();
    });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.pageOf} ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} ${this.pageOf} ${length}`;
  };
}
