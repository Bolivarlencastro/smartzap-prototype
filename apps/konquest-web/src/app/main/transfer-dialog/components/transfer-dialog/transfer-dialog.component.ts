import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { Recipient, TransferContent, TransferDialogData, TransferStep } from '../../models';
import { Store } from '@ngrx/store';
import { TransferDialogActions } from '../../store/actions';
import { TransferDialogSelectors } from '../../store/selectors';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TransferDialogFilterComponent } from 'app/shared/components/transfer-dialog-filter/transfer-dialog-filter.component';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    TransferDialogFilterComponent,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class TransferDialogComponent implements OnInit, OnDestroy {
  currentStep$!: Observable<TransferStep>;
  transferContent$!: Observable<TransferContent | undefined>;
  selectedRecipient$!: Observable<Recipient | null>;
  filteredRecipients$!: Observable<Recipient[]>;
  positiveButtonLabel$!: Observable<string>;
  negativeButtonLabel$!: Observable<string>;
  isLoading$!: Observable<boolean>;
  subTitle$!: Observable<string>;
  title$!: Observable<string>;

  TransferStep: typeof TransferStep = TransferStep;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: TransferDialogData,
    private store: Store,
  ) {
    this.store.dispatch(TransferDialogActions.setTransferData({ data: this._data }));
  }

  ngOnInit() {
    this.currentStep$ = this.store.select(TransferDialogSelectors.selectCurrentStep);
    this.title$ = this.store.select(TransferDialogSelectors.selectDialogTitle);
    this.subTitle$ = this.store.select(TransferDialogSelectors.selectDialogSubtitle);
    this.transferContent$ = this.store.select(TransferDialogSelectors.selectTransferContent);
    this.selectedRecipient$ = this.store.select(TransferDialogSelectors.selectEdRecipient);
    this.filteredRecipients$ = this.store.select(TransferDialogSelectors.selectFilteredRecipients);
    this.positiveButtonLabel$ = this.store.select(TransferDialogSelectors.selectPositiveButtonLabel);
    this.negativeButtonLabel$ = this.store.select(TransferDialogSelectors.selectNegativeButtonLabel);
    this.isLoading$ = this.store.select(TransferDialogSelectors.selectLoading);
  }

  ngOnDestroy() {
    this.store.dispatch(TransferDialogActions.resetState());
  }

  filterChange(searchTerm: string) {
    this.store.dispatch(TransferDialogActions.filterRecipients({ searchTerm }));
  }

  actionButtonClick(positiveButton: boolean) {
    if (positiveButton) {
      this.store.dispatch(TransferDialogActions.positiveButtonClick());
      return;
    }
    this.store.dispatch(TransferDialogActions.negativeButtonClick());
  }

  autoCompleteOptionSelected(recipient: Recipient) {
    this.store.dispatch(TransferDialogActions.setRecipient({ recipient }));
  }

  clearRecipient() {
    this.store.dispatch(TransferDialogActions.removeRecipient());
  }
}
