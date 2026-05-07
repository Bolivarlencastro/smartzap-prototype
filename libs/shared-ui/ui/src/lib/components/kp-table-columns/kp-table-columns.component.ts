import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'kp-table-columns',
  imports: [TranslocoModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './kp-table-columns.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpTableColumnsComponent {}
