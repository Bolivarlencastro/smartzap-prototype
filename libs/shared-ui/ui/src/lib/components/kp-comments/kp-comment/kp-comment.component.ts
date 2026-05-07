import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { constants } from '../../../constants';
import { KpLinebreakPipe } from '../../../pipes/kp-linebreak/kp-linebreak.pipe';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import { MatTooltip } from '@angular/material/tooltip';

export interface KpUserComment {
  avatar: string;
  name: string;
}

export interface KpComment {
  comment: string;
  user: KpUserComment;
  date: string;
}

@Component({
  selector: 'kp-comment',
  templateUrl: './kp-comment.component.html',
  imports: [MatTooltip, MatMenu, MatMenuItem, MatIconButton, MatMenuTrigger, MatIcon, TranslocoPipe, KpLinebreakPipe],
})
export class KpCommentComponent {
  @Input() public comment: KpComment;
  @Input() public isAuthor: boolean;
  @Input() public canDelete: boolean;
  @Input() userLanguage = '';
  @Output() public editEvent = new EventEmitter<any>();
  @Output() public deleteEvent = new EventEmitter<any>();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  readonly defaultUserAvatar = constants.defaultUserAvatar;

  onEdit(): void {
    this.editEvent.emit(this.comment);
  }

  onDelete(): void {
    this.deleteEvent.emit(this.comment);
  }
}
