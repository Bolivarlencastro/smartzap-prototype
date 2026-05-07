import { SelectionModel } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, pairwise, throttleTime } from 'rxjs/operators';
import { SimpleFilterListItem } from '../../interfaces';
import { NgClass } from '@angular/common';
import { MatBadge } from '@angular/material/badge';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatSuffix, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-filter-selection-list',
  templateUrl: './filter-selection-list.component.html',
  styleUrls: ['./filter-selection-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    MatBadge,
    MatDivider,
    MatFormField,
    MatInput,
    MatIcon,
    MatSuffix,
    MatHint,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    MatSelectionList,
    CdkVirtualForOf,
    MatListOption,
    MatProgressSpinner,
    TranslocoPipe,
  ],
})
export class FilterSelectionListComponent implements AfterViewInit, OnInit {
  @Input() isLoading!: boolean;
  @Input() hasNoItems!: boolean;
  @Input() multiple!: boolean;
  @Input() subtitle!: string;
  @Input() optionsTotal!: number;
  @Input() items!: SimpleFilterListItem[];
  @Output() loadMoreItems: EventEmitter<void>;
  @Output() searchChanged: EventEmitter<string>;

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;
  @ViewChild('searchInput') searchInput!: ElementRef;

  selectedItems!: SelectionModel<string>;
  isAllSelected!: boolean;
  virtualForCacheSize!: number;

  get selectedCount() {
    return this.isAllSelected ? this.optionsTotal : this.selectedItems.selected.length;
  }

  get isFiltering(): boolean {
    return this.searchInput?.nativeElement.value.length > 0;
  }

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
    this.loadMoreItems = new EventEmitter();
    this.searchChanged = new EventEmitter();
  }

  ngOnInit(): void {
    this.selectedItems = new SelectionModel(this.multiple);

    // By default, virtual scroll caches the view to render items faster.
    // This doesn't work well with the selection list because it won't update the state of each checkbox as the user
    // scrolls through the content. As a workaround we disable the cache so the state of each checkbox will be updated
    // properly https://github.com/angular/components/issues/10122
    this.virtualForCacheSize = this.multiple ? 0 : 20;
  }

  ngAfterViewInit(): void {
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(200),
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.loadMoreItems.next();
        });
      });

    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        map((event: any) => event.target.value),
        distinctUntilChanged(),
      )
      .subscribe((search) => this.onSearch(search));
  }

  selectionChange(itemId: string): void {
    // When all options are selected via toggleAll, we don't keep track of the selected options in the selectionModel,
    // so we clear the selection when one is changed
    if (this.isAllSelected && !this.allSelectedManually()) {
      this.toggleAll();
      return;
    }

    this.selectedItems.toggle(itemId);

    // If the user selected all options manually, we mark the checkbox
    this.isAllSelected = this.allSelectedManually();
  }

  clear(): void {
    this.isAllSelected = false;
    this.selectedItems.clear();
    this.searchInput.nativeElement.value = '';
  }

  toggleAll(): void {
    if (!this.multiple) {
      return;
    }
    this.selectedItems.clear();
    this.isAllSelected = !this.isAllSelected;
    this.cdr.detectChanges();
  }

  isSelected(itemID: string): boolean {
    return this.isAllSelected ? true : this.selectedItems.isSelected(itemID);
  }

  private onSearch(searchTerm: string): void {
    this.searchChanged.emit(searchTerm);
    if (this.multiple && this.isAllSelected) {
      this.isAllSelected = false;
      this.selectedItems.clear();
    }
  }

  private allSelectedManually(): boolean {
    return this.multiple && !this.isFiltering && this.optionsTotal === this.selectedItems.selected.length;
  }
}
