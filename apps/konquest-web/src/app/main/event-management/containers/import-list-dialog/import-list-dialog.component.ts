import { ChangeDetectionStrategy, Component, Inject, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ImportMenuItem } from '@app/main/mission/mission.model';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { ImportListContentComponent } from '../../components/import-list-content/import-list-content.component';
import { ImportListFooterComponent } from '../../components/import-list-footer/import-list-footer.component';
import { IMPORT_SOURCE_ITEMS, ImportListDialogData, ImportListViewModel } from '../../models/import-list';
import { ImportListActions } from '../../store/actions';
import { importListFeature } from '../../store/features';

@Component({
  selector: 'app-import-list-dialog',
  imports: [TranslocoModule, MatDialogModule, ImportListContentComponent, ImportListFooterComponent],
  template: `
    <span mat-dialog-title class="text-2xl">
      {{ 'EVENT_MANAGEMENT.IMPORT_LIST.TITLE' | transloco }}
    </span>

    <app-import-list-content
      [viewMode]="vm()?.viewMode"
      [loading]="vm()?.loading"
      [importData]="vm()?.importData"
      [importDataSource]="vm()?.importDataSource"
      [importSourceItems]="importSourceItems"
      [dates]="vm()?.dates"
      (fileSelected)="onFileChangeOnInit($event)"
    ></app-import-list-content>

    <app-import-list-footer
      [viewMode]="vm()?.viewMode"
      [loading]="vm()?.loading"
      [importSourceItems]="importSourceItems"
      (fileSelected)="onFileChangeOnError($event)"
      (continueImport)="onContinue()"
      (confirmImport)="onConfirm()"
    ></app-import-list-footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportListDialogComponent implements OnDestroy {
  vm: Signal<ImportListViewModel>;
  importSourceItems: ImportMenuItem[] = IMPORT_SOURCE_ITEMS;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: ImportListDialogData,
    private readonly matDialogRef: MatDialogRef<ImportListDialogComponent>,
    private readonly store: Store,
  ) {
    store.dispatch(ImportListActions.init({ eventId: data?.eventId, dates: data?.dates }));
    this.vm = toSignal(store.select(importListFeature.selectViewModel));
  }

  ngOnDestroy() {
    this.store.dispatch(ImportListActions.reset());
  }

  onFileChangeOnInit({ selectedDateId, file }) {
    this.store.dispatch(ImportListActions.selectFileOnInit({ selectedDateId, file }));
  }

  onFileChangeOnError(file: File) {
    this.store.dispatch(ImportListActions.checkImportFile({ file }));
  }

  onContinue() {
    this.store.dispatch(ImportListActions.continueImport());
  }

  onConfirm() {
    this.store.dispatch(ImportListActions.confirmImport());
    this.matDialogRef.close();
  }
}
