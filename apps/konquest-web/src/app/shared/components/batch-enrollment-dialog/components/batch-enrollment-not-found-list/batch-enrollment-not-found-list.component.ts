import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MatIcon } from '@angular/material/icon';

import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

marker('BATCH_ENROLLMENT.NOT_FOUND.PLURAL');
marker('BATCH_ENROLLMENT.NOT_FOUND.SINGULAR');

@Component({
  selector: 'app-batch-enrollment-not-found-list',
  templateUrl: './batch-enrollment-not-found-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, KpPluralizeTranslatePipe],
})
export class BatchEnrollmentNotFoundListComponent {
  @Input({ required: true }) notFounds: string[] = [];
}
