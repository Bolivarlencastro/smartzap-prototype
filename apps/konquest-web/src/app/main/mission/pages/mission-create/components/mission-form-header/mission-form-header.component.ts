import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-mission-mission-form-header',
  templateUrl: './mission-form-header.component.html',
  styleUrls: ['./mission-form-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, TranslocoPipe],
})
export class MissionFormHeaderComponent {
  @Input() title!: string;
  @Input() label!: string;
  @Input() previousDisabled!: boolean;
  @Input() nextDisabled!: boolean;
  @Input() hidePrevious = false;
  @Input() hideNext = false;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onPreviousClick(): void {
    this.previous.emit();
  }

  onNextClick(): void {
    this.next.emit();
  }
}
