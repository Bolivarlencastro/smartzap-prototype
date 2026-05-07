import { CommonModule, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@jsverse/transloco';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { KpDisableContinueMissionDirective } from '../../directives';
import { KpDurationPipe } from '../../pipes';
import { KpGlobalSearchInputComponent } from '../kp-global-search-input/kp-global-search-input.component';
import { GlobalSearchItem, ItemType } from '../kp-global-search-item';
import { ContentTypeTab, ContentTypeTabs } from '../kp-global-search-list';
import { KpGlobalSearchResultsCounterComponent } from '../kp-global-search-results-counter';
import { KpCardTagComponent } from '../kp-card-tag';

@Component({
  selector: 'kp-global-search-mobile',
  templateUrl: './kp-global-search-mobile.component.html',
  imports: [
    CommonModule,
    TranslocoModule,
    InfiniteScrollDirective,
    KpDisableContinueMissionDirective,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    KpGlobalSearchInputComponent,
    KpGlobalSearchResultsCounterComponent,
    UpperCasePipe,
    KpDurationPipe,
    KpCardTagComponent,
  ],
  styles: [
    `
      :host {
        overflow: hidden;
      }

      .tab-container {
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-behavior: smooth;
      }

      .tab-container::-webkit-scrollbar {
        display: none;
      }

      .custom-nav {
        display: inline-flex;
        width: max-content;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpGlobalSearchMobileComponent {
  @Input() items: GlobalSearchItem[];
  @Input() count: number;
  @Input() loading: boolean;
  @Input() loadingMore: boolean;
  @Input() tabs: ContentTypeTab[];
  @Input() enrollmentStatus: any;
  @Input() activeTab: ContentTypeTabs;
  @Input() searchTerm: string;

  @Output() openDetails = new EventEmitter<GlobalSearchItem>();
  @Output() scrolled = new EventEmitter<void>();
  @Output() contentType = new EventEmitter<ContentTypeTabs>();
  @Output() serchTerm = new EventEmitter<string>();
  @Output() openContent = new EventEmitter<GlobalSearchItem>();

  itemType = ItemType;

  isActive(tab: ContentTypeTabs): boolean {
    return this.activeTab === tab;
  }

  changeTab(tab: ContentTypeTabs): void {
    if (this.isActive(tab)) {
      return;
    }
    this.activeTab = tab;
    this.contentType.emit(tab);
  }

  onOpenDetails(item: GlobalSearchItem): void {
    this.openDetails.emit(item);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  filterByTerm(term: string): void {
    this.serchTerm.emit(term);
  }

  onScroll(): void {
    this.scrolled.emit();
  }

  onOpenContent(item: GlobalSearchItem, event: Event): void {
    this.openContent.emit(item);
    event.stopPropagation();
  }
}
