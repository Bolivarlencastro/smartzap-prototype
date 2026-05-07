import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EventManagementAction } from '../../models/actions';
import { EventManagementViewModel } from '../../models/view-model';
import { EventManagementActions } from '../../store/actions';
import { eventManagementFeature } from '../../store/features';

@Component({
  selector: 'app-event-management-header',
  imports: [
    MatIconModule,
    MatButtonModule,
    TranslocoModule,
    KpPluralizeTranslatePipe,
    MatMenuModule,
    MatDivider,
    NgxSkeletonLoaderModule,
  ],
  template: `
    @if (vm()?.eventLoading) {
      <div class="h-32 flex items-center px-6">
        <ngx-skeleton-loader animation="pulse" appearance="circle" [theme]="iconButtonTheme"></ngx-skeleton-loader>

        <div class="flex flex-col">
          <ngx-skeleton-loader animation="pulse" [theme]="titleTheme"></ngx-skeleton-loader>
          <ngx-skeleton-loader animation="pulse" [theme]="infoTheme"></ngx-skeleton-loader>
        </div>

        <div class="flex gap-2 ml-auto items-center">
          <ngx-skeleton-loader animation="pulse" [theme]="addUsersTheme"></ngx-skeleton-loader>
          <ngx-skeleton-loader animation="pulse" appearance="circle" [theme]="iconButtonTheme"></ngx-skeleton-loader>
        </div>
      </div>
    } @else {
      <div class="flex items-center h-32 gap-2 px-6 border-b border-default">
        <button matIconButton (click)="onGoBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>

        <div class="flex flex-col">
          <span class="text-lg font-bold">{{ vm()?.event?.name }}</span>
          <div class="text-sm flex gap-1.5">
            <span class="font-bold">{{ eventModelLabel | transloco }}:</span>

            @if (seats()) {
              <span>
                <strong>{{ seats() }}</strong>
                {{ 'EVENT_MANAGEMENT.SEATS' | kpPluralizeTranslate: { value: seats() } }}
              </span>
            }

            <span>
              <strong>{{ vm()?.event?.users_enrolled }}</strong>
              {{ 'EVENT_MANAGEMENT.SUBSCRIBER' | kpPluralizeTranslate: { value: vm()?.event?.users_enrolled } }}
            </span>
            <span>
              <strong>{{ selectedDateAttendance() }}</strong>
              {{ 'EVENT_MANAGEMENT.ATTENDANCE' | kpPluralizeTranslate: { value: selectedDateAttendance() } }}
            </span>
          </div>
        </div>

        <div class="ml-auto flex gap-2">
          <button matButton="outlined" class="flex gap-2" (click)="enrollUsers()" [disabled]="vacancyLimitReached()">
            <mat-icon>group_add</mat-icon>
            <span>{{ 'EVENT_MANAGEMENT.ADD_USERS_BUTTON' | transloco }}</span>
          </button>
          <button matIconButton class="more-vert-icon" [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>

          @let eventFinished = isFinished();
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="onDispatchAction('edit')" [disabled]="eventFinished">
              <mat-icon>edit</mat-icon>
              <span>{{ 'EVENT_MANAGEMENT.ACTION.EDIT_EVENT' | transloco }}</span>
            </button>
            <mat-divider></mat-divider>
            @if (!eventFinished) {
              <button mat-menu-item (click)="onDispatchAction('qr-code')">
                <mat-icon>qr_code</mat-icon>
                <span>QR Code</span>
              </button>
            }
            <button mat-menu-item (click)="onDispatchAction('print-list')">
              <mat-icon>print</mat-icon>
              <span>{{ 'EVENT_MANAGEMENT.ACTION.PRINT_LIST' | transloco }}</span>
            </button>
            <button mat-menu-item (click)="onDispatchAction('import-list')">
              <mat-icon>upload</mat-icon>
              <span>{{ 'EVENT_MANAGEMENT.ACTION.IMPORT_LIST' | transloco }}</span>
            </button>
            @if (!eventFinished) {
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="onDispatchAction('finish')">
                <mat-icon>verified</mat-icon>
                <span>{{ 'EVENT_MANAGEMENT.ACTION.FINISH_EVENT' | transloco }}</span>
              </button>
            }
          </mat-menu>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .more-vert-icon {
        border: 1px solid var(--mat-sys-outline);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventManagementHeaderComponent {
  protected readonly vm: Signal<EventManagementViewModel>;

  readonly isFinished: Signal<boolean>;
  readonly seats = computed(() => this.getSeats());
  readonly vacancyLimitReached = computed(() => this.hasReachedVacancyLimit());
  readonly selectedDateAttendance = computed(() => {
    const dateId = this.vm()?.filter?.date_id;
    return this.vm()?.dateFilterOptions?.find((d) => d.id === dateId)?.count_users_attending;
  });

  protected readonly iconButtonTheme = { width: '40px', height: '40px' };
  protected readonly titleTheme = { width: '260px', height: '24px', margin: 0 };
  protected readonly infoTheme = { width: '128px', height: '14px', margin: 0 };
  protected readonly addUsersTheme = { width: '200px', height: '40px', margin: 0, 'border-radius': '20px' };

  get eventModelLabel(): string {
    if (this.vm()?.event?.mission_model === 'PRESENTIAL') {
      return 'EVENT_MANAGEMENT.PRESENTIAL';
    }

    return 'EVENT_MANAGEMENT.ONLINE';
  }

  constructor(
    private readonly store: Store,
    private readonly location: Location,
  ) {
    this.vm = toSignal(store.select(eventManagementFeature.selectViewModel));
    this.isFinished = toSignal(store.select(eventManagementFeature.selectIsFinished));
  }

  onGoBack() {
    this.location.back();
  }

  onDispatchAction(action: EventManagementAction) {
    this.store.dispatch(EventManagementActions.dispatchAction({ action }));
  }

  protected enrollUsers() {
    const remainingSeats = this.verifyRemainingSeats();
    this.store.dispatch(EventManagementActions.enrollUsers({ remainingSeats }));
  }

  private getSeats() {
    const event = this.vm()?.event;
    const missionModel = event?.mission_model?.toLowerCase();
    return event?.[missionModel]?.seats;
  }

  private hasReachedVacancyLimit() {
    const seats = this.seats();
    const usersEnrolled = this.vm()?.event?.users_enrolled;

    if (!seats) {
      return false;
    }

    return usersEnrolled >= seats;
  }

  private verifyRemainingSeats(): number {
    const seats = this.seats();
    const usersEnrolled = this.vm()?.event?.users_enrolled;

    if (!seats) {
      return null;
    }

    return seats - usersEnrolled;
  }
}
