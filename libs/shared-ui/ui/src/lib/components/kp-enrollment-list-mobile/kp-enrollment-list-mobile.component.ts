import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { delay } from 'rxjs';
import { KpEnrollmentStatusColorPipe, KpPerformancePipe, KpPluralizeTranslatePipe } from '../../pipes';
import { KpFilterSelectOption } from '../kp-buildable-filter';
import { KpGlobalSearchInputComponent } from '../kp-global-search-input/kp-global-search-input.component';
import { Enrollment } from '../kp-mission-model/model';
import { KpSelectMenuTriggerComponent, KpSelectTriggerContentDirective } from '../kp-select-menu';
import { KpStatusChipComponent } from '../kp-status-chip/kp-status-chip.component';
import { EnrollmentFilter, ExecuteAction, MobileEnrollmentActions } from './model';

interface EnrollmentFilterForm {
  status: FormControl<string[]>;
}

@Component({
  selector: 'kp-enrollment-list-mobile',
  templateUrl: './kp-enrollment-list-mobile.component.html',
  imports: [
    CommonModule,
    TranslocoModule,
    MatDividerModule,
    InfiniteScrollDirective,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    KpGlobalSearchInputComponent,
    KpStatusChipComponent,
    KpPluralizeTranslatePipe,
    KpEnrollmentStatusColorPipe,
    KpPerformancePipe,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpEnrollmentListMobileComponent implements OnInit {
  @Input() enrollments: Enrollment[];
  @Input() loading: boolean;
  @Input() statuses: KpFilterSelectOption[];
  @Output() filterEvent = new EventEmitter<EnrollmentFilter>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() scrolled = new EventEmitter<string>();
  @Output() externalProvider = new EventEmitter<Enrollment>();
  @Output() executeAction = new EventEmitter<ExecuteAction>();

  readonly filterFormGroup: FormGroup<EnrollmentFilterForm>;
  private readonly destroyRef = inject(DestroyRef);

  constructor(_formBuilder: FormBuilder) {
    this.filterFormGroup = this.buildForm(_formBuilder);
  }

  ngOnInit(): void {
    this.listenToStatusChange();
  }

  onFilterChange(): void {
    this.filterEvent.emit({ status: this.filterFormGroup.get('status').value });
  }

  onSearchChange(search: string) {
    this.searchChange.emit(search);
  }

  onScroll(): void {
    this.scrolled.emit();
  }

  onOpenExternalProvider(item: Enrollment): void {
    this.externalProvider.emit(item);
  }

  onExecuteAction(item: Enrollment) {
    const action = this.getAction(item);
    this.executeAction.emit({ item, action });
  }

  getAction(item: Enrollment): MobileEnrollmentActions {
    const { status, learning_trail } = item;

    if (learning_trail) {
      if (status === EnrollmentStatuses.STARTED || status === EnrollmentStatuses.ENROLLED) {
        return 'giveUp';
      }

      return status === EnrollmentStatuses.COMPLETED ? 'generateCertificate' : 'viewTrail';
    }

    const statusActions: Partial<Record<EnrollmentStatuses, MobileEnrollmentActions | undefined>> = {
      [EnrollmentStatuses.ENROLLED]: 'viewMission',
      [EnrollmentStatuses.STARTED]: 'continue',
      [EnrollmentStatuses.REPROVED]: item.required ? 'viewMission' : 'reEnroll',
      [EnrollmentStatuses.EXPIRED]: 'extendDeadline',
      [EnrollmentStatuses.PENDING_VALIDATION]: 'generateCertificate',
      [EnrollmentStatuses.COMPLETED]: 'generateCertificate',
      [EnrollmentStatuses.GIVE_UP]: 'retake',
    };

    return statusActions[status] ?? undefined;
  }

  displayActionButton(status: EnrollmentStatuses): boolean {
    return [
      EnrollmentStatuses.ENROLLED,
      EnrollmentStatuses.STARTED,
      EnrollmentStatuses.REPROVED,
      EnrollmentStatuses.EXPIRED,
      EnrollmentStatuses.PENDING_VALIDATION,
      EnrollmentStatuses.COMPLETED,
      EnrollmentStatuses.GIVE_UP,
    ].includes(status);
  }

  disableActionButton(status: EnrollmentStatuses): boolean {
    return status === EnrollmentStatuses.PENDING_VALIDATION;
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<EnrollmentFilterForm> {
    return formBuilder.group<EnrollmentFilterForm>({
      status: new FormControl([]),
    });
  }

  private listenToStatusChange(): void {
    this.filterFormGroup
      .get('status')
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef), delay(0))
      .subscribe(() => this.onFilterChange());
  }
}
