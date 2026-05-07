import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TransferDialogFilterRecipient } from './transfer-dialog-filter-recipient';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';

import { MatOption } from '@angular/material/select';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-transfer-dialog-filter',
  templateUrl: './transfer-dialog-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatPrefix,
    MatIconButton,
    MatSuffix,
    MatTooltip,
    MatIcon,
    TranslocoPipe,
  ],
})
export class TransferDialogFilterComponent implements OnInit, OnDestroy {
  @Input() recipients: TransferDialogFilterRecipient[] = [];
  @Input() selectedRecipient!: TransferDialogFilterRecipient;
  @Output() recipientSelected = new EventEmitter<TransferDialogFilterRecipient>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() clearRecipient = new EventEmitter<void>();

  @Input() searchFormControl = new UntypedFormControl('', [KeepsUtils.objectKeyValidator('id', true)]);
  readonly defaultAvatar = environment.defaultUserAvatar;
  private _searchSubscription!: Subscription;

  ngOnInit() {
    this.registerSearchFieldAutoComplete();

    if (this.selectedRecipient) {
      this.searchFormControl.setValue(this.selectedRecipient);
    }
  }

  displayFn(recipient: TransferDialogFilterRecipient): string {
    return recipient?.name ? recipient.name : '';
  }

  autoCompleteOptionSelected(recipient: TransferDialogFilterRecipient) {
    this.recipientSelected.emit(recipient);
  }

  private registerSearchFieldAutoComplete(): void {
    this._searchSubscription = this.searchFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(250),
        filter((searchTerm) => !!searchTerm && typeof searchTerm === 'string'),
        map((searchTerm) => this.filterChange.emit(searchTerm)),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._searchSubscription?.unsubscribe();
  }

  removeRecipient() {
    this.searchFormControl.reset();
    this.clearRecipient.emit();
  }
}
