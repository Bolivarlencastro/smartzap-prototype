import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MissionInformationDate } from '@app/main/mission/mission.model';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-event-dates',
  template: `
    @if (eventDates()?.length) {
      @if (eventDates()?.length > 1) {
        <div class="flex items-center cursor-pointer" [matMenuTriggerFor]="datesMenu">
          <div class="first-letter:uppercase text-xs xxs:text-sm">
            {{ activeDate()?.start_at | date: 'EEE, dd/MM/yyyy, HH:mm' }}
          </div>
          <div class="text-xs xxs:text-sm">&nbsp; - {{ activeDate()?.end_at | date: 'HH:mm' }}</div>
          <mat-icon>arrow_drop_down</mat-icon>
        </div>

        <mat-menu #datesMenu="matMenu">
          @for (date of eventDates(); track date) {
            <button mat-menu-item class="flex items-center">
              <div class="first-letter:uppercase text-xs xxs:text-sm">
                {{ date.start_at | date: 'EEE, dd/MM/yyyy, HH:mm' }}
              </div>
              <div class="text-xs xxs:text-sm">&nbsp; - {{ date.end_at | date: 'HH:mm' }}</div>
            </button>
          }
        </mat-menu>
      } @else {
        <div class="first-letter:uppercase text-xs xxs:text-sm">
          {{ eventDates()?.[0]?.start_at | date: 'EEE, dd/MM/yyyy, HH:mm' }}
        </div>
        <div class="text-xs xxs:text-sm">&nbsp; - {{ eventDates()?.[0]?.end_at | date: 'HH:mm' }}</div>
      }
    } @else {
      <p>{{ 'MISSION.DETAIL.NO_DATES_FOUND' | transloco }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatIcon, MatMenuModule, TranslocoPipe],
})
export class EventDatesComponent {
  eventDates = input<MissionInformationDate[]>([]);

  activeDate = computed<MissionInformationDate | null>(() => {
    const dates = this.eventDates();

    if (!dates?.length) {
      return null;
    }

    const now = new Date();

    const ongoing = dates.find((d) => new Date(d.start_at) <= now && new Date(d.end_at) >= now);

    if (ongoing) {
      return ongoing;
    }

    const upcoming = dates
      .filter((d) => new Date(d.start_at) > now)
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())?.[0];

    if (upcoming) {
      return upcoming;
    }

    return dates.at(-1);
  });
}
