import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatNoDataRow, MatTableDataSource } from '@angular/material/table';
import { EnrollmentTracking, EnrollmentTrackingCollection } from '@core/model/enrollment.model';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { DatePipe, LowerCasePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkTable,
} from '@angular/cdk/table';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';

@Component({
  selector: 'app-enrollment-tracking-collection',
  templateUrl: './enrollment-tracking-collection.component.html',
  styleUrls: ['./enrollment-tracking-collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  imports: [
    CdkTable,
    CdkColumnDef,
    CdkHeaderCellDef,
    CdkHeaderCell,
    CdkCellDef,
    CdkCell,
    MatTooltip,
    MatIcon,
    NgTemplateOutlet,
    NgClass,
    MatNoDataRow,
    CdkHeaderRowDef,
    CdkHeaderRow,
    CdkRowDef,
    CdkRow,
    LowerCasePipe,
    DatePipe,
    TranslocoPipe,
    KpDurationPipe,
    KpContentIconName,
  ],
})
export class EnrollmentTrackingCollectionComponent implements OnChanges {
  @Input() trackingList: unknown;
  @Input() isLoading!: boolean;

  displayedColumns: string[] = [
    'content-name',
    'first-access',
    'last-access',
    'consumption',
    'duration',
    'consumption_status',
  ];
  dataSourceEnrollmentTracking!: MatTableDataSource<EnrollmentTracking>;
  dataSourceEnrollmentTrackingCollection!: MatTableDataSource<EnrollmentTrackingCollection>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trackingList'] && this.trackingList) {
      if ((this.trackingList as EnrollmentTrackingCollection[])[0].track) {
        this.dataSourceEnrollmentTrackingCollection = new MatTableDataSource(
          this.trackingList as EnrollmentTrackingCollection[],
        );
      } else {
        this.dataSourceEnrollmentTracking = new MatTableDataSource(this.trackingList as EnrollmentTracking[]);
      }
    }
  }
}
