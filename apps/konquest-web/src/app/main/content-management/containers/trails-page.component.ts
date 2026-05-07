import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ContentPageBaseComponent } from './content-page-base';
import { TrailsListComponent } from '../components/trails-list/trails-list.component';
import { TrailsFiltersComponent } from '../components/filters/trails-filters.component';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

@Component({
  selector: 'app-trails-page',
  imports: [TrailsListComponent, TrailsFiltersComponent, KpTableLayoutComponent],
  template: `
    <kp-table-layout
      class="grow"
      [totalItems]="totalItems()"
      [pageIndex]="currentPage() - 1"
      [pageSize]="perPage()"
      (pageChange)="pageChanged($event)"
      (searchChange)="filterChanged({ search: $event })"
    >
      <app-trails-filters
        kpTableFilterAfter
        [languages]="languages()"
        [isContentCreator]="forceFilterOnlyManaged"
        (filterChange)="filterChanged($event)"
      ></app-trails-filters>

      <app-trails-list
        kpTable
        [learnContents]="learnContents()"
        [isLoading]="loading()"
        (itemAction)="onItemAction($event)"
      ></app-trails-list>
    </kp-table-layout>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailsPageComponent extends ContentPageBaseComponent implements OnInit {
  ngOnInit() {
    this.loadContents();
  }
}
