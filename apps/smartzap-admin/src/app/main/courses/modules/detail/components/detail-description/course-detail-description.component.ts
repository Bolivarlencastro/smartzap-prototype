import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, take, tap } from 'rxjs';
import { DetailDescriptionDialogComponent } from '../detail-description-dialog/detail-description-dialog.component';

import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-course-detail-description',
  template: `
    <div class="course-detail-description">
      <div class="summary">
        @if (canEdit) {
          <div class="summary-header flex justify-end items-center mb-2">
            <button
              mat-icon-button
              aria-label="Edit summary"
              [matTooltip]="'GENERAL.EDIT' | transloco"
              (click)="openDialog()"
            >
              <mat-icon class="s-4">edit</mat-icon>
            </button>
          </div>
        }
        <div class="rounded-md ck-editor text-base leading-7" [innerHTML]="summary"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [MatIconButton, MatTooltip, MatIcon, TranslocoPipe],
})
export class CourseDetailDescriptionComponent {
  @Input() summary!: string;
  @Input() canEdit: boolean;
  @Output() update = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DetailDescriptionDialogComponent, {
      data: this.summary,
      width: '550px',
      autoFocus: 'dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((result) => this.update.emit(result)),
        take(1),
      )
      .subscribe();
  }
}
