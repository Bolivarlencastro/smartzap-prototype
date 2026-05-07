import { Component, input, output } from '@angular/core';
import { Report } from '@core/api/model';
import { ChatbotDialogData, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatDivider } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import {
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
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ReportStatusDirective } from './report-status.directive';
import { MatIconButton, MatIconAnchor } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-latest-report-collection',
  templateUrl: './latest-report-collection.component.html',
  styleUrls: ['./latest-report-collection.component.scss'],
  imports: [
    InfiniteScrollDirective,
    MatDivider,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIcon,
    MatTooltip,
    ReportStatusDirective,
    MatIconButton,
    MatIconAnchor,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatProgressSpinner,
    DatePipe,
    TranslocoPipe,
    NgxSkeletonLoaderModule,
  ],
})
export class LatestReportCollectionComponent {
  latestReportResults = input<Report[]>();
  isLoading = input<boolean>();
  loadMoreItems = output<void>();
  openChatbot = output<ChatbotDialogData>();

  displayedColumns: string[] = ['report_name', 'requester', 'filters', 'created', 'status', 'id'];
  readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  constructor(private profileService: UserProfileService) {}

  requestMoreItems(): void {
    this.loadMoreItems.emit();
  }

  canUseIaChat(report: Report): boolean {
    return (
      this.profileService.hasRoles(['experimental_features']) &&
      report.file_format != 'PDF' &&
      report.report_type.name !== 'konquest-trails-completion-rate-export'
    );
  }

  openChatbotDialog(report: Report) {
    this.openChatbot.emit({ report_id: report.id, name: report.report_type?.name });
  }
}
