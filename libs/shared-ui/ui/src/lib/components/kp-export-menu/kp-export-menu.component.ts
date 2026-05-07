import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { KpExportFormat } from './kp-export-format';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'kp-export-menu',
  templateUrl: './kp-export-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, TranslocoPipe],
})
export class KpExportMenuComponent {
  @Input() disabled: boolean;
  @Input() icon = 'download';
  @Input() label: string = marker('UI.GENERAL.EXPORT');
  @Output() export = new EventEmitter<KpExportFormat>();

  optionSelected(exportType: KpExportFormat) {
    this.export.emit(exportType);
  }
}
