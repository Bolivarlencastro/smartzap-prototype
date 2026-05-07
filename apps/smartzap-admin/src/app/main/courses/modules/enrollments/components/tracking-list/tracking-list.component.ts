import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Enrollment } from 'app/main/courses/model';
import { RenewAccess } from 'app/main/courses/model/tracking';

import { TrackingListItemComponent } from '../tracking-list-item/tracking-list-item.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-tracking-list',
  templateUrl: './tracking-list.component.html',
  styleUrls: ['./tracking-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TrackingListItemComponent, MatProgressSpinner, MatIcon, TranslocoPipe],
})
export class TrackingListComponent {
  @Input() enrollment!: Enrollment;
  @Input() datasource: any = [];
  @Input() isLoading!: boolean;
  @Input() isVisibilitySendLink!: boolean;
  @Output() renewAccessSelected = new EventEmitter<RenewAccess>();

  public emitterRenewAccess(element: any): void {
    const enrollment_id = this.enrollment.id;
    const content_id = element.content.id;
    this.renewAccessSelected.emit({ enrollment_id: enrollment_id || '', content_id });
  }
}
