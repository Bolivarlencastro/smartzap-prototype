import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { KpDescriptionDialogComponent } from '../kp-description-dialog/kp-description-dialog.component';
import { filter, tap } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'kp-description',
  imports: [MatButtonModule, NgxSkeletonLoaderModule, MatIconModule, TranslocoModule, MatTooltip],
  template: `<div class="summary">
      @if (canEdit) {
        <div class="summary-header flex justify-end items-center">
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
      <div class="rounded-md ck-editor break-words" [innerHTML]="description"></div>
    </div>

    <ng-template #loader>
      <div class="flex flex-col">
        <ngx-skeleton-loader [theme]="fullLineLoaderTheme"></ngx-skeleton-loader>
        <ngx-skeleton-loader [theme]="halfLineLoaderTheme"></ngx-skeleton-loader>
      </div>
    </ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpDescriptionComponent {
  @Input() description: string;
  @Input() loading: boolean;
  @Input() canEdit: boolean;
  @Output() update = new EventEmitter<string>();

  private readonly baseLoaderTheme = {
    'border-radius': '4px',
  };
  protected readonly fullLineLoaderTheme = { ...this.baseLoaderTheme, width: '100%' };
  protected readonly halfLineLoaderTheme = { ...this.baseLoaderTheme, width: '50%' };

  showmore: boolean;

  constructor(public dialog: MatDialog) {
    this.showmore = false;
  }

  showMore(): void {
    this.showmore = !this.showmore;
  }

  get showmoreLabel(): string {
    return this.showmore ? 'GENERAL.SHOW_LESS' : 'GENERAL.SHOW_MORE';
  }

  get showmoreIcon(): string {
    return this.showmore ? 'arrow_drop_up' : 'arrow_drop_down';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(KpDescriptionDialogComponent, {
      data: this.description,
      width: '60vw',
      autoFocus: 'dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((result) => this.update.emit(result)),
      )
      .subscribe();
  }
}
