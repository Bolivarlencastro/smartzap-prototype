import { Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'kp-group-linked-dialog-header',
  templateUrl: './kp-group-linked-dialog-header.component.html',
  imports: [MatDivider, TranslocoPipe],
})
export class KpGroupLinkedDialogHeaderComponent {
  @Input() title: string;
}
