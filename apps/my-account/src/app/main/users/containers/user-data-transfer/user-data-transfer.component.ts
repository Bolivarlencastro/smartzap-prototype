import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserDataTransferOption } from '@app/shared/model';
import { KeepsUtils, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import { debounceTime, filter, Observable } from 'rxjs';
import { UserDataTransferActions } from '../../store/actions';
import { userDataTransferFeature } from '../../store/features';

@Component({
  selector: 'app-user-data-transfer',
  imports: [
    MatDialogContent,
    MatDialogClose,
    MatButtonModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    AsyncPipe,
  ],
  template: `
    <div class="text-2xl mb-3">{{ 'GENERAL.IMPORT_DATA' | transloco }}</div>
    <div mat-dialog-content class="text-sm p-0 flex flex-col">
      <div>{{ 'USER_DATA_TRANSFER_DIALOG.SUBTITLE' | transloco }}</div>

      <div class="mt-3 mb-4">
        <mat-form-field class="w-full" appearance="outline">
          <mat-label>{{ 'GENERAL.FROM' | transloco }}</mat-label>
          @if (selectedSourceUserAvatar) {
            <div
              matPrefix
              [style.background]="'url(' + selectedSourceUserAvatar + ')'"
              class="h-8 w-8 bg-cover bg-center rounded-full ml-3 mr-2"
            ></div>
          }
          <input matInput [matAutocomplete]="sourceUserAc" [formControl]="sourceUserControl" />
          <mat-icon matSuffix>search</mat-icon>
          <mat-autocomplete #sourceUserAc="matAutocomplete" [displayWith]="displayWithFn">
            @for (sourceUser of sourceUsers$ | async; track sourceUser.value) {
              <mat-option [value]="sourceUser">
                <div class="flex gap-4 items-center">
                  <div
                    [style.background]="'url(' + sourceUser.avatar + ')'"
                    class="h-8 w-8 bg-cover bg-center rounded-full shrink-0"
                  ></div>
                  <span class="line-clamp-2">{{ sourceUser.label }}</span>
                </div>
              </mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>

        <mat-form-field class="w-full cursor-default" appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'GENERAL.TO' | transloco }}</mat-label>
          <div
            matPrefix
            [style.background]="'url(' + (user?.avatar || defaultUserAvatar) + ')'"
            class="h-8 w-8 bg-cover bg-center rounded-full ml-3 mr-2"
          ></div>
          <input matInput readonly class="cursor-default" [value]="user?.name" />
        </mat-form-field>
      </div>

      <div class="bg-[#F8FAFC] dark:bg-[#f8fafc20] flex flex-col p-4 gap-5">
        <span>{{ 'USER_DATA_TRANSFER_DIALOG.NOTICE_TITLE' | transloco }}</span>
        <span>{{ 'USER_DATA_TRANSFER_DIALOG.NOTICE_SUBTITLE' | transloco }}</span>
      </div>
    </div>
    <div class="mt-5 flex justify-end gap-1">
      <button mat-dialog-close mat-button>
        <span class="text-primary">
          {{ 'GENERAL.CANCEL' | transloco }}
        </span>
      </button>
      <button mat-flat-button color="primary" [disabled]="sourceUserControl.invalid" (click)="transferData()">
        {{ 'GENERAL.IMPORT' | transloco }}
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        padding: 16px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDataTransferComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly defaultUserAvatar = environment.defaultUserAvatar;
  protected sourceUserControl: FormControl<string | UserDataTransferOption>;
  protected sourceUsers$: Observable<UserDataTransferOption[]>;

  get selectedSourceUserAvatar(): string {
    return (this.sourceUserControl.getRawValue() as UserDataTransferOption)?.avatar;
  }

  constructor(
    private dialogRef: MatDialogRef<UserDataTransferComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UserProfile,
    private store: Store,
  ) {
    this.sourceUsers$ = store.select(userDataTransferFeature.selectUsers);
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.store.dispatch(UserDataTransferActions.resetState());
  }

  displayWithFn(option: UserDataTransferOption) {
    return option?.label;
  }

  transferData() {
    const source_user_id = (this.sourceUserControl.getRawValue() as UserDataTransferOption).value;

    this.dialogRef.close({
      source_user_id,
      target_user_id: this.user.id,
    });
  }

  private buildForm() {
    this.sourceUserControl = new FormControl<string>(
      null,
      KeepsUtils.objectKeyValidator<UserDataTransferOption>('value', true),
    );
    this.registerAutocomplete();
  }

  private registerAutocomplete() {
    this.sourceUserControl.valueChanges
      .pipe(
        debounceTime(200),
        filter((value: any): value is string => typeof value === 'string'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((search) => this.store.dispatch(UserDataTransferActions.loadSourceUsers({ search })));
  }
}
