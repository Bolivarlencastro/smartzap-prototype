import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, KeyValuePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'kp-button-filter-group',
  templateUrl: './kp-button-filter-group.component.html',
  styleUrls: ['./kp-button-filter-group.component.scss'],
  imports: [MatButton, NgClass, KeyValuePipe, TranslocoPipe],
})
export class KpButtonFilterGroupComponent {
  @Input() ranges: any;
  @Input() selectedRange: any;
  @Output() clickEvent = new EventEmitter<any>();

  onClick(value: any): void {
    if (value === this.selectedRange) {
      return;
    }
    this.clickEvent.emit(value);
  }
}
