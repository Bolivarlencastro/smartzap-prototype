import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-float-button',
  templateUrl: './float-button.component.html',
  styleUrls: ['./float-button.component.scss'],
  imports: [MatMiniFabButton, MatTooltip, MatIcon],
})
export class FloatButtonComponent {
  @Input() iconName = 'add';
  @Input() tooltip = '';
  @Output() clickEvent = new EventEmitter<void>();
}
