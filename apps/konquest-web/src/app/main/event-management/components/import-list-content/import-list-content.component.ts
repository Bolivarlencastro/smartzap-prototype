import { NgClass, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogContent } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import {
  ImportCheckModel,
  ImportMenuItem,
  MissionInformationDate,
  UsersImported,
} from '@app/main/mission/mission.model';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { ImportListViewMode } from '../../models/import-list';
import { DateRangePipe } from '../../pipes/date-range.pipe';

@Component({
  selector: 'app-import-list-content',
  templateUrl: './import-list-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDivider,
    MatIcon,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
    FormsModule,
    DateRangePipe,
    TitleCasePipe,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogContent,
    MatListModule,
    NgClass,
  ],
  styles: [
    `
      .bg-teams {
        background: url('/assets/images/integration-icons.png') -214px -146px;
      }

      .bg-meet {
        background: url('/assets/images/integration-icons.png') -78px -214px;
      }

      .bg-zoom {
        background: url('/assets/images/integration-icons.png') -146px -214px;
      }
    `,
  ],
})
export class ImportListContentComponent {
  viewMode = input<ImportListViewMode>();
  loading = input<boolean>();
  importData = input<ImportCheckModel>();
  importDataSource = input<UsersImported[]>();
  importSourceItems = input<ImportMenuItem[]>();
  dates = input<MissionInformationDate[]>();
  fileSelected = output<{ selectedDateId: string; file: File }>();

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  selectedDate = signal<MissionInformationDate>(null);

  displayedColumns = ['name', 'email', 'status'];
  enrolled: number;
  registered: number;
  not_registered: number;

  constructor() {
    this.buildImportStatistics();
    this.setInitialSelectedDate();
  }

  onFileChange() {
    const input = this.fileInput.nativeElement;

    const file: File = input?.files?.[0];
    if (!file) {
      return;
    }

    this.fileSelected.emit({ selectedDateId: this.selectedDate().id, file });
    input.value = null;
  }

  private buildImportStatistics() {
    effect(() => {
      if (!this.importData()) {
        return;
      }

      this.enrolled = this.importData()?.enrolled?.length || 0;
      this.registered = this.importData()?.registered?.length || 0;
      this.not_registered = this.importData()?.not_registered?.length || 0;
    });
  }

  private setInitialSelectedDate() {
    effect(() => {
      if (!this.dates()) {
        return;
      }

      this.selectedDate.set(this.dates()?.[0]);
    });
  }
}
