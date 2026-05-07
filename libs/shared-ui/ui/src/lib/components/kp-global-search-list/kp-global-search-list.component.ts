import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GlobalSearchItem } from '../kp-global-search-item';
import { ContentTypeTab, ContentTypeTabs } from './model/global-search-list.model';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { KpGlobalSearchItemComponent } from '../kp-global-search-item/kp-global-search-item.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatProgressBar } from '@angular/material/progress-bar';
import { KpGlobalSearchResultsCounterComponent } from '../kp-global-search-results-counter/kp-global-search-results-counter.component';
import { MatDivider } from '@angular/material/divider';

import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'kp-global-search-list',
  templateUrl: './kp-global-search-list.component.html',
  imports: [
    MatTabNav,
    MatTabLink,
    MatDivider,
    MatTabNavPanel,
    KpGlobalSearchResultsCounterComponent,
    MatProgressBar,
    InfiniteScrollDirective,
    KpGlobalSearchItemComponent,
    MatProgressSpinner,
    TranslocoPipe,
    MatSidenavModule,
  ],
  styles: `
    :host {
      --mat-sidenav-container-width: 210px;
    }

    .filter-bg {
      background-color: transparent;
    }
  `,
})
export class KpGlobalSearchListComponent {
  @ViewChild('drawer') drawer: MatDrawer;

  @Input() items: GlobalSearchItem[];
  @Input() count: number;
  @Input() loading: boolean;
  @Input() loadingMore: boolean;
  @Input() tabs: ContentTypeTab[];
  @Input() activeTab: ContentTypeTabs;

  @Output() openDetails = new EventEmitter<GlobalSearchItem>();
  @Output() scrolled = new EventEmitter();
  @Output() contentType = new EventEmitter<ContentTypeTabs>();
  @Output() openContent = new EventEmitter<GlobalSearchItem>();

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

  onOpenContent(item: GlobalSearchItem): void {
    this.openContent.emit(item);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  toggleFilter() {
    this.drawer.toggle();
  }
}
