import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelCardInfo } from '@app/main/channel/channel.model';
import { KpImageCropperComponent } from '@keeps-platform-frontend-workspace/ui/kp-image-cropper';
import { filter, tap } from 'rxjs';
import { NgStyle } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatHint } from '@angular/material/form-field';
import { KpChannelCardComponent } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-channel-form-cover',
  templateUrl: './channel-form-cover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle, MatIcon, MatHint, KpChannelCardComponent, MatButton, TranslocoPipe],
})
export class ChannelFormCoverComponent {
  @Input() channelCard: ChannelCardInfo;
  @Output() coverChange = new EventEmitter<Event>();
  @Output() back = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @ViewChild('uploadCoverImageInput') uploadCoverImageInput: ElementRef;

  readonly defaultCoverImage = 'assets/images/channel-default-image.png';

  constructor(private _dialog: MatDialog) {
    this.channelCard = new ChannelCardInfo();
  }

  onSelectCoverImage(event: Event): void {
    this._dialog
      .open(KpImageCropperComponent, {
        autoFocus: false,
        disableClose: true,
        data: { fileEvent: event, aspectRatio: 1, resizeToWidth: 300, resizeToHeight: 300 },
      })
      .afterClosed()
      .pipe(
        tap(() => (this.uploadCoverImageInput.nativeElement.value = null)),
        filter((file) => !!file),
        tap((file) => this.coverChange.emit(file)),
      )
      .subscribe();
  }

  onBack(): void {
    this.back.emit();
  }

  onFinish(): void {
    this.save.emit();
  }
}
