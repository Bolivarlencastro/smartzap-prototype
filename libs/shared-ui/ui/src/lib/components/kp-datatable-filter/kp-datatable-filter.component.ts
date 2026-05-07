import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { KpExportFormat } from '../kp-export-menu';
import { TranslocoPipe } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';

@Component({
  selector: 'kp-datatable-filter',
  templateUrl: './kp-datatable-filter.component.html',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    MatIcon,
    MatIconButton,
    MatMenuTrigger,
    MatTooltip,
    MatMenu,
    MatMenuItem,
    UpperCasePipe,
    TranslocoPipe,
  ],
})
export class KpDataTableFilterComponent implements AfterViewInit {
  @Input() filterLabel = '';
  @Input() filterPlaceholder = '';
  @Output() filterChanged = new EventEmitter();
  @Output() exportEvent = new EventEmitter();

  @ViewChild('input') input?: ElementRef = undefined;

  formats: KpExportFormat[] = ['csv', 'pdf'];

  ngAfterViewInit(): void {
    const searchInput = this.input?.nativeElement;
    fromEvent(this.input?.nativeElement, 'keyup')
      .pipe(
        map(() => searchInput.value.trim()),
        debounceTime(800),
        distinctUntilChanged(),
      )
      .subscribe((term) => this.filterChanged.emit(term));
  }

  exportDataTable(format: KpExportFormat): void {
    this.exportEvent.emit(format);
  }
}
