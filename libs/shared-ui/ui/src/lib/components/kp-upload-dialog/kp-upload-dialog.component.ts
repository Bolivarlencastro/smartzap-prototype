import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';

import { kpAnimations } from '../../animations';
import { Subscription } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconButton } from '@angular/material/button';
import { LowerCasePipe } from '@angular/common';

export type KpUploadDialogItem = {
  id: string;
  name: string;
  percentage?: number;
  loading?: boolean;
  subscription?: Subscription;
};

@Component({
  selector: 'kp-upload-dialog',
  templateUrl: './kp-upload-dialog.component.html',
  styleUrls: ['./kp-upload-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [kpAnimations],
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIconButton,
    MatProgressSpinner,
    MatIcon,
    LowerCasePipe,
    TranslocoPipe,
  ],
})
export class KpUploadDialogComponent {
  @Input() files: KpUploadDialogItem[] = [];
  @Output() remove = new EventEmitter<KpUploadDialogItem>();

  @ViewChild(MatExpansionPanel, { static: true })
  expansionPanel: MatExpansionPanel;

  onClickRemove(file: KpUploadDialogItem) {
    this.remove.emit(file);
  }

  uploadsTrackBy(_index: number, item: KpUploadDialogItem) {
    return item.id;
  }
}
