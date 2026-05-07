import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  KpSelectMenuTriggerComponent,
  KpSelectTriggerContentDirective,
} from '@keeps-platform-frontend-workspace/ui/kp-select-menu';
import { debounceTime } from 'rxjs';
import { UsersFilter } from '../../model';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatIcon,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    TranslocoPipe,
  ],
})
export class UserFilterComponent implements OnInit {
  readonly filters = input<UsersFilter>();
  readonly availableTags = input<string[]>([]);
  readonly filterEvent = output<UsersFilter>();

  protected readonly availableSyncStatuses = [
    { value: 'synced', label: 'USERS.STATUS.SYNCED' },
    { value: 'not_synced', label: 'USERS.STATUS.NOT_SYNCED' },
  ];

  protected readonly form = new FormGroup({
    tags: new FormControl<string[]>([]),
    synced: new FormControl<string[]>([]),
  });

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const initial = this.filters();
    if (initial) {
      this.form.patchValue({ tags: initial.tags ?? [], synced: initial.synced ?? [] }, { emitEvent: false });
    }

    this.form.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ tags, synced }) => {
        this.filterEvent.emit({ tags: tags ?? [], synced: synced ?? [] });
      });
  }
}
