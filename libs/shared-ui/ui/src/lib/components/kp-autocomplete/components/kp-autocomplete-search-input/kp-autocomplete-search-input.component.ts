import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'kp-autocomplete-search-input',
  templateUrl: './kp-autocomplete-search-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, FormsModule, ReactiveFormsModule, TranslocoPipe],
})
export class KpAutocompleteSearchInputComponent implements AfterViewInit, OnDestroy {
  @Output() filterEvent = new EventEmitter<string>();
  searchFormControl = new FormControl('');

  private readonly unsubscribe = new Subject<void>();

  ngAfterViewInit() {
    this.registerInputEventEmitter();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  @HostListener('click', ['$event'])
  hostClick(event: MouseEvent) {
    event.stopPropagation();
  }

  private registerInputEventEmitter() {
    this.searchFormControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe((value) => this.filterEvent.emit(value));
  }
}
