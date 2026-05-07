import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { fuseAnimations, FuseCardModule } from '@keeps-platform-frontend-workspace/layout';
import { environment } from 'environments/environment';
import { KpCardModel } from './kp-card.model';
import { isBefore } from 'date-fns';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDivider } from '@angular/material/divider';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'kp-card',
  templateUrl: './kp-card.component.html',
  styleUrls: ['./kp-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: fuseAnimations,
  imports: [
    FuseCardModule,
    MatIconButton,
    NgClass,
    MatTooltip,
    MatIcon,
    MatProgressBar,
    MatDivider,
    MatButton,
    MatChipListbox,
    MatChipOption,
    DecimalPipe,
    DatePipe,
    TranslocoPipe,
  ],
})
export class KpCardComponent implements OnInit {
  @Input() public data!: KpCardModel;
  @Input() public showProgress!: boolean;
  @Input() public hideOverlay!: boolean;
  @Input() public buttonLabel!: string;
  @Input() public showBookmarkOnTop = true;
  @Input() public showAvatar = true;
  @Input() public showBookmark = true;
  @Output() public clickEvent = new EventEmitter<any>();
  @Output() public favoriteEvent = new EventEmitter<any>();
  @Input() public animationDelay = 0;

  flipped = false;
  favorited: boolean;
  readonly defaultUserAvatar = environment.defaultUserAvatar;

  public progressClass: string;

  private _image!: SafeStyle;
  private _tags!: any[];

  constructor(public sanitizer: DomSanitizer) {
    this.progressClass = 'kp-card-progress-primary';

    this.favorited = this.data && !!this.data.bookmark_id;
  }

  ngOnInit(): void {
    this.image = this.data.image;
    this.tags = this.data.tags;
    this.defineProgressClassName(this.data.goalDate, this.data.status);
  }

  public set image(image: string) {
    if (!image) {
      this._image = `url("https://assets.keepsdev.com/images/placeholders/default-card-bg.png")`;
      return;
    }
    this._image = this.sanitizer.bypassSecurityTrustStyle(`url("${image}")`);
  }

  public get image(): SafeStyle {
    return this._image;
  }

  public set tags(tags: any[]) {
    if (!tags) {
      this._tags = [];
      return;
    }

    if (tags.length > 3) {
      tags = tags.slice(0, 3);
    }

    const colors = ['warn', 'accent', 'warn-A100'];

    this._tags = tags.map((tag, index) => ({
      title: tag,
      color: colors[index],
    }));
  }

  public get tags(): any[] {
    return this._tags;
  }

  // Actions
  onClick(event?: any): void {
    this.clickEvent.emit(this.data);
    event.stopPropagation();
  }

  onFavorite(event?: any): void {
    event.stopPropagation();
    this.favorited = !this.favorited;
    this.favoriteEvent.emit(this.data);
  }

  unflip(): void {
    this.flipped = false;
  }

  // PRIVATE
  private defineProgressClassName(goalDate: Date, status: string): void {
    if (!goalDate || !status) {
      return;
    }

    const isBeforeToday = isBefore(goalDate, new Date());

    // Adiciona a classe warn a progressbar caso o status da
    // missão ainda não tenha sido completado e a data do objetivo
    // já tenha sido ultrapassada.
    if (status !== 'COMPLETED' && isBeforeToday) {
      this.progressClass = 'kp-card-progress-warn';
    }
  }
}
