import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { MissionAutocompleteItem } from './mission-autocomplete-item';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';

import { MatOption } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-mission-autocomplete',
  templateUrl: './mission-autocomplete.component.html',
  styleUrls: ['./mission-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatIcon,
    MatIconButton,
    MatTooltip,
    TranslocoPipe,
  ],
})
export class MissionAutocompleteComponent implements OnDestroy {
  @Input() autocompleteLabel!: string;
  @Input() filteredItems: MissionAutocompleteItem[] = [];
  @Input() currentItems: MissionAutocompleteItem[] = [];
  @Input() showCreateButton = false;
  @Input() showAvatar = true;
  @Output() filterItems = new EventEmitter<string>();
  @Output() addItem = new EventEmitter<MissionAutocompleteItem>();
  @Output() removeItem = new EventEmitter<MissionAutocompleteItem>();
  @Output() createNewItem = new EventEmitter<void>();
  autocompleteFormControl = new FormControl<string | null>(null);

  private _filterSub: Subscription;
  readonly defaultAvatar = environment.defaultUserAvatar;

  constructor() {
    this.initAutocomplete();
  }

  autoCompleteOptionSelected(selectedItem: MissionAutocompleteItem | number) {
    if (typeof selectedItem === 'object') {
      this.onAddItem(selectedItem);
      return;
    }
    this.createNewItem.emit();
  }

  onRemoveItem(item: MissionAutocompleteItem): void {
    this.removeItem.emit(item);
  }

  private onAddItem(item: MissionAutocompleteItem): void {
    this.addItem.emit(item);
    this.autocompleteFormControl.reset();
  }

  private initAutocomplete(): void {
    this._filterSub = this.autocompleteFormControl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter((value: any) => value && typeof value === 'string' && !!value.trim().length),
      )
      .subscribe((filterValue) => this.filterItems.emit(filterValue));
  }

  emptyDisplayWith(_: any): string {
    return '';
  }

  ngOnDestroy(): void {
    this._filterSub?.unsubscribe();
  }
}
