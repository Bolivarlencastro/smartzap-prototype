import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@core/model';
import {
  KpVinculateListComponent,
  VinculateListColumnDefinition,
} from '@keeps-platform-frontend-workspace/ui/kp-vinculate-list';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { MatTooltip } from '@angular/material/tooltip';
import { BasicUserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';

marker('BATCH_ENROLLMENT.SELECTION_LABEL.PLURAL');
marker('BATCH_ENROLLMENT.SELECTION_LABEL.SINGULAR');

@Component({
  selector: 'app-batch-enrollments-list',
  templateUrl: './batch-enrollments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    KpGlobalSearchInputComponent,
    MatAnchor,
    MatButton,
    MatIcon,
    KpVinculateListComponent,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
    MatIconButton,
    MatTooltip,
  ],
})
export class BatchEnrollmentsListComponent {
  @Input({ required: true }) users: BasicUserProfile[];
  @Input({ required: true }) selection: Record<string, string>;
  @Input() selectionSize: number;
  @Input() loading: boolean;
  @Output() userSelectionToggle = new EventEmitter<string>();
  @Output() selectAllToggle = new EventEmitter<boolean>();
  @Output() loadMore = new EventEmitter();
  @Output() searchChange = new EventEmitter<string>();
  @Output() fileSelected = new EventEmitter<File>();

  protected readonly MODEL_SPREADSHEET_LINK =
    'https://media.keepsdev.com/konquest/templates-spreadsheets/parser_emails_to_users.xlsx';

  protected readonly columns: VinculateListColumnDefinition<User>[] = [
    {
      title: 'Nome',
      property: 'name',
    },
    { title: 'E-mail', property: 'email' },
  ];

  onFilter(search: string) {
    this.searchChange.emit(search);
  }

  onToggleSelection(id: string) {
    this.userSelectionToggle.emit(id);
  }

  onToggleSelectAll(selected: boolean) {
    this.selectAllToggle.emit(selected);
  }

  onScroll(): void {
    this.loadMore.emit();
  }

  fileChange(fileInput: HTMLInputElement) {
    if (!fileInput.files?.[0]) return;

    const file: File = fileInput?.files?.[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }
}
