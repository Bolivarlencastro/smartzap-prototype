import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from 'environments/environment';
import { filter, tap } from 'rxjs/operators';
import { GroupDialogComponent, GroupImportDialogComponent } from '../../components';
import { Group, ImportType } from '../../group.model';
import * as fromActions from '../../store/group.actions';
import * as fromSelectors from '../../store/group.selectors';
import { GroupCollectionComponent } from '../../components/group-collection/group-collection.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { EnrollmentUploadComponent } from '../../../shared/components/upload/enrollment-upload.component';
import { TranslocoPipe } from '@jsverse/transloco';

const DIALOG_CONF: MatDialogConfig = { width: '450px', minWidth: '300px', autoFocus: 'dialog' };

@Component({
  selector: 'app-group-list',
  template: `
    <div class="w-full h-32 border-b border-default flex items-center justify-between px-6">
      <span class="text-2xl font-semibold">{{ 'NAVIGATION.GROUPS' | transloco }}</span>
      <div class="flex py-4">
        <div class="flex flex-col mr-4">
          <a class="mb-2 text-sm" [href]="xmlGroupUsers" target="_blank">{{ 'GROUPS.BUTTON.DOWNLOAD' | transloco }}</a>
          <button
            mat-flat-button
            color="primary"
            (click)="openUserImportDialog('USER')"
            [disabled]="isLoading()"
            data-test="import-users"
          >
            <mat-icon class="s-4 hidden sm:inline-block" svgIcon="microsoftexcel"></mat-icon>
            <span class="ml-2">{{ 'GROUPS.BUTTON.IMPORT_USERS' | transloco }}</span>
          </button>
        </div>
        <div class="flex flex-col mr-4">
          <a class="mb-2 text-sm" [href]="xmlGroupMissions" target="_blank">{{
            'GROUPS.BUTTON.DOWNLOAD' | transloco
          }}</a>
          <button
            mat-flat-button
            color="primary"
            (click)="openUserImportDialog('MISSION')"
            [disabled]="isLoading()"
            data-test="import-missions"
          >
            <mat-icon class="s-4 hidden sm:inline-block" svgIcon="microsoftexcel"></mat-icon>
            <span class="ml-2">{{ 'GROUPS.BUTTON.IMPORT_MISSIONS' | transloco }}</span>
          </button>
        </div>
        <div class="flex flex-col">
          <a class="mb-2 text-sm" [href]="xmlGroupChannels" target="_blank">{{
            'GROUPS.BUTTON.DOWNLOAD' | transloco
          }}</a>
          <app-enrollment-upload
            (upload)="onImport($event, 'CHANNEL')"
            [buttonTitle]="'GROUPS.BUTTON.IMPORT_CHANNELS' | transloco"
            [isLoading]="isLoading()"
            data-test="import-channels"
          ></app-enrollment-upload>
        </div>
      </div>
    </div>
    <kp-table-layout
      class="grow"
      [totalItems]="count()"
      [pageIndex]="currentPage()"
      [pageSize]="perPage()"
      (pageChange)="onPageChange($event)"
      (searchChange)="applyFilter($event)"
    >
      <app-group-collection
        kpTable
        [groups]="groups()"
        [isLoading]="isLoading()"
        (deleteEvent)="onDelete($event)"
        (editEvent)="onEdit($event)"
      ></app-group-collection>
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
  imports: [
    GroupCollectionComponent,
    MatButton,
    MatIcon,
    EnrollmentUploadComponent,
    TranslocoPipe,
    KpTableLayoutComponent,
  ],
})
export class GroupListComponent implements OnInit, OnDestroy {
  protected readonly groups: Signal<Group[]>;
  protected readonly count: Signal<number>;
  protected readonly perPage: Signal<number>;
  protected readonly currentPage: Signal<number>;
  protected readonly isLoading: Signal<boolean>;

  xmlGroupUsers: string;
  xmlGroupMissions: string;
  xmlGroupChannels: string;
  xmlGroupLearningTrails: string;

  constructor(
    private _dialog: MatDialog,
    private store: Store,
  ) {
    this.groups = toSignal(this.store.select(fromSelectors.selectAll));
    this.count = toSignal(this.store.select(fromSelectors.selectTotal));
    this.perPage = toSignal(this.store.select(fromSelectors.selectPerPage));
    this.currentPage = toSignal(this.store.select(fromSelectors.selectCurrentPage));
    this.isLoading = toSignal(this.store.select(fromSelectors.selectIsLoading));

    this.xmlGroupUsers = environment.link.xmlGroupUsers;
    this.xmlGroupMissions = environment.link.xmlGroupMissions;
    this.xmlGroupChannels = environment.link.xmlGroupChannels;
    this.xmlGroupLearningTrails = environment.link.xmlGroupLearningTrails;
  }

  ngOnInit(): void {
    this.store.dispatch(fromActions.loadGroups());
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromActions.clearCache());
  }

  onDelete(id: string): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRef.componentInstance.confirmTitle = 'GROUPS.DIALOG.REMOVE_GROUP_TITLE';
    dialogRef.componentInstance.confirmMessage = 'GROUPS.DIALOG.REMOVE_GROUP_MESSAGE';
    dialogRef.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() => this.store.dispatch(fromActions.deleteGroup({ id }))),
      )
      .subscribe();
  }

  onEdit(data: Group): void {
    const { id } = data;
    const dialogRef = this._dialog.open(GroupDialogComponent, {
      ...DIALOG_CONF,
      data,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap(({ name }) => this.store.dispatch(fromActions.updateGroup({ id, data: { name } }))),
      )
      .subscribe();
  }

  applyFilter(search: string): void {
    this.store.dispatch(fromActions.updateFilter({ search }));
  }

  onImport(data: any, objectType: any, goal_date?: string): void {
    this.store.dispatch(fromActions.importGroup({ data, objectType, goal_date }));
  }

  openUserImportDialog(type: ImportType): void {
    const dialogRef = this._dialog.open(GroupImportDialogComponent, {
      width: '500px',
      minWidth: '300px',
      data: {
        title: this.getImportDialogTitle(type),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result) => !!result))
      .subscribe(({ file, goal_date }) => {
        this.onImport(file, type, goal_date);
      });
  }

  onPageChange({ pageIndex, pageSize }: PageEvent): void {
    this.store.dispatch(fromActions.setPagination({ page: pageIndex + 1, per_page: pageSize }));
  }

  private getImportDialogTitle(type: ImportType) {
    switch (type) {
      case 'USER':
        return marker('GROUPS.DIALOG_IMPORT.TITLE_USERS');
      case 'TRAIL':
        return marker('GROUPS.DIALOG_IMPORT.TITLE_TRAILS');
      case 'MISSION':
        return marker('GROUPS.DIALOG_IMPORT.TITLE_MISSIONS');
      default:
        return '';
    }
  }
}
