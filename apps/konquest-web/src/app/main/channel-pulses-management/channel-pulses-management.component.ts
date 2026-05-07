import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  Signal,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ChannelPulsesManagementHeaderComponent } from './containers/channel-pulses-management-header/channel-pulses-management-header.component';
import { ChannelPulsesManagementListComponent } from './containers/channel-pulses-management-list/channel-pulses-management-list.component';
import { ChannelPulsesManagementActions } from './store/actions';
import { PageEvent } from '@angular/material/paginator';
import { ChannelPulsesManagementFilter } from 'app/main/channel-pulses-management/models/channel-pulses-management.model';
import { channelPulsesManagementFeature } from 'app/main/channel-pulses-management/store/features';
import { toSignal } from '@angular/core/rxjs-interop';
import { KpUploadDialogComponent, KpUploadDialogItem } from '@keeps-platform-frontend-workspace/ui/kp-upload-dialog';
import { PulseUploadService } from 'app/main/channel/pages/detail/pulse-upload.service';
import { ChannelPulsesCreateService } from './services/channel-pulses-create.service';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

@Component({
  selector: 'app-channel-pulses-management',
  imports: [
    ChannelPulsesManagementHeaderComponent,
    ChannelPulsesManagementListComponent,
    KpUploadDialogComponent,
    KpTableLayoutComponent,
  ],
  template: `
    <app-channel-pulses-management-header (createPulse)="onNewPulse()"></app-channel-pulses-management-header>
    <kp-table-layout
      class="grow"
      [totalItems]="totalItems()"
      [pageIndex]="currentPage()"
      [pageSize]="perPage()"
      (pageChange)="pageChanged($event)"
      (searchChange)="onSearch($event)"
    >
      <app-channel-pulses-management-list kpTable></app-channel-pulses-management-list>
    </kp-table-layout>
    @if (uploads(); as uploads) {
      <kp-upload-dialog
        [hidden]="!uploads.length"
        [files]="uploads"
        (remove)="onClickRemove($event)"
      ></kp-upload-dialog>
    }
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
})
export class ChannelPulsesManagementComponent implements OnInit, OnDestroy {
  @ViewChild(KpUploadDialogComponent)
  protected uploadDialogComponent?: KpUploadDialogComponent;

  readonly channelId = input<string>();
  protected readonly totalItems: Signal<number>;
  protected readonly currentPage: Signal<number>;
  protected readonly perPage: Signal<number>;
  protected readonly filter: Signal<ChannelPulsesManagementFilter>;
  protected readonly uploads: Signal<KpUploadDialogItem[]>;

  private readonly pulseUploadService = inject(PulseUploadService);
  private readonly createService = inject(ChannelPulsesCreateService);

  constructor(private readonly store: Store) {
    this.filter = toSignal(this.store.select(channelPulsesManagementFeature.selectFilter));
    this.currentPage = computed(() => (this.filter().page ?? 1) - 1);
    this.perPage = computed(() => this.filter().per_page);
    this.totalItems = toSignal(this.store.select(channelPulsesManagementFeature.selectTotalItems));
    this.uploads = this.pulseUploadService.displayedUploads;
  }

  ngOnInit() {
    this.store.dispatch(ChannelPulsesManagementActions.init({ channelId: this.channelId() }));
  }

  ngOnDestroy() {
    this.store.dispatch(ChannelPulsesManagementActions.reset());
    this.pulseUploadService.clearUploads();
  }

  onSearch(search: string) {
    this.store.dispatch(ChannelPulsesManagementActions.setFilter({ filter: { search } }));
  }

  protected onNewPulse(): void {
    this.store.dispatch(ChannelPulsesManagementActions.createPulse());
    const sub = this.createService.expandPanel$.subscribe(() => {
      this.uploadDialogComponent?.expansionPanel?.open();
      sub.unsubscribe();
    });
  }

  protected onClickRemove(file: KpUploadDialogItem): void {
    this.pulseUploadService.cancelFileUpload(file.id);
  }

  protected pageChanged(event: PageEvent) {
    const page = event.pageIndex + 1;
    const perPage = event.pageSize;
    this.store.dispatch(ChannelPulsesManagementActions.setPagination({ page, perPage }));
  }
}
