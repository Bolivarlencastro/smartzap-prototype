import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { User } from '@core/model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';

import { MatOption } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-contributors-filter',
  templateUrl: './contributors-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatIcon,
    MatSuffix,
    MatInput,
    MatAutocompleteTrigger,
    FormsModule,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    TranslocoPipe,
  ],
})
export class ContributorsFilterComponent implements OnDestroy {
  @Input() users: User[];
  @Output() filterEvent = new EventEmitter<string>();
  @Output() optionSelected = new EventEmitter<User>();

  protected readonly searchControl = new FormControl<string>('');
  protected readonly defaultUserAvatar = environment.defaultUserAvatar;
  private readonly filterSub: Subscription;

  onSelection(user: User) {
    this.optionSelected.emit(user);
    this.searchControl.setValue('');
  }

  constructor() {
    this.filterSub = this.searchControl.valueChanges
      .pipe(
        filter((value) => !!value),
        distinctUntilChanged(),
        debounceTime(250),
      )
      .subscribe((value) => {
        this.filterEvent.emit(value);
      });
  }

  ngOnDestroy() {
    this.filterSub?.unsubscribe();
  }
}
