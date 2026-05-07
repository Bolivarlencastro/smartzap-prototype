import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ProviderDto } from '../../model/external-providers.dto';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'kp-external-providers-list',
  imports: [MatTableModule, MatIconModule, MatProgressSpinnerModule, MatIconButton],
  templateUrl: './external-providers-list.component.html',
  styleUrls: ['./external-providers-list.components.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalProvidersListComponent {
  @Input() providers: ProviderDto[];
  @Input() isLoading: boolean;
  @Output() setIdProviderDelete = new EventEmitter<string>();
  @Output() editProvider = new EventEmitter<ProviderDto>();

  displayedColumns: string[] = ['icon', 'name', 'menu'];

  onDeleteProvider(idProvider: string) {
    this.setIdProviderDelete.emit(idProvider);
  }

  onEditProvider(provider: ProviderDto) {
    this.editProvider.emit(provider);
  }
}
