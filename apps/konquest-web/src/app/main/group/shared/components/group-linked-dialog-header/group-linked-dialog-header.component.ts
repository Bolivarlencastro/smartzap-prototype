import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogTitle, MatDialogClose } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-group-linked-dialog-header',
  templateUrl: './group-linked-dialog-header.component.html',
  styleUrls: ['./group-linked-dialog-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, MatIcon, TranslocoPipe],
})
export class GroupLinkedDialogHeaderComponent {
  @Input() dialogTitle!: string;
}
