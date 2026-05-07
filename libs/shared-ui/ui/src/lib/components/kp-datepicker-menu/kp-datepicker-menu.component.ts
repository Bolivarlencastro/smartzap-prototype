import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { TranslocoModule } from '@jsverse/transloco';
import { isEqual } from 'date-fns';

@Component({
  selector: 'kp-datepicker-menu',
  imports: [MatDatepickerModule, TranslocoModule],
  templateUrl: './kp-datepicker-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpDatepickerMenuComponent implements OnChanges {
  @Input() currentDate: Date;
  @Input() opened: boolean;
  @Output() closeCalendar = new EventEmitter<Date | void>();
  @ViewChild(MatCalendar) matCalendar: MatCalendar<Date>;
  selectedDate: Date;

  get minDate() {
    return new Date();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['opened'] && this.opened) {
      this.initCalendar();
    }
  }

  onSelectedDateChange(date: Date): void {
    this.selectedDate = date;
  }

  close(): void {
    this.closeCalendar.emit();
  }

  submit(): void {
    if (isEqual(this.selectedDate, this.currentDate)) {
      this.close();
      return;
    }

    const resultDate = this.selectedDate;
    this.closeCalendar.emit(resultDate);
  }

  private initCalendar(): void {
    this.selectedDate = new Date(this.currentDate);

    if (this.matCalendar) {
      this.matCalendar.startAt = this.selectedDate;
      this.matCalendar.activeDate = this.selectedDate;
      this.matCalendar.currentView = 'month';
    }
  }
}
